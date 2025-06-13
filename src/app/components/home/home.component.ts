import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  
  @Output() startCreating = new EventEmitter<void>();
  @Output() viewTemplates = new EventEmitter<void>();

  // Start creating certificates - يتواصل مع app component
  onStartCreating(): void {
    this.trackButtonClick('start-creating');
    this.startCreating.emit();
  }

  // View templates - يتواصل مع app component  
  onViewTemplates(): void {
    this.trackButtonClick('view-templates');
    this.viewTemplates.emit();
  }

  // Smooth scroll to section
  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  }

  // Handle contact actions
  openPhone(): void {
    this.trackButtonClick('phone');
    window.location.href = 'tel:0553065029';
  }

  openWhatsApp(): void {
    this.trackButtonClick('whatsapp');
    const message = encodeURIComponent('السلام عليكم، أبغى أسأل عن مصمم الشهادات');
    window.open(`https://wa.me/966553065029?text=${message}`, '_blank');
  }

  openEmail(): void {
    this.trackButtonClick('email');
    window.location.href = 'mailto:sadiqhd@gmail.com?subject=استفسار عن مصمم الشهادات';
  }

  // Analytics tracking
  private trackButtonClick(buttonName: string): void {
    console.log(`Button clicked: ${buttonName}`);
    // يمكن إضافة Google Analytics أو أي tracking service هنا
    // gtag('event', 'click', { button_name: buttonName });
  }

  // Scroll to top
  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}