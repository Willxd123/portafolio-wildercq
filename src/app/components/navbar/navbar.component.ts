import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, Inject, PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements AfterViewInit {

  menuItems = ['Inicio', 'Habilidades', 'Sobre mí',];
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.animateItems();
    }
  }

  animateItems() {
    const items = document.querySelectorAll('.navbar-item');
    items.forEach((item, index) => {
      setTimeout(() => {
        item.classList.add('entrada');
        item.setAttribute('style', 'opacity: 1'); // Hacemos el elemento visible
      }, index * 200); // Ajusta el tiempo (200ms) según sea necesario
    });
  }
}
