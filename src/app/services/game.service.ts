import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, map, of, forkJoin, switchMap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiResponse, DealResponse, Game } from '../interfaces/game.model';

@Injectable({
    providedIn: 'root'
})
export class GameService {
    private readonly baseUrl = environment.apiUrl;
    private readonly steamCdnUrl = 'https://cdn.cloudflare.steamstatic.com/steam/apps';

    constructor(private http: HttpClient) { }

    /**
     * Fetches featured games sorted by trending
     * @returns Observable of Game array
     */
    getFeaturedGames(): Observable<Game[]> {
        return this.getDeals({
            country: 'BR',
            currency: 'BRL',
            limit: '4',
            sort: '-trending',
            nondeals: 'false',
            mature: 'false'
        }).pipe(
            map(response => response.games),
            switchMap(games => this.enrichGamesWithSteamData(games))
        );
    }

    /**
     * Busca jogos populares ordenados por rank
     * @returns Observable de Game array com apenas título e imagem
     */
    getPopularGames(): Observable<Game[]> {
        return this.getDeals({
            country: 'BR',
            currency: 'BRL',
            limit: '4',
            sort: 'rank',
            nondeals: 'false',
            mature: 'false'
        }).pipe(
            map(response => response.games),
            switchMap(games => this.enrichGamesWithSteamData(games)),
            map(games => games.map(game => ({
                id: game.id,
                title: game.title,
                image: game.image,
                price: game.price,
                originalPrice: game.originalPrice,
                discount: game.discount,
                storeUrl: game.storeUrl,
                assets: game.assets,
                steamAppId: game.steamAppId
            })))
        );
    }

    /**
     * Fetches games on sale
     * @returns Observable of Game array
     */
    getGameDeals(): Observable<Game[]> {
        return this.getDeals({
            country: 'BR',
            currency: 'BRL',
            limit: '4',
            sort: '-cut',
            nondeals: 'false',
            mature: 'false'
        }).pipe(
            map(response => response.games)
        );
    }

    /**
     * Busca jogos com paginação e diferentes ordenações
     * @param sort Tipo de ordenação (-trending, -time, price)
     * @param offset Offset para paginação
     * @param limit Limite de jogos por página
     * @returns Observable de Game array
     */
    getGamesList(sort: string, offset: number = 0, limit: number = 12): Observable<{games: Game[], total: number}> {
        return this.getDeals({
            country: 'BR',
            currency: 'BRL',
            limit: limit.toString(),
            offset: offset.toString(),
            sort: sort,
            nondeals: 'false',
            mature: 'false'
        }).pipe(
            map(response => {
                const total = response.total;
                return {
                    games: response.games,
                    total: total
                };
            })
        );
    }

    /**
     * Generic method to fetch deals with different parameters
     * @param params HttpParams to be sent with the request
     * @returns Observable of Game array and total count
     */
    private getDeals(params: Record<string, string>): Observable<{games: Game[], total: number}> {
        const url = `${this.baseUrl}/deals/v2`;

        // Criar HttpParams a partir do objeto params
        let httpParams = new HttpParams();
        Object.entries(params).forEach(([key, value]) => {
            httpParams = httpParams.set(key, value);
        });

        // Adicionar a chave da API apenas se estiver definida
        if (environment.apiKey) {
            httpParams = httpParams.set('key', environment.apiKey);
        }

        return this.http.get<ApiResponse<DealResponse>>(url, {
            params: httpParams
        }).pipe(
            map(response => {
                const games = this.mapResponseToGames(response);
                const currentTotal = games.length;
                const hasMore = response.hasMore || false;
                const estimatedTotal = hasMore ? currentTotal + 20 : currentTotal;
                
                return {
                    games,
                    total: estimatedTotal
                };
            }),
            catchError(error => {
                console.error('Erro ao buscar jogos:', error);
                return of({ games: [], total: 0 });
            })
        );
    }

