import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Game {
  id: number;
  title: string;
  image: string;
  price: number;
  originalPrice?: number;
  discount?: number;
}

@Component({
  selector: 'app-game-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './game-list.component.html',
  styleUrl: './game-list.component.scss'
})
export class GameListComponent {
  activeFilter: string = 'novidades';

  games: Game[] = [
    {
      id: 1,
      title: 'Mafia: Definitive Edition',
      image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1030840/library_600x900.jpg',
      price: 1260,
      originalPrice: 1500,
      discount: 15
    },
    {
      id: 2,
      title: 'The Survivalists',
      image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/897450/library_600x900.jpg',
      price: 160
    },
    {
      id: 3,
      title: 'Mount & Blade II: Bannerlord',
      image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/261550/library_600x900.jpg',
      price: 2200
    },
    {
      id: 4,
      title: 'Metro Exodus',
      image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/412020/library_600x900.jpg',
      price: 750,
      originalPrice: 900,
      discount: 20
    },
    {
      id: 5,
      title: 'PUBG: Battlegrounds',
      image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/578080/library_600x900.jpg',
      price: 720
    },
    {
      id: 6,
      title: 'Dark Souls III',
      image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/374320/library_600x900.jpg',
      price: 1600
    },
    {
      id: 7,
      title: 'Naruto Shippuden: Ultimate Ninja Storm 4',
      image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/349040/library_600x900.jpg',
      price: 700,
      originalPrice: 1000,
      discount: 30
    },
    {
      id: 8,
      title: 'Star Wars Jedi: Fallen Order',
      image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1172380/library_600x900.jpg',
      price: 1000
    }
  ];

  setActiveFilter(filter: string, event: Event): void {
    event.preventDefault();
    this.activeFilter = filter;
    
    // Remove active class from all links
    const links = document.querySelectorAll('nav.nav-filters a');
    links.forEach(link => link.classList.remove('active'));
    
    // Add active class to clicked link
    (event.target as HTMLElement).classList.add('active');
    
    // Here you would typically filter the games based on the selected filter
    // For now, we're just updating the UI
  }
} 