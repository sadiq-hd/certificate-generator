import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { Certificate, CertificateSettings } from '../../models/certificate.model';
import { Template, TextArea } from '../../models/template.model';
import { Student } from '../../models/student.model';
import { CertificateService } from '../../services/certificate.service';
import { ExportService } from '../../services/export.service';
import { AppSettings } from '../../app.settings';

@Component({
  selector: 'app-preview-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './preview-panel.component.html',
  styleUrls: ['./preview-panel.component.css']
})
export class PreviewPanelComponent implements OnInit, OnDestroy {
  certificates: Certificate[] = [];
  selectedTemplate: Template | null = null;
  selectedCertificates = new Set<string>();
  students: Student[] = [];
  customText: string = '';
  certificateName: string = ''; // إضافة متغير اسم الشهادة
  managerName: string = '';
  institutionLogo: string | null = null;
  
  // Export settings
  exportSettings: CertificateSettings = {
    format: 'png',
    quality: 'high',
    scale: 2,
    backgroundColor: '#ffffff'
  };

  availableFormats = AppSettings.exportFormats;
  availableQualities = AppSettings.qualityOptions;

  isExporting = false;
  exportProgress = 0;
  exportStatus = '';

  private destroy$ = new Subject<void>();

  constructor(
    private certificateService: CertificateService,
    private exportService: ExportService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadData(): void {
    // Load certificates
    this.certificateService.generatedCertificates$
      .pipe(takeUntil(this.destroy$))
      .subscribe(certs => {
        this.certificates = certs;
        // تحديد جميع الشهادات افتراضياً
        this.certificates.forEach(cert => this.selectedCertificates.add(cert.id));
      });

    // Load selected template
    this.certificateService.selectedTemplate$
      .pipe(takeUntil(this.destroy$))
      .subscribe(template => {
        this.selectedTemplate = template;
      });

    // Load students
    this.certificateService.students$
      .pipe(takeUntil(this.destroy$))
      .subscribe(students => {
        this.students = students;
      });

    // Load custom text
    this.certificateService.customText$
      .pipe(takeUntil(this.destroy$))
      .subscribe(text => {
        this.customText = text;
      });

    // إضافة subscription لاسم الشهادة
    this.certificateService.certificateName$
      .pipe(takeUntil(this.destroy$))
      .subscribe(name => {
        this.certificateName = name;
      });

    // Load manager name
    this.certificateService.managerName$
      .pipe(takeUntil(this.destroy$))
      .subscribe(managerName => {
        this.managerName = managerName;
        this.exportService.setManagerName(managerName);
      });

    // Load institution logo
    this.certificateService.institutionLogo$
      .pipe(takeUntil(this.destroy$))
      .subscribe(logo => {
        this.institutionLogo = logo;
        this.exportService.setInstitutionLogo(logo);
      });
  }

  // Selection management
  toggleCertificateSelection(certificateId: string): void {
    if (this.selectedCertificates.has(certificateId)) {
      this.selectedCertificates.delete(certificateId);
    } else {
      this.selectedCertificates.add(certificateId);
    }
  }

  selectAll(): void {
    this.certificates.forEach(cert => this.selectedCertificates.add(cert.id));
  }

  clearSelection(): void {
    this.selectedCertificates.clear();
  }

  getEstimatedSize(): string {
    if (this.certificates.length === 0) return '0 KB';
    
    try {
      const estimate = this.exportService.getEstimatedTotalSize(this.certificates, this.exportSettings);
      return `${estimate.size} ${estimate.unit}`;
    } catch (error) {
      console.error('Error calculating size:', error);
      // حساب تقريبي بسيط
      const avgSizePerCert = this.getAverageCertificateSize();
      const totalSizeKB = (avgSizePerCert * this.certificates.length) / 1024;
      
      if (totalSizeKB > 1024) {
        return `${(totalSizeKB / 1024).toFixed(1)} MB`;
      }
      return `${totalSizeKB.toFixed(0)} KB`;
    }
  }

  private getAverageCertificateSize(): number {
    // حساب تقريبي لحجم الشهادة الواحدة
    if (!this.selectedTemplate) return 500000; // 500KB افتراضي

    const baseSize = this.selectedTemplate.width * this.selectedTemplate.height;
    const scaleFactor = this.exportSettings.scale || 2;
    const qualityMultiplier = this.getQualityMultiplier();
    
    return baseSize * scaleFactor * qualityMultiplier;
  }

  private getQualityMultiplier(): number {
    switch (this.exportSettings.quality) {
      case 'high': return 3;
      case 'medium': return 2;
      case 'low': return 1;
      default: return 2;
    }
  }

  setFormat(format: string): void {
    this.exportSettings.format = format as 'png' | 'jpg' | 'pdf';
  }

  setQuality(quality: string): void {
    this.exportSettings.quality = quality as 'low' | 'medium' | 'high';
    const qualityConfig = this.availableQualities.find(q => q.value === quality);
    if (qualityConfig) {
      this.exportSettings.scale = qualityConfig.scale;
    }
  }

  async exportAll(): Promise<void> {
    if (this.certificates.length === 0 || this.isExporting) return;

    this.isExporting = true;
    this.exportProgress = 0;
    this.exportStatus = 'بدء التصدير...';

    try {
      await this.exportService.exportAllCertificates(
        this.certificates,
        this.exportSettings,
        (progress) => {
          this.exportProgress = progress;
          this.exportStatus = `تصدير الشهادة ${Math.ceil(progress * this.certificates.length / 100)} من ${this.certificates.length}`;
        }
      );
      
      this.exportProgress = 100;
      this.exportStatus = 'تم التصدير بنجاح!';

      setTimeout(() => {
        this.isExporting = false;
        this.exportProgress = 0;
        this.exportStatus = '';
      }, 2000);

    } catch (error) {
      console.error('Export error:', error);
      this.exportStatus = 'فشل في التصدير';
      alert('حدث خطأ أثناء التصدير: ' + (error instanceof Error ? error.message : 'خطأ غير معروف'));
      this.isExporting = false;
      this.exportProgress = 0;
      this.exportStatus = '';
    }
  }

  async exportSelected(): Promise<void> {
    const selectedCerts = this.certificates.filter(cert => this.selectedCertificates.has(cert.id));
    if (selectedCerts.length === 0 || this.isExporting) {
      if (selectedCerts.length === 0) {
        alert('يرجى تحديد شهادات للتصدير');
      }
      return;
    }

    this.isExporting = true;
    this.exportProgress = 0;
    this.exportStatus = 'بدء تصدير المحدد...';

    try {
      await this.exportService.exportAllCertificates(
        selectedCerts,
        this.exportSettings,
        (progress) => {
          this.exportProgress = progress;
          this.exportStatus = `تصدير الشهادة ${Math.ceil(progress * selectedCerts.length / 100)} من ${selectedCerts.length}`;
        }
      );
      
      this.exportProgress = 100;
      this.exportStatus = 'تم التصدير بنجاح!';

      setTimeout(() => {
        this.isExporting = false;
        this.exportProgress = 0;
        this.exportStatus = '';
      }, 2000);

    } catch (error) {
      console.error('Export error:', error);
      this.exportStatus = 'فشل في التصدير';
      alert('حدث خطأ أثناء التصدير: ' + (error instanceof Error ? error.message : 'خطأ غير معروف'));
      this.isExporting = false;
      this.exportProgress = 0;
      this.exportStatus = '';
    }
  }

  getDisplayText(certificate: Certificate, textArea: TextArea): string {
    switch (textArea.id) {
      case 'name':
        return certificate.student.name || textArea.defaultText;
      case 'title':
        // استخدام اسم الشهادة المدخل من المستخدم
        return certificate.certificateName || this.certificateName || textArea.defaultText;
      case 'content':
        return certificate.customText || this.customText || textArea.defaultText;
      case 'manager':
        return this.managerName || textArea.defaultText;
      case 'date':
        return new Date().toLocaleDateString('ar-SA') || textArea.defaultText;
      default:
        // للنصوص المخصصة
        return textArea.defaultText;
    }
  }

  goBack(): void {
    this.certificateService.previousStep();
  }

  startOver(): void {
    if (confirm('هل أنت متأكد من بدء مشروع جديد؟ ستفقد جميع البيانات الحالية.')) {
      this.certificateService.resetAll();
      this.certificateService.setCurrentStep(1);
    }
  }

  // Utility methods
  getCurrentDate(): string {
    return new Date().toLocaleDateString('ar-SA');
  }

  getCertificateCount(): number {
    return this.certificates.length;
  }

  getSelectedCount(): number {
    return this.selectedCertificates.size;
  }

  isAllSelected(): boolean {
    return this.certificates.length > 0 && this.selectedCertificates.size === this.certificates.length;
  }

  isNoneSelected(): boolean {
    return this.selectedCertificates.size === 0;
  }

  // Validation
  private validateExportSettings(): boolean {
    if (!this.exportSettings.format) {
      alert('يرجى اختيار تنسيق الملف');
      return false;
    }

    if (!this.exportSettings.quality) {
      alert('يرجى اختيار جودة التصدير');
      return false;
    }

    return true;
  }

  // Error handling
  private handleError(error: any, context: string): void {
    console.error(`Error in ${context}:`, error);
    const message = error instanceof Error ? error.message : 'حدث خطأ غير متوقع';
    alert(`خطأ في ${context}: ${message}`);
  }

  // Performance optimization
  trackByCertificateId(index: number, certificate: Certificate): string {
    return certificate.id;
  }

  trackByTextAreaId(index: number, textArea: TextArea): string {
    return textArea.id;
  }

  // Certificate info helpers
  getCertificateInfo(certificate: Certificate): string {
    return `${certificate.template.width}×${certificate.template.height}`;
  }

  getCertificateStatus(certificate: Certificate): string {
    return 'جاهز للتصدير';
  }

  // Preview helpers
  getPreviewFontSize(originalSize: number): number {
    return Math.max(8, originalSize * 0.25);
  }

  shouldShowLogo(textArea: TextArea): boolean {
    return textArea.id === 'logo' && !!this.institutionLogo;
  }

  shouldShowText(textArea: TextArea): boolean {
    return textArea.id !== 'logo';
  }

  // Cleanup
  private cleanup(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}