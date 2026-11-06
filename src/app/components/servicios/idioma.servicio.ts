import { afterNextRender, Injectable, signal, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export interface Idioma {
  codigo: string;
  label: string;
  bandera: string;
}

@Injectable({ providedIn: 'root' })
export class IdiomaServicio {
  private platformId = inject(PLATFORM_ID);
  private readonly idiomaBase = 'es';

  readonly idiomas: Idioma[] = [
    { codigo: 'es', label: 'Español', bandera: '🇧🇴' },
    { codigo: 'en', label: 'English', bandera: '🇺🇸' },
/*     { codigo: 'fr', label: 'Français', bandera: '🇫🇷' },
    { codigo: 'de', label: 'Deutsch', bandera: '🇩🇪' },
    { codigo: 'zh-CN', label: '中文', bandera: '🇨🇳' },
    { codigo: 'ja', label: '日本語', bandera: '🇯🇵' },
    { codigo: 'ar', label: 'العربية', bandera: '🇸🇦' }, */
  ];

  idiomaActual = signal<string>(this.idiomaBase);

  constructor() {
    // Mantener el primer render idéntico en SSR y navegador para la hidratación.
    afterNextRender(() => this.sincronizarEstadoActual());
  }

  private detectarInicial(): string {
    if (!isPlatformBrowser(this.platformId)) return this.idiomaBase;

    // Google Translate realmente aplica estado desde cookie:
    // prioridad a cookie para no desincronizar el select con la UI traducida.
    const cookieDestino = this.leerDestinoCookie();
    if (cookieDestino) {
      const normalizado = this.normalizarCodigo(cookieDestino);
      localStorage.setItem('idioma', normalizado);
      return normalizado;
    }

    const guardado = localStorage.getItem('idioma');
    if (guardado) return this.normalizarCodigo(guardado);

    return this.idiomaBase;
  }

  cambiarIdioma(codigo: string): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const normalizado = this.normalizarCodigo(codigo);
    this.idiomaActual.set(normalizado);
    localStorage.setItem('idioma', normalizado);

    if (normalizado === this.idiomaBase) {
      this.borrarCookieGT();
      localStorage.setItem('idioma', this.idiomaBase);
      location.reload();
      return;
    }

    this.escribirCookieGT(this.idiomaBase, normalizado);

    const select = document.querySelector<HTMLSelectElement>('.goog-te-combo');
    if (select) {
      select.value = normalizado;
      select.dispatchEvent(new Event('change'));
    } else {
      location.reload();
    }
  }

  sincronizarEstadoActual(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const actual = this.detectarInicial();
    if (actual !== this.idiomaActual()) {
      this.idiomaActual.set(actual);
    }
  }

  private escribirCookieGT(origen: string, destino: string): void {
    const valor = `/${origen}/${destino}`;
    document.cookie = `googtrans=${valor}; path=/`;
    document.cookie = `googtrans=${valor}; path=/; domain=${location.hostname}`;
  }

  private borrarCookieGT(): void {
    document.cookie = 'googtrans=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = `googtrans=; path=/; domain=${location.hostname}; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  }

  private leerDestinoCookie(): string | null {
    const cookies = document.cookie
      .split(';')
      .map((c) => c.trim())
      .filter((c) => c.startsWith('googtrans='))
      .map((c) => c.substring('googtrans='.length))
      .map((raw) => {
        try {
          return decodeURIComponent(raw);
        } catch {
          return raw;
        }
      });

    for (let i = cookies.length - 1; i >= 0; i--) {
      const valor = cookies[i].replace(/^"|"$/g, '');
      const partes = valor.split('/');
      const destino = (partes[2] || '').trim();
      if (destino) return destino;
    }

    return null;
  }

  private normalizarCodigo(codigo: string): string {
    const limpio = (codigo || '').trim().replace(/^"|"$/g, '');
    if (!limpio) return this.idiomaBase;

    const exacto = this.idiomas.find((i) => i.codigo.toLowerCase() === limpio.toLowerCase());
    if (exacto) return exacto.codigo;

    const porPrefijo = this.idiomas.find((i) =>
      limpio.toLowerCase().startsWith(i.codigo.toLowerCase()),
    );
    return porPrefijo?.codigo ?? this.idiomaBase;
  }

  get idiomaSeleccionado(): Idioma {
    return this.idiomas.find((i) => i.codigo === this.idiomaActual()) ?? this.idiomas[0];
  }
}
