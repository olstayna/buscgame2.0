import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  standalone: true,
  imports: [CommonModule, RouterLink]
})
export class FooterComponent {
  socialLinks = [
    { url: 'https://taynasantana.com.br', icon: 'fas fa-globe'},
    { url: 'https://github.com/olstayna', icon: 'fab fa-github' },
    { url: 'https://www.linkedin.com/in/olstayna/', icon: 'fab fa-linkedin-in' }
  ];

  navLinks = [
    { title: 'Catálogo', route: '/catalog' },
    { title: 'Garantias', route: '/warranty' },
    { title: 'Avaliações', route: '/reviews' },
    { title: 'Suporte', route: '/support' }
  ];
}