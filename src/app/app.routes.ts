import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    // Carga diferida: el layout (y todo lo que importa) va en su propio chunk.
    loadComponent: () => import('./components/layout/layout.component'),
    children: []
  }
];
