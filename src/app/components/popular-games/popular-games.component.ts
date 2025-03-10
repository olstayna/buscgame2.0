import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameService } from 'src/app/services/game.service';
import { Game } from 'src/app/interfaces/game.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-popular-games',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './popular-games.component.html',
  styleUrl: './popular-games.component.scss'
})
export class PopularGamesComponent implements OnInit, OnDestroy {
  private subscription = new Subscription();
  games: Game[] = [];
  isLoading = true;
  error: string | null = null;

  constructor(private gameService: GameService) {}

  ngOnInit(): void {
    this.loadPopularGames();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private loadPopularGames(): void {
    this.isLoading = true;
    this.error = null;

    this.subscription.add(
      this.gameService.getPopularGames().subscribe({
        next: (games) => {
          this.games = games;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Erro ao carregar jogos populares:', error);
          this.error = 'Falha ao carregar os jogos populares.';
          this.isLoading = false;
        }
      })
    );
  }

  /**
   * Trata erros de carregamento de imagem
   * @param event Evento de erro
   * @param game Jogo atual
   */
  handleImageError(event: Event, game: Game): void {
    const imgElement = event.target as HTMLImageElement;
    console.error(`Erro ao carregar imagem para ${game.title}:`, event);
    
    if (game.assets?.banner600) {
      imgElement.src = game.assets.banner600;
    } else if (game.assets?.banner400) {
      imgElement.src = game.assets.banner400;
    } else if (game.assets?.boxart) {
      imgElement.src = game.assets.boxart;
    }
  }
} 