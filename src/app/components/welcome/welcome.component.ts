import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  Inject,
  OnDestroy,
  PLATFORM_ID,
  signal,
  ViewChild,
} from '@angular/core';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as THREE from 'three';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.css',
  template: `
    <ng-lottie
      [options]="options"
      (animationCreated)="animationCreated($event)"
    />
  `,
})
export class WelcomeComponent implements AfterViewInit, OnDestroy {
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private controls!: OrbitControls;
  private head: THREE.Object3D | null = null; // Variable para almacenar la cabeza
  private videoTexture!: THREE.VideoTexture;
  private video!: HTMLVideoElement;
  @ViewChild('sceneContainer', { static: true }) sceneContainer!: ElementRef;
  constructor(@Inject(PLATFORM_ID) private platformId: object) {}
  ngOnDestroy() {
    if (isPlatformBrowser(this.platformId)) {
      window.removeEventListener('resize', this.onResize.bind(this));
      window.removeEventListener('mousemove', this.onMouseMove.bind(this));
    }
  }
  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.initScene();
      this.loadModel();
      this.animate();
      // Agregar el listener para el evento resize
      window.addEventListener('resize', this.onResize.bind(this));
      window.addEventListener('mousemove', this.onMouseMove.bind(this)); // Agregar evento de mouse
      this.observeSections();
    }
  }
  /*   options: AnimationOptions = {
    path: 'assets/scroll.json', // Ruta del archivo JSON
    autoplay: true,
    loop: true
  };


  // Evento cuando se carga la animación
  onAnimationCreated(animation: AnimationItem) {
    animation.setSpeed(1.5); // Reduce la velocidad al 70% de la normal
  } */

  private initScene() {
    this.scene = new THREE.Scene();

    const width = this.sceneContainer.nativeElement.offsetWidth;
    const height = this.sceneContainer.nativeElement.offsetHeight;

    this.camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    this.camera.position.set(0.1, 1, 5);
    this.camera.updateProjectionMatrix();

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: false,
    });

    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.sceneContainer.nativeElement.appendChild(this.renderer.domElement);

    const light = new THREE.AmbientLight(0xffffff, 1);
    this.scene.add(light);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight.position.set(1, 2, 5);
    this.scene.add(directionalLight);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = false;
    this.controls.enableZoom = false;
    this.controls.enableRotate = false;
    this.controls.mouseButtons.RIGHT = null as any;
  }

  private loadModel() {
    const loader = new GLTFLoader();
    loader.load(
      'assets/will10.glb',
      (gltf) => {
        const model = gltf.scene;

        const head = model.getObjectByName('head');
        if (head) {
          this.head = head;
        } else {
          console.warn("No se encontró el objeto 'head' en el modelo.");
        }

        model.scale.set(1, 0.65, 0.4);
        model.position.set(0, -0.6, 0);

        this.scene.add(model);
      },
      undefined,
      (error) => {
        console.error('Error al cargar el modelo:', error);
      }
    );
  }
  // Manejar el movimiento del mouse
  @HostListener('document:mousemove', ['$event'])
  private onMouseMove(event: MouseEvent) {
    if (!this.head) return; // Si no hay cabeza, no hacer nada

    // Normalizar la posición del mouse en valores entre -1 y 1
    const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

    // Limitar la rotación en el eje X (vertical) y Y (horizontal)
    const maxRotationX = Math.PI / 4; // Limitar la rotación en el eje X (±45 grados)
    const maxRotationY = Math.PI / 4; // Limitar la rotación en el eje Y (±45 grados)

    // Rotar la cabeza en el eje Y (horizontal) y X (vertical) basándose en la posición del mouse
    this.head.rotation.y = mouseX * maxRotationY; // Rotación lateral
    this.head.rotation.x = -mouseY * maxRotationX * 0.2; // Rotación vertical

    // Opcionalmente, puedes usar `Math.min` y `Math.max` para garantizar que los valores no se salgan del rango:
    this.head.rotation.x = Math.max(
      Math.min(this.head.rotation.x, maxRotationX),
      -maxRotationX
    );
    this.head.rotation.y = Math.max(
      Math.min(this.head.rotation.y, maxRotationY),
      -maxRotationY
    );
  }
  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    const width = this.sceneContainer.nativeElement.clientWidth;
    const height = this.sceneContainer.nativeElement.clientHeight;
    this.renderer.setSize(width, height);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }

  private animate() {
    requestAnimationFrame(() => this.animate());
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  private observeSections() {
    const sections = document.querySelectorAll('section');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.remove('hidden');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 } // Se activará cuando el 20% de la sección sea visible
    );

    sections.forEach((section) => {
      if (section.id !== 'section1') {
        observer.observe(section);
      }
    });
  }
}
