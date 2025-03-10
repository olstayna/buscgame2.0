import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameService } from '../../services/game.service';
import { Game } from '../../interfaces/game.model';
import { NzSpinModule } from 'ng-zorro-antd/spin';

@Component({
  selector: 'app-popular-games',
  standalone: true,
  imports: [CommonModule, NzSpinModule],
  templateUrl: './popular-games.component.html',
  styleUrls: ['./popular-games.component.scss']
})
export class PopularGamesComponent implements OnInit {
  games: Game[] = [];
  isLoading = true;
  error: string | null = null;

  constructor(private gameService: GameService) {}

  ngOnInit() {
    this.loadGames();
  }

  loadGames() {
    this.isLoading = true;
    this.error = null;
    
    this.gameService.getPopularGames().subscribe({
      next: (games) => {
        this.games = games;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar jogos populares:', err);
        this.error = 'Erro ao carregar jogos populares';
        this.isLoading = false;
      }
    });
  }

  /**
   * Trata erros de carregamento de imagem
   * @param event Evento de erro
   * @param game Jogo atual
   */
  handleImageError(event: Event, game: Game) {
    const img = event.target as HTMLImageElement;
    img.src = game.assets?.banner600 || 'assets/images/placeholder.jpg';
  }
} 