    /**
     * Enriquece os jogos com dados da Steam (appId e imagens de alta qualidade)
     * @param games Lista de jogos para enriquecer
     * @returns Observable com a lista de jogos enriquecida
     */
    private enrichGamesWithSteamData(games: Game[]): Observable<Game[]> {
        if (!games || games.length === 0) {
            return of([]);
        }

        const enrichedGames$ = games.map(game => {
            return this.getGameInfo(game.id).pipe(
                map(gameInfo => {
                    if (gameInfo && gameInfo.appid) {
                        const steamAppId = gameInfo.appid.toString();
                        game.steamAppId = steamAppId;
                        
                        // Construir URLs das imagens da Steam
                        const libraryHeroUrl = `${this.steamCdnUrl}/${steamAppId}/library_hero.jpg`;
                        const headerUrl = `${this.steamCdnUrl}/${steamAppId}/header.jpg`;
                        
                        // Verificar qual imagem está disponível
                        return this.checkImageExists(libraryHeroUrl).pipe(
                            switchMap(heroExists => {
                                if (heroExists) {
                                    game.image = libraryHeroUrl;
                                    return of(game);
                                }
                                
                                return this.checkImageExists(headerUrl).pipe(
                                    map(headerExists => {
                                        if (headerExists) {
                                            game.image = headerUrl;
                                        }
                                        return game;
                                    })
                                );
                            })
                        );
                    }
                    return of(game);
                }),
                switchMap(result => result instanceof Observable ? result : of(result)),
                catchError(error => {
                    console.error(`Erro ao enriquecer dados para ${game.title}:`, error);
                    return of(game);
                })
            );
        });

        return forkJoin(enrichedGames$).pipe(
            map(games => games.filter((game): game is Game => game !== null))
        );
    }

    /**
     * Obtém informações detalhadas de um jogo usando o endpoint games/info/v2
     * @param gameId ID do jogo
     * @returns Observable com as informações do jogo
     */
    private getGameInfo(gameId: string): Observable<any> {
        const url = `${this.baseUrl}/games/info/v2`;
        
        let httpParams = new HttpParams()
            .set('id', gameId);

        if (environment.apiKey) {
            httpParams = httpParams.set('key', environment.apiKey);
        }

        return this.http.get(url, { params: httpParams }).pipe(
            map((response: any) => {
                return response;
            }),
            catchError(error => {
                return of(null);
            })
        );
    }

    /**
     * Verifica se uma URL de imagem existe
     * @param url URL da imagem
     * @returns Observable<boolean> indicando se a imagem existe
     */
    private checkImageExists(url: string): Observable<boolean> {
        return this.http.get(url, { responseType: 'blob' }).pipe(
            map(() => true),
            catchError(() => of(false))
        );
    }

    /**
     * Maps API response to Game model
     * @param response API response
     * @returns Array of Game objects
     */
    private mapResponseToGames(response: any): Game[] {
        if (!response || (!response.list && !response.data) || (!Array.isArray(response.list) && !Array.isArray(response.data))) {
            console.error('Estrutura de resposta da API inesperada:', response);
            return [];
        }

        const gameList = response.list || response.data;
        return gameList.map((game: any) => this.mapDealToGame(game));
    }

    /**
     * Maps a single deal to Game model
     * @param deal Deal data from API
     * @returns Game object
     */
    private mapDealToGame(deal: any): Game {
        
        const price = deal.deal?.price?.amount || 0;
        const originalPrice = deal.deal?.regular?.amount || price;
        const discount = deal.deal?.cut || 0;
        
        const gameId = deal.id || deal.plain || `game-${Date.now()}`;
        
        const image = deal.assets?.boxart || deal.assets?.banner600 || 'assets/images/notfound.png';
        
        return {
            id: gameId,
            title: deal.title || 'Jogo desconhecido',
            image: image,
            price: price,
            originalPrice: originalPrice,
            discount: discount,
            storeUrl: deal.url || '',
            assets: deal.assets || {}
        };
    }

    // Gets authorization headers for API requests
    // @returns HttpHeaders with authorization

    // private getAuthHeaders(): HttpHeaders {
    //     return new HttpHeaders({
    //         'Authorization': `Bearer ${environment.apiKey}`
    //     });
    // }
}