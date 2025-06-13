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
    HeaderComponent
],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  currentStep: number = 1;
  isLoading: boolean = false;
  loadingMessage: string = '';
  showHelpModal: boolean = false;
  notification: Notification | null = null;

  steps: Step[] = [
    {
      id: 1,
      name: 'اختيار القالب',
      description: 'اختر تصميم الشهادة المناسب من القوالب المتاحة',
      tips: [
        'تأكد من أن القالب يناسب نوع الشهادة المطلوبة',
        'يمكنك معاينة كل قالب قبل الاختيار',
        'القوالب قابلة للتخصيص في الخطوات التالية'
      ]
    },
    {
      id: 2,
      name: 'إدخال البيانات',
      description: 'أضف أسماء الطلاب والنصوص المطلوبة للشهادة',
      tips: [
        'يمكنك رفع ملف Excel يحتوي على أسماء الطلاب',
        'تأكد من أن العمود الأول يحتوي على الأسماء',
        'يمكنك إضافة الأسماء يدوياً واحداً تلو الآخر',
        'رفع الصور اختياري ولكنه يحسن من جودة الشهادات'
      ]
    },
    {
      id: 3,
      name: 'تحرير الشهادة',
      description: 'خصص مواقع النصوص والخطوط حسب احتياجاتك',
      tips: [
        'اسحب النصوص لتغيير مواقعها',
        'استخدم الأدوات الجانبية لتغيير الخطوط والألوان',
        'يمكنك تكبير وتصغير العرض للتحكم الدقيق',
        'استخدم أسهم لوحة المفاتيح للحركة الدقيقة'
      ]
    },
    {
      id: 4,
      name: 'معاينة الشهادات',
      description: 'راجع جميع الشهادات المولدة قبل التصدير',
      tips: [
        'تأكد من صحة جميع البيانات قبل التصدير',
        'يمكنك عرض الشهادات بطرق مختلفة (شبكة، قائمة، فردي)',
        'استخدم البحث للعثور على شهادة معينة بسرعة',
        'حدد الشهادات التي تريد تصديرها'
      ]
    },
    {
      id: 5,
      name: 'تصدير الشهادات',
      description: 'اختر إعدادات التصدير وحمل الملفات النهائية',
      tips: [
        'اختر التنسيق المناسب (PNG للجودة العالية، JPG للحجم الأصغر، PDF للطباعة)',
        'الجودة العالية تعطي نتائج أفضل لكنها تستغرق وقتاً أطول',
        'يمكنك تصدير شهادة واحدة أو جميع الشهادات',
        'احفظ المشروع للعودة إليه لاحقاً'
      ]
    }
  ];

  private destroy$ = new Subject<void>();

  constructor(private certificateService: CertificateService) {}

  ngOnInit(): void {
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
    // Listen to current step changes
    this.certificateService.currentStep$
      .pipe(takeUntil(this.destroy$))
      .subscribe(step => {
        this.currentStep = step;
      });
  }

  private checkInitialState(): void {
    // Check if there's a saved project in localStorage
    const savedData = localStorage.getItem('certificateApp');
    if (savedData) {
      try {
        const data = JSON.parse(savedData);
        if (data.currentStep) {
          this.showNotification('info', 'مرحباً بعودتك!', 'تم استعادة مشروعك السابق');
        }
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    }
  }

  // Step navigation methods
  getCurrentStepName(): string {
    const step = this.steps.find(s => s.id === this.currentStep);
    return step ? step.name : '';
  }

  // Navigation method - الدالة المفقودة
  navigateToStep(step: number): void {
    // التحقق من صحة الخطوة
    if (step < 1 || step > this.steps.length) {
      return;
    }

    // السماح بالعودة للخطوات السابقة
    if (step <= this.currentStep) {
      this.certificateService.setCurrentStep(step);
      return;
    }

    // التحقق من إمكانية الانتقال للخطوة التالية
    if (step === this.currentStep + 1) {
      if (this.canMoveToStep(step)) {
        this.certificateService.setCurrentStep(step);
      } else {
        this.showNotification('info', 'تنبيه', this.getStepRequirementMessage(step));
      }
    } else {
      this.showNotification('info', 'تنبيه', 'يجب إكمال الخطوات السابقة أولاً');
    }
  }

  // التحقق من إمكانية الانتقال للخطوة
  private canMoveToStep(step: number): boolean {
    switch (step) {
      case 2: // إدخال البيانات
        return !!this.certificateService.getSelectedTemplate();
      
      case 3: // تحرير الشهادة
        return !!this.certificateService.getSelectedTemplate() && 
               this.certificateService.getStudents().length > 0;
      
      case 4: // معاينة الشهادات
        return !!this.certificateService.getSelectedTemplate() && 
               this.certificateService.getStudents().length > 0 &&
               !!this.certificateService.getCustomText();
      
      case 5: // تصدير الشهادات
        return this.certificateService.getGeneratedCertificates().length > 0;
      
      default:
        return true;
    }
  }

  // رسائل متطلبات الخطوات
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

  // Project management
  saveProject(): void {
    try {
      this.certificateService.saveCurrentProject();
      this.showNotification('success', 'تم الحفظ', 'تم حفظ المشروع بنجاح');
    } catch (error) {
      console.error('Save error:', error);
      this.showNotification('error', 'خطأ في الحفظ', 'حدث خطأ أثناء حفظ المشروع');
    }
  }

  // Help modal
  showHelp(): void {
    this.showHelpModal = true;
    document.body.style.overflow = 'hidden';
  }

  closeHelp(): void {
    this.showHelpModal = false;
    document.body.style.overflow = 'auto';
  }

  // Loading state
  setLoading(loading: boolean, message: string = ''): void {
    this.isLoading = loading;
    this.loadingMessage = message;
  }

  // Notification system
  showNotification(type: Notification['type'], title: string, message?: string): void {
    this.notification = { type, title, message };
    
    // Auto-hide after 5 seconds
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
    // Help shortcut (F1)
    if (event.key === 'F1') {
      event.preventDefault();
      this.showHelp();
    }

    // Save shortcut (Ctrl+S)
    if ((event.ctrlKey || event.metaKey) && event.key === 's') {
      event.preventDefault();
      if (this.currentStep > 1 && this.currentStep < 5) {
        this.saveProject();
      }
    }

    // Escape to close modals
    if (event.key === 'Escape') {
      if (this.showHelpModal) {
        this.closeHelp();
      }
      if (this.notification) {
        this.closeNotification();
      }
    }

    // Arrow keys for step navigation
    if (event.ctrlKey) {
      switch (event.key) {
        case 'ArrowLeft':
          if (this.currentStep > 1) {
            this.navigateToStep(this.currentStep - 1);
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

  // Error handling
  handleError(error: any, context: string = ''): void {
    console.error(`Error in ${context}:`, error);
    
    let message = 'حدث خطأ غير متوقع';
    if (error instanceof Error) {
      message = error.message;
    }
    
    this.showNotification('error', 'خطأ', message);
    this.setLoading(false);
  }

  // Lifecycle hooks for components
  onComponentInit(step: number): void {
    console.log(`Component for step ${step} initialized`);
  }

  onComponentDestroy(step: number): void {
    console.log(`Component for step ${step} destroyed`);
  }

  // Utility methods
  isStepAccessible(stepId: number): boolean {
    return stepId <= this.currentStep || this.canMoveToStep(stepId);
  }

  isStepCompleted(stepId: number): boolean {
    return stepId < this.currentStep;
  }

  // Auto-save functionality
  private autoSaveTimer?: NodeJS.Timeout;

  private startAutoSave(): void {
    this.autoSaveTimer = setInterval(() => {
      if (this.currentStep > 1 && this.currentStep < 5) {
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
}