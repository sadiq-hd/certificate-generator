import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  newsletterEmail: string = '';

  // Statistics - يمكن ربطها بالـ Service لاحقاً
  stats = {
    certificates: 1000,
    templates: 50,
    satisfaction: 99
  };

  // Navigation Links
  quickLinks = [
    { name: 'الصفحة الرئيسية', href: '#' },
    { name: 'القوالب', href: '#templates' },
    { name: 'التعليمات', href: '#help' },
    { name: 'الدعم الفني', href: '#support' }
  ];

  // Social Media Links
  socialLinks = [
    {
      name: 'Facebook',
      href: '#',
      icon: 'facebook',
      color: 'from-blue-600 to-blue-700'
    },
    {
      name: 'Twitter',
      href: '#',
      icon: 'twitter',
      color: 'from-blue-400 to-blue-500'
    },
    {
      name: 'LinkedIn',
      href: 'https://www.linkedin.com/in/sadiq-aldubaisi-69721b222/',
      icon: 'linkedin',
      color: 'from-blue-600 to-blue-700'
    },
    {
      name: 'GitHub',
      href: '#',
      icon: 'github',
      color: 'from-gray-700 to-gray-800'
    }
  ];

  // Contact Information
  contactInfo = {
    email: 'sadiqhd&#64;gmail.com',
    phone: '0553065029',
    linkedin: 'https://www.linkedin.com/in/sadiq-aldubaisi-69721b222/'
  };

  constructor() {}

  // Newsletter Subscription
  subscribeToNewsletter(): void {
    if (this.newsletterEmail && this.isValidEmail(this.newsletterEmail)) {
      // Handle newsletter subscription
      console.log('Newsletter subscription:', this.newsletterEmail);
      
      // Show success message (يمكن إضافة notification service)
      alert('تم الاشتراك بنجاح! شكراً لك.');
      
      // Reset form
      this.newsletterEmail = '';
    } else {
      alert('يرجى إدخال بريد إلكتروني صحيح');
    }
  }

  // Email validation
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Handle contact clicks
  onEmailClick(): void {
    window.location.href = `mailto:sadiqhd@gmail.com`;
  }

  onPhoneClick(): void {
    window.location.href = `tel:${this.contactInfo.phone}`;
  }

  onLinkedInClick(): void {
    window.open(this.contactInfo.linkedin, '_blank', 'noopener,noreferrer');
  }

  // Handle social media clicks
  onSocialClick(link: any): void {
    if (link.href.startsWith('http')) {
      window.open(link.href, '_blank', 'noopener,noreferrer');
    } else {
      // Handle internal links
      console.log(`Navigate to: ${link.href}`);
    }
  }

  // Handle quick links
  onQuickLinkClick(link: any): void {
    if (link.href.startsWith('#')) {
      // Smooth scroll to section
      const element = document.querySelector(link.href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // Handle external links
      window.open(link.href, '_blank', 'noopener,noreferrer');
    }
  }

  // Get current year
  getCurrentYear(): number {
    return new Date().getFullYear();
  }

  // Format statistics numbers
  formatNumber(num: number): string {
    if (num >= 1000) {
      return Math.floor(num / 1000) + 'K+';
    }
    return num.toString();
  }
}