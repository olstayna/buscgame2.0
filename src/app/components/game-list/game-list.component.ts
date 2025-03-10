import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameService } from 'src/app/services/game.service';
import { Game } from 'src/app/interfaces/game.model';
import { Subscription } from 'rxjs';

type FilterType = 'destaques' | 'ofertas' | 'menorpreco';

interface FilterConfig {
  sort: string;
  label: string;
}

@Component({
  selector: 'app-game-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './game-list.component.html',
  styleUrl: './game-list.component.scss'
})
export class GameListComponent implements OnInit, OnDestroy {
  private subscription = new Subscription();
  activeFilter: FilterType = 'destaques';
  games: Game[] = [];
  isLoading = false;
  isLoadingMore = false;
  error: string | null = null;
  totalGames = 0;
  readonly itemsPerRow = 4;
  readonly initialRows = 3;

  readonly filterConfigs: Record<FilterType, FilterConfig> = {
    destaques: { sort: '-trending', label: 'Destaques' },
    ofertas: { sort: '-time', label: 'Ofertas' },
    menorpreco: { sort: 'price', label: 'Menor preço' }
  };

  constructor(private gameService: GameService) {}

  ngOnInit(): void {
    this.loadInitialGames();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  setActiveFilter(filter: FilterType, event: Event): void {
    event.preventDefault();
    if (this.activeFilter === filter) return;
    
    this.activeFilter = filter;
    this.games = [];
    this.loadInitialGames();
    
    const links = document.querySelectorAll('nav.nav-filters a');
    links.forEach(link => link.classList.remove('active'));
    (event.target as HTMLElement).classList.add('active');
  }

  loadMore(): void {
    if (this.isLoadingMore) return;
    
    this.isLoadingMore = true;
    const nextOffset = this.games.length;
    const sort = this.filterConfigs[this.activeFilter].sort;

    this.subscription.add(
      this.gameService.getGamesList(sort, nextOffset, this.itemsPerRow).subscribe({
        next: (response) => {
          this.games = [...this.games, ...response.games];
          this.totalGames = response.total;
          this.isLoadingMore = false;
        },
        error: (error) => {
          this.error = 'Falha ao carregar mais jogos. Por favor, tente novamente mais tarde.';
          this.isLoadingMore = false;
        }
      })
    );
  }

  private loadInitialGames(): void {
    if (this.isLoading) return;
    
    this.isLoading = true;
    this.error = null;
    const sort = this.filterConfigs[this.activeFilter].sort;
    const initialItems = this.initialRows * this.itemsPerRow;

    this.subscription.add(
      this.gameService.getGamesList(sort, 0, initialItems).subscribe({
        next: (response) => {
          this.games = response.games;
          this.totalGames = response.total;
          this.isLoading = false;
        },
        error: (error) => {
          this.error = 'Falha ao carregar os jogos. Por favor, tente novamente mais tarde.';
          this.isLoading = false;
        }
      })
    );
  }

  get showLoadMore(): boolean {
    const temMaisJogos = this.games.length < this.totalGames;
    return temMaisJogos;
  }
} 