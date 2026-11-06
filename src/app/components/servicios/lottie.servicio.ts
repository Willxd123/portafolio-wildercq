import { Injectable } from '@angular/core';
import { AnimationOptions } from 'ngx-lottie';

@Injectable({ providedIn: 'root' })
export class LottieServicio {
  /** Genera las opciones base de una animación Lottie. */
  crearOpciones(path: string, loop: boolean = true, autoplay: boolean = true): AnimationOptions {
    return { path, loop, autoplay };
  }
}
