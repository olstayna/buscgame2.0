import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface SlideItem {
  image: string;
  title: string;
  description: string;
  price: string;
}

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss'
})
export class HeroComponent implements OnInit {
  currentSlide = 0;
  
  slides: SlideItem[] = [
    {
      image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1172620/library_hero.jpg',
      title: 'Sea of Thieves',
      description: 'Embarque em uma aventura épica no mar dos piratas. Explore um vasto mundo aberto, encontre tesouros e enfrente outros jogadores em batalhas navais intensas.',
      price: 'R$ 199,90',
    },
    {
      image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1190460/library_hero.jpg',
      title: 'Death Stranding',
      description: 'Da mente criativa de Hideo Kojima, uma experiência única que desafia os limites entre vida e morte em um mundo pós-apocalíptico.',
      price: 'R$ 249,90'
    },
    {
      image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/594570/library_hero.jpg',
      title: 'Total War: Warhammer II',
      description: 'Comande exércitos lendários em batalhas épicas neste jogo de estratégia que combina guerra total com um mundo de fantasia sombria.',
      price: 'R$ 159,90'
    },
    {
      image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/287700/library_hero.jpg',
      title: 'Metal Gear Solid V',
      description: 'Experimente a culminação da visão de Hideo Kojima em um thriller de espionagem tático que redefine os limites da liberdade de jogabilidade.',
      price: 'R$ 179,90'
    }
  ];

  ngOnInit(): void {
    // Iniciar o carrossel automático
    setInterval(() => {
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
}
