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

  menuItems = ['Inicio', 'Habilidades', 'Experiencia', 'Sobre mí'];
  mobileMenuOpen = false;
  
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.animateItems();
    }
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  // Método para convertir el nombre del menú a ID de sección
  getMenuId(item: string): string {
    return item
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '');
  }

  animateItems() {
    const items = document.querySelectorAll('.navbar-item');
    items.forEach((item, index) => {
      setTimeout(() => {
        item.classList.add('entrada');
        item.setAttribute('style', 'opacity: 1');
      }, index * 200);
    });
  }
}