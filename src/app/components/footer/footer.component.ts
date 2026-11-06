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
  email = "wilderc.q.16@gmail.com";
  phone = "+591 60937613";
  location = "Santa Cruz, Bolivia";
  
  // Links
  githubUrl = "https://github.com/Willxd123";
  whatsappUrl = "https://wa.me/59160937613";
}
