import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideLottieOptions } from 'ngx-lottie';



export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection(
    { eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(),
    provideLottieOptions({ player: () => import('lottie-web') }),
    provideHttpClient(
      withFetch(), //global

    ),


  ]
};
