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
  selector: 'app-popular-games',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './popular-games.component.html',
  styleUrl: './popular-games.component.scss'
})
export class PopularGamesComponent {
    games: Game[] = [
    { id: 1, title: 'Doom Eternal', image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/782330/library_hero.jpg', price: 199.99, originalPrice: 249.99, discount: 20 },
    { id: 2, title: 'Rocket League', image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/252950/library_hero.jpg', price: 149.99, originalPrice: 199.99, discount: 25 },
    { id: 3, title: 'Tom Clancy’s Rainbow Six Siege', image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/359550/library_hero.jpg', price: 99.99 },
    { id: 4, title: 'The Elder Scrolls V: Skyrim', image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/72850/library_hero.jpg', price: 89.99 }
  ];
} 