import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameService } from 'src/app/services/game.service';
import { Game } from 'src/app/interfaces/game.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss'
})
export class HeroComponent implements OnInit, OnDestroy {
  currentSlide = 0;
  slides: Game[] = [];
  isLoading = true;
  error: string | null = null;
  private autoSlideInterval: any;
  private subscription: Subscription = new Subscription();

  constructor(private gameService: GameService) {}

  ngOnInit(): void {
    this.loadFeaturedGames();
    this.startAutoSlide();
  }

  ngOnDestroy(): void {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
    }
    this.subscription.unsubscribe();
  }

  private loadFeaturedGames(): void {
    this.isLoading = true;
    this.error = null;
    
    this.subscription.add(
      this.gameService.getFeaturedGames().subscribe({
        next: (games) => {
          this.slides = games;
          this.isLoading = false;
        },
        error: (error) => {
          this.error = 'Falha ao carregar os jogos. Por favor, tente novamente mais tarde.';
          this.isLoading = false;
        }
      })
    );
  }

  /**
   * Trata erros de carregamento de imagem e aplica fallback
   * @param event Evento de erro
   * @param slide Slide atual
   */
  handleImageError(event: any, slide: Game): void {
    const imgElement = event.target;
    console.error(`Erro ao carregar imagem para ${slide.title}:`, event);
    
    if (this.isImageFromSteam(slide)) {
      // Se a imagem da Steam falhou, tentar usar as imagens da API ITAD
      if (slide.assets?.banner600) {
        imgElement.src = slide.assets.banner600;
      } else {
        this.tryFallbackImages(imgElement, slide);
      }
    } else {
      this.tryFallbackImages(imgElement, slide);
    }
  }

  /**
   * Tenta usar imagens de fallback disponíveis
   * @param imgElement Elemento de imagem
   * @param slide Slide atual
   */
  private tryFallbackImages(imgElement: HTMLImageElement, slide: Game): void {
    const fallbackSrc = slide.assets?.banner400 || slide.assets?.banner300 || slide.assets?.boxart;
    if (fallbackSrc) {
      imgElement.src = fallbackSrc;
    }
    // Previne loops infinitos de erro
    imgElement.onerror = null;
  }

  private startAutoSlide(): void {
    this.autoSlideInterval = setInterval(() => {
      this.nextSlide();
    }, 5000);
  }

  prevSlide(): void {
    this.currentSlide = this.currentSlide > 0 ? this.currentSlide - 1 : this.slides.length - 1;
  }

  nextSlide(): void {
    this.currentSlide = this.currentSlide < this.slides.length - 1 ? this.currentSlide + 1 : 0;
  }

  goToSlide(index: number): void {
    this.currentSlide = index;
  }

  /**
   * Verifica se a imagem do slide vem da CDN da Steam
   * @param slide Slide para verificar
   * @returns true se a imagem vier da CDN da Steam, false caso contrário
   */
  isImageFromSteam(slide: Game): boolean {
    return slide.image?.includes('cdn.cloudflare.steamstatic.com') || false;
  }
}