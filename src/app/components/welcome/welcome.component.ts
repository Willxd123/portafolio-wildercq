import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  Inject,
  OnDestroy,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
// Three.js y sus helpers se descargan bajo demanda (import dinámico): solo tipos aquí.
import type * as THREE from 'three';
import type { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { experiences, projects, skillGroups } from './profile.data';
import { additionalSkills } from './skill-icons.data';
@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.css',
})
export class WelcomeComponent implements AfterViewInit, OnDestroy {
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private controls!: OrbitControls;
  public  head: THREE.Object3D | null = null; // Variable para almacenar la cabeza
  private videoTexture!: THREE.VideoTexture;
  private video!: HTMLVideoElement;
  @ViewChild('sceneContainer', { static: true }) sceneContainer!: ElementRef;
  constructor(@Inject(PLATFORM_ID) private platformId: object) {}
  private THREE!: typeof import('three');
  private frameId = 0;
  private escenaVisible = false;
  private destruido = false;
  private visibilidad?: IntersectionObserver;

  ngOnDestroy() {
    this.destruido = true;
    if (!isPlatformBrowser(this.platformId)) return;
    cancelAnimationFrame(this.frameId);
    this.visibilidad?.disconnect();
    this.renderer?.dispose();
  }
  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.observeSections();
      // El resto de la página pinta primero; el 3D carga cuando el navegador está libre.
      const iniciar = () => this.iniciarEscena3D();
      if ('requestIdleCallback' in window) {
        (window as any).requestIdleCallback(iniciar, { timeout: 2000 });
      } else {
        setTimeout(iniciar, 500);
      }
    }
  }

  private async iniciarEscena3D() {
    if (this.destruido) return;
    // Descarga diferida de three (~700 KB) y sus helpers, en paralelo.
    const [THREE, { OrbitControls }, { GLTFLoader }] = await Promise.all([
      import('three'),
      import('three/examples/jsm/controls/OrbitControls'),
      import('three/examples/jsm/loaders/GLTFLoader'),
    ]);
    if (this.destruido) return;
    this.THREE = THREE;
    this.initScene(OrbitControls);
    this.loadModel(GLTFLoader);

    // Solo se renderiza mientras la escena está en pantalla y la pestaña visible.
    this.visibilidad = new IntersectionObserver(([entrada]) => {
      this.escenaVisible = entrada.isIntersecting;
      if (this.escenaVisible) this.animate();
    });
    this.visibilidad.observe(this.sceneContainer.nativeElement);
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && this.escenaVisible) this.animate();
    });
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

  private initScene(OrbitControlsCtor: typeof OrbitControls) {
    const THREE = this.THREE;
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

    this.controls = new OrbitControlsCtor(this.camera, this.renderer.domElement);
    this.controls.enableDamping = false;
    this.controls.enableZoom = false;
    this.controls.enableRotate = false;
    this.controls.mouseButtons.RIGHT = null as any;
  }

  private loadModel(GLTFLoaderCtor: typeof import('three/examples/jsm/loaders/GLTFLoader').GLTFLoader) {
    const loader = new GLTFLoaderCtor();
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
  public onMouseMove(event: MouseEvent): void {
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
    if (!this.renderer) return;
    const width = this.sceneContainer.nativeElement.clientWidth;
    const height = this.sceneContainer.nativeElement.clientHeight;
    this.renderer.setSize(width, height);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }

  private animate() {
    cancelAnimationFrame(this.frameId);
    if (this.destruido || !this.escenaVisible || document.hidden) return;
    this.frameId = requestAnimationFrame(() => this.animate());
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

  readonly experiences = experiences;
  readonly projects = projects;
  readonly skillGroups = skillGroups;
  readonly additionalSkills = additionalSkills;
  readonly additionalSkillCards = [
    { title: 'Infraestructura y datos', icon: 'database', items: additionalSkills.infrastructure },
  ];
}
