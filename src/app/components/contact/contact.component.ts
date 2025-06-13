import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {
  constructor(private router: Router) {}

  @Output() goBack = new EventEmitter<void>();

  contactForm: ContactForm = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };

  isSubmitting = false;
  showSuccessMessage = false;

  // Contact information
  contactInfo = {
    phone: '0553065029',
    email: 'sadiqhd@gmail.com',
    whatsapp: '966553065029',
    address: 'المملكة العربية السعودية',
    workingHours: 'السبت - الخميس: 9:00 ص - 6:00 م'
  };

  // Go back to home
  onGoBack(): void {
    this.goBack.emit();
  }

  // Handle form submission
  onSubmit(): void {
    if (this.isFormValid()) {
      this.isSubmitting = true;
      
      // Simulate form submission
      setTimeout(() => {
        this.isSubmitting = false;
        this.showSuccessMessage = true;
        this.resetForm();
        
        // Hide success message after 5 seconds
        setTimeout(() => {
          this.showSuccessMessage = false;
        }, 5000);
      }, 2000);
    }
  }

  // Form validation
  isFormValid(): boolean {
    return !!(
      this.contactForm.name.trim() &&
      this.contactForm.email.trim() &&
      this.contactForm.subject.trim() &&
      this.contactForm.message.trim() &&
      this.isValidEmail(this.contactForm.email)
    );
  }

  // Email validation
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Reset form
  private resetForm(): void {
    this.contactForm = {
      name: '',
      email: '',
      subject: '',
      message: ''
    };
  }

  // Quick contact actions
  openPhone(): void {
    window.location.href = `tel:${this.contactInfo.phone}`;
  }

  openEmail(): void {
    const subject = encodeURIComponent('استفسار عن مصمم الشهادات');
    window.location.href = `mailto:${this.contactInfo.email}?subject=${subject}`;
  }

  openWhatsApp(): void {
    const message = encodeURIComponent('السلام عليكم، أبغى أسأل عن مصمم الشهادات');
    window.open(`https://wa.me/${this.contactInfo.whatsapp}?text=${message}`, '_blank');
  }

  // Copy contact info
  copyToClipboard(text: string, type: string): void {
    navigator.clipboard.writeText(text).then(() => {
      // Show copied feedback
      console.log(`${type} copied to clipboard: ${text}`);
    }).catch(err => {
      console.error('Could not copy text: ', err);
    });
  }
}