import { CommonModule, isPlatformBrowser } from '@angular/common';
import { afterNextRender, AfterViewInit, Component, HostListener, inject, Inject, PLATFORM_ID } from '@angular/core';
import { IdiomaServicio } from '../servicios/idioma.servicio';
import { LottieServicio } from '../servicios/lottie.servicio';
import { LottieComponent } from 'ngx-lottie';
import type { AnimationItem } from 'lottie-web';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, LottieComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements AfterViewInit {

  menuItems = ['Inicio', 'Proyectos', 'Habilidades', 'Experiencia', 'Sobre mí', 'Formación'];
  mobileMenuOpen = false;
  readonly idioma = inject(IdiomaServicio);
  private readonly lottieServicio = inject(LottieServicio);
  readonly lottieOptions = this.lottieServicio.crearOpciones('/assets/json/traductor-animacion.json', true, false);
  languageMenuOpen = false;
  translationError = false;
  private languageAnimation?: AnimationItem;
  
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    afterNextRender(() => this.iniciarTraductor());
  }

  animationCreated(animation: AnimationItem): void { this.languageAnimation = animation; }

  toggleLanguageMenu(): void {
    this.languageMenuOpen = !this.languageMenuOpen;
    this.mobileMenuOpen = false;
    if (this.languageMenuOpen && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) this.languageAnimation?.play();
    else this.languageAnimation?.stop();
  }

  seleccionarIdioma(codigo: string): void {
    this.languageMenuOpen = false;
    this.languageAnimation?.stop();
    if (codigo !== this.idioma.idiomaActual()) this.idioma.cambiarIdioma(codigo);
  }

  @HostListener('document:keydown.escape')
  cerrarIdioma(): void { this.languageMenuOpen = false; this.languageAnimation?.stop(); }

  @HostListener('document:click', ['$event'])
  cerrarAlSalir(event: MouseEvent): void {
    if (!(event.target as Element)?.closest('[data-language-menu]')) this.cerrarIdioma();
  }

  private iniciarTraductor(): void {
    const translateWindow = window as Window & {
      portfolioTranslateInit?: () => void;
      google?: { translate: { TranslateElement: new (options: object, container: string) => unknown } };
    };
    const crear = () => {
      if (!document.getElementById('google_translate_element')?.hasChildNodes()) {
        new translateWindow.google!.translate.TranslateElement({ pageLanguage: 'es', includedLanguages: 'es,en,pt', autoDisplay: false }, 'google_translate_element');
      }
      this.idioma.sincronizarEstadoActual();
    };
    if (translateWindow.google?.translate?.TranslateElement) { crear(); return; }
    translateWindow.portfolioTranslateInit = crear;
    if (document.getElementById('portfolio-google-translate')) return;
    const script = document.createElement('script');
    script.id = 'portfolio-google-translate';
    script.async = true;
    script.src = 'https://translate.google.com/translate_a/element.js?cb=portfolioTranslateInit';
    script.onerror = () => { this.translationError = true; script.remove(); };
    document.head.appendChild(script);
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.animateItems();
    }
  }

  toggleMobileMenu() {
    this.cerrarIdioma();
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
