import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideLottieOptions } from 'ngx-lottie';



export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection(
    { eventCoalescing: true }),
    provideRouter(routes),
    // Hidratación: reutiliza el HTML del servidor y repite los clics hechos antes de que cargue el JS.
    provideClientHydration(withEventReplay()),
    provideLottieOptions({ player: () => import('lottie-web') }),
    provideHttpClient(
      withFetch(), //global

    ),


  ]
};
