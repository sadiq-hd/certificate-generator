import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { CertificateService } from './services/certificate.service';
import { TemplateSelectorComponent } from './components/template-selector/template-selector.component';
import { DataInputComponent } from './components/data-input/data-input.component';
import { CertificateEditorComponent } from './components/certificate-editor/certificate-editor.component';
import { PreviewPanelComponent } from './components/preview-panel/preview-panel.component';
import { ExportPanelComponent } from './components/export-panel/export-panel.component';
import { HeaderComponent } from "./components/header/header.component";
import { HomeComponent } from "./components/home/home.component";
import { ContactComponent } from "./components/contact/contact.component";
import { FooterComponent } from "./components/footer/footer.component";


interface Step {
id: number;
name: string;
description: string;
tips?: string[];
}

interface Notification {
type: 'success' | 'error' | 'info';
title: string;
message?: string;
}

@Component({
selector: 'app-root',
standalone: true,
imports: [
  CommonModule,
  TemplateSelectorComponent,
  DataInputComponent,
  CertificateEditorComponent,
  PreviewPanelComponent,
  ExportPanelComponent,
  HeaderComponent,
  HomeComponent,
  ContactComponent,
  FooterComponent
],
templateUrl: './app.component.html',
styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
currentStep: number = 0; // Start with home page
currentPage: 'home' | 'contact' | 'steps' = 'home'; // Track current page
isLoading: boolean = false;
isSaving: boolean = false;
loadingMessage: string = '';
notification: Notification | null = null;

steps: Step[] = [
  {
    id: 1,
    name: 'اختيار القالب',
    description: 'اختر تصميم الشهادة المناسب من القوالب المتاحة'
  },
  {
    id: 2,
    name: 'إدخال البيانات',
    description: 'أضف أسماء الطلاب والنصوص المطلوبة للشهادة'
  },
  {
    id: 3,
    name: 'تحرير الشهادة',
    description: 'خصص مواقع النصوص والخطوط حسب احتياجاتك'
  },
  {
    id: 4,
    name: 'معاينة الشهادات',
    description: 'راجع جميع الشهادات المولدة قبل التصدير'
  },
  {
    id: 5,
    name: 'تصدير الشهادات',
    description: 'اختر إعدادات التصدير وحمل الملفات النهائية'
  }
];

private destroy$ = new Subject<void>();
private autoSaveTimer?: NodeJS.Timeout;

constructor(private certificateService: CertificateService) {}

ngOnInit(): void {
  // Always start at home page
  this.currentStep = 0;
  
  this.setupSubscriptions();
  this.checkInitialState();
  this.startAutoSave();
}

ngOnDestroy(): void {
  this.stopAutoSave();
  this.destroy$.next();
  this.destroy$.complete();
}

private setupSubscriptions(): void {
  this.certificateService.currentStep$
    .pipe(takeUntil(this.destroy$))
    .subscribe(step => {
      // Only sync steps 1-5, don't sync home page (0)
      // And don't sync if we're intentionally on home page
      if (step > 0 && step !== this.currentStep && this.currentStep !== 0) {
        this.currentStep = step;
      }
    });
}

private checkInitialState(): void {
  // For development: Always start fresh
  this.clearSavedData();
  
  // Force reset to home page
  this.currentStep = 0;
  this.certificateService.setCurrentStep(0);
  
  // Don't load any saved data for now
  console.log('Starting fresh on home page');
}

// Clear saved data (for development)
private clearSavedData(): void {
  localStorage.removeItem('certificateApp');
}

// Force reset to home page
private forceResetToHome(): void {
  this.currentStep = 0;
  this.certificateService.resetToHome();
  this.closeNotification();
}

// Method to restore saved project
restoreSavedProject(): void {
  const savedData = localStorage.getItem('certificateApp');
  if (savedData) {
    try {
      const data = JSON.parse(savedData);
      if (data.currentStep && data.currentStep > 0) {
        this.currentStep = data.currentStep;
        this.certificateService.setCurrentStep(data.currentStep);
        this.showNotification('success', 'تم الاستعادة!', 'تم استعادة مشروعك السابق');
      }
    } catch (error) {
      console.error('Error restoring saved data:', error);
      this.showNotification('error', 'خطأ', 'حدث خطأ في استعادة البيانات');
    }
  }
}

// Home page actions
startCreating(): void {
  this.navigateToStep(1);
  this.showNotification('success', 'يلا نبدأ!', 'تم الانتقال لاختيار القالب');
}

viewTemplates(): void {
  this.navigateToStep(1);
  this.showNotification('info', 'استعراض القوالب', 'اختر القالب المناسب لك');
}

// Step navigation methods
getCurrentStepName(): string {
  if (this.currentStep === 0) {
    return 'الصفحة الرئيسية';
  }
  const step = this.steps.find(s => s.id === this.currentStep);
  return step ? step.name : 'صفحة غير معروفة';
}

navigateToStep(step: number): void {
  // Allow going to home page anytime
  if (step === 0) {
    this.currentStep = 0;
    this.currentPage = 'home';
    // Don't update service for home page
    return;
  }

  // Check valid step range
  if (step < 1 || step > this.steps.length) {
    return;
  }

  // When navigating to steps, ensure we're on steps page
  this.currentPage = 'steps';

  // Allow going back to previous steps
  if (step <= this.currentStep) {
    this.currentStep = step;
    this.certificateService.setCurrentStep(step);
    return;
  }

  // For forward navigation, check requirements
  if (step === this.currentStep + 1) {
    if (this.canMoveToStep(step)) {
      this.currentStep = step;
      this.certificateService.setCurrentStep(step);
    } else {
      this.showNotification('info', 'تنبيه', this.getStepRequirementMessage(step));
    }
  } else {
    this.showNotification('info', 'تنبيه', 'يجب إكمال الخطوات السابقة أولاً');
  }
}

private canMoveToStep(step: number): boolean {
  switch (step) {
    case 1: // Template selection - always accessible
      return true;
    case 2:
      return !!this.certificateService.getSelectedTemplate();
    case 3:
      return !!this.certificateService.getSelectedTemplate() && 
             this.certificateService.getStudents().length > 0;
    case 4:
      return !!this.certificateService.getSelectedTemplate() && 
             this.certificateService.getStudents().length > 0 &&
             !!this.certificateService.getCustomText();
    case 5:
      return this.certificateService.getGeneratedCertificates().length > 0;
    default:
      return true;
  }
}

private getStepRequirementMessage(step: number): string {
  switch (step) {
    case 2:
      return 'يجب اختيار قالب أولاً';
    case 3:
      return 'يجب إضافة أسماء الطلاب أولاً';
    case 4:
      return 'يجب إضافة نص الشهادة أولاً';
    case 5:
      return 'يجب إنشاء الشهادات أولاً';
    default:
      return 'يجب إكمال الخطوات السابقة أولاً';
  }
}

// Project management - للهيدر
saveProject(): void {
  if (this.isSaving) return;

  this.isSaving = true;
  
  try {
    this.certificateService.saveCurrentProject();
    this.showNotification('success', 'تم الحفظ', 'تم حفظ المشروع بنجاح');
  } catch (error) {
    console.error('Save error:', error);
    this.showNotification('error', 'خطأ في الحفظ', 'حدث خطأ أثناء حفظ المشروع');
  } finally {
    setTimeout(() => {
      this.isSaving = false;
    }, 1000);
  }
}

// Notification system
showNotification(type: Notification['type'], title: string, message?: string): void {
  this.notification = { type, title, message };
  setTimeout(() => {
    this.closeNotification();
  }, 5000);
}

closeNotification(): void {
  this.notification = null;
}

// Keyboard shortcuts
@HostListener('document:keydown', ['$event'])
onKeydown(event: KeyboardEvent): void {
  // Home shortcut (Ctrl+H) - always available
  if ((event.ctrlKey || event.metaKey) && event.key === 'h') {
    event.preventDefault();
    this.goToHome();
  }

  // Save shortcut (Ctrl+S) - only when in steps
  if ((event.ctrlKey || event.metaKey) && event.key === 's') {
    event.preventDefault();
    if (this.currentStep > 0 && this.currentStep < 5) {
      this.saveProject();
    }
  }

  // Escape to close modals or go back to home
  if (event.key === 'Escape') {
    if (this.notification) {
      this.closeNotification();
    } else {
      this.goToHome();
    }
  }

  // Arrow keys for step navigation - only when in steps
  if (event.ctrlKey && this.currentStep > 0) {
    switch (event.key) {
      case 'ArrowLeft':
        if (this.currentStep > 1) {
          this.navigateToStep(this.currentStep - 1);
        } else {
          this.goToHome();
        }
        event.preventDefault();
        break;
      case 'ArrowRight':
        if (this.currentStep < this.steps.length) {
          this.navigateToStep(this.currentStep + 1);
        }
        event.preventDefault();
        break;
    }
  }
}

// Auto-save functionality - only for steps, not home
private startAutoSave(): void {
  this.autoSaveTimer = setInterval(() => {
    if (this.currentStep > 0 && this.currentStep <= 5 && !this.isSaving) {
      try {
        this.certificateService.saveCurrentProject();
        console.log('Auto-saved at', new Date().toLocaleTimeString());
      } catch (error) {
        console.warn('Auto-save failed:', error);
      }
    }
  }, 30000); // Auto-save every 30 seconds
}

private stopAutoSave(): void {
  if (this.autoSaveTimer) {
    clearInterval(this.autoSaveTimer);
  }
}

// Utility methods
goToHome(): void {
  this.currentStep = 0;
  this.currentPage = 'home';
  // Don't show notification when going home via shortcut during startup
  if (this.currentStep !== 0) {
    this.showNotification('info', 'العودة للرئيسية', 'تم الانتقال للصفحة الرئيسية');
  }
}

// Handle browser back button
@HostListener('window:popstate', ['$event'])
onPopState(event: any): void {
  // Handle browser back button
  if (this.currentStep > 1) {
    this.navigateToStep(this.currentStep - 1);
  } else {
    this.goToHome();
  }
}
}