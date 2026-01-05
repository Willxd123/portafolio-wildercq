import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
  email = "wilder.c.q.16@gmail.com"; // Corregido según tu HTML anterior
  phone = "+591 60937613";
  location = "Santa Cruz, Bolivia";
  
  // Links
  githubUrl = "https://github.com/Willxd123";
  whatsappUrl = "https://wa.me/59160937613";
}