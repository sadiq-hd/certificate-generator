import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { Certificate, CertificateSettings } from '../../models/certificate.model';
import { Template, TextArea } from '../../models/template.model';
import { CertificateService } from '../../services/certificate.service';
import { ExportService } from '../../services/export.service';
import { AppSettings } from '../../app.settings';

@Component({
  selector: 'app-export-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './export-panel.component.html',
  styleUrls: ['./export-panel.component.css']
})
export class ExportPanelComponent implements OnInit, OnDestroy {
  certificates: Certificate[] = [];
  selectedTemplate: Template | null = null;
  
  exportSettings: CertificateSettings = {
    quality: 'high',
    format: 'png',
    scale: 2,
    backgroundColor: '#ffffff'
  };

  availableFormats = AppSettings.exportFormats;
  availableQualities = AppSettings.qualityOptions;

  // Preview properties
  previewCertificate: Certificate | null = null;
  previewIndex: number = 0;
  previewScale: number = 0.5;
  previewWidth: number = 400;
  previewHeight: number = 300;

  // Export state
  isExporting: boolean = false;
  exportProgress: number = 0;
  exportStatus: string = '';
  selectedCertificateId: string = '';

  private destroy$ = new Subject<void>();

  constructor(
    private certificateService: CertificateService,
    private exportService: ExportService
  ) {}

  ngOnInit(): void {
    this.loadData();
    this.calculatePreviewSize();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadData(): void {
    // Load certificates
    this.certificateService.generatedCertificates$
      .pipe(takeUntil(this.destroy$))
      .subscribe(certificates => {
        this.certificates = certificates;
        this.updatePreview();
      });

    // Load selected template
    this.certificateService.selectedTemplate$
      .pipe(takeUntil(this.destroy$))
      .subscribe(template => {
        this.selectedTemplate = template;
        this.calculatePreviewSize();
      });
  }

  private calculatePreviewSize(): void {
    if (this.selectedTemplate) {
      const maxWidth = 400;
      const maxHeight = 300;
      
      const scaleX = maxWidth / this.selectedTemplate.width;
      const scaleY = maxHeight / this.selectedTemplate.height;
      this.previewScale = Math.min(scaleX, scaleY, 0.8);
      
      this.previewWidth = this.selectedTemplate.width * this.previewScale;
      this.previewHeight = this.selectedTemplate.height * this.previewScale;
    }
  }

  private updatePreview(): void {
    if (this.certificates.length > 0) {
      this.previewCertificate = this.certificates[this.previewIndex] || null;
    } else {
      this.previewCertificate = null;
    }
  }

  // Settings management
  setFormat(format: string): void {
    this.exportSettings.format = format as 'png' | 'jpg' | 'pdf';
  }

  setQuality(quality: string): void {
    this.exportSettings.quality = quality as 'low' | 'medium' | 'high';
    
    // Update scale based on quality
    const qualityConfig = this.availableQualities.find(q => q.value === quality);
    if (qualityConfig) {
      this.exportSettings.scale = qualityConfig.scale;
    }
  }

  // Preview navigation
  previousPreview(): void {
    if (this.previewIndex > 0) {
      this.previewIndex--;
      this.updatePreview();
    }
  }

  nextPreview(): void {
    if (this.previewIndex < this.certificates.length - 1) {
      this.previewIndex++;
      this.updatePreview();
    }
  }

  // Export functions
  async exportSingle(): Promise<void> {
    if (!this.selectedCertificateId) {
      alert('يرجى اختيار شهادة للتصدير');
      return;
    }

    const certificate = this.certificates.find(cert => cert.id === this.selectedCertificateId);
    if (!certificate) {
      alert('لم يتم العثور على الشهادة المحددة');
      return;
    }

    this.isExporting = true;
    this.exportProgress = 0;
    this.exportStatus = 'جاري تحضير الشهادة...';

    try {
      // Update progress
      this.exportProgress = 30;
      this.exportStatus = 'جاري إنشاء الصورة...';

      await this.exportService.exportSingleCertificate(certificate, this.exportSettings);

      // Complete
      this.exportProgress = 100;
      this.exportStatus = 'تم التصدير بنجاح!';

      setTimeout(() => {
        this.isExporting = false;
        this.exportProgress = 0;
        this.exportStatus = '';
      }, 2000);

    } catch (error) {
      console.error('Export error:', error);
      alert('حدث خطأ أثناء التصدير: ' + (error instanceof Error ? error.message : 'خطأ غير معروف'));
      this.isExporting = false;
      this.exportProgress = 0;
      this.exportStatus = '';
    }
  }

  async exportAll(): Promise<void> {
    if (this.certificates.length === 0) {
      alert('لا توجد شهادات للتصدير');
      return;
    }

    this.isExporting = true;
    this.exportProgress = 0;
    this.exportStatus = 'جاري تحضير الشهادات...';

    try {
      await this.exportService.exportAllCertificates(
        this.certificates,
        this.exportSettings,
        (progress: number) => {
          this.exportProgress = progress;
          this.exportStatus = `جاري معالجة الشهادة ${Math.ceil(progress * this.certificates.length / 100)} من ${this.certificates.length}`;
        }
      );

      // Complete
      this.exportProgress = 100;
      this.exportStatus = 'تم التصدير بنجاح!';

      setTimeout(() => {
        this.isExporting = false;
        this.exportProgress = 0;
        this.exportStatus = '';
      }, 2000);

    } catch (error) {
      console.error('Export error:', error);
      alert('حدث خطأ أثناء التصدير: ' + (error instanceof Error ? error.message : 'خطأ غير معروف'));
      this.isExporting = false;
      this.exportProgress = 0;
      this.exportStatus = '';
    }
  }

  // Utility functions
  getDisplayText(certificate: Certificate, textArea: TextArea): string {
    switch (textArea.id) {
      case 'name':
        return certificate.student.name;
      case 'title':
        return textArea.defaultText;
      case 'content':
        return certificate.customText || textArea.defaultText;
      case 'manager':
        return textArea.defaultText;
      default:
        return textArea.defaultText;
    }
  }

  getEstimatedSize(): string {
    if (this.certificates.length === 0 || !this.selectedTemplate) {
      return '0 KB';
    }

    const sizeEstimate = this.exportService.getEstimatedTotalSize(
      this.certificates,
      this.exportSettings
    );

    return `${sizeEstimate.size} ${sizeEstimate.unit}`;
  }

  // Project management
  saveProject(): void {
    const projectName = prompt('اسم المشروع:', `مشروع_شهادات_${new Date().toLocaleDateString('ar-SA')}`);
    
    if (projectName) {
      try {
        this.certificateService.createNewProject(projectName);
        alert('تم حفظ المشروع بنجاح!');
      } catch (error) {
        console.error('Save project error:', error);
        alert('حدث خطأ أثناء حفظ المشروع');
      }
    }
  }

  startOver(): void {
    if (confirm('هل أنت متأكد من بدء مشروع جديد؟ ستفقد جميع البيانات الحالية.')) {
      this.certificateService.resetAll();
    }
  }

  // Navigation
  goBack(): void {
    this.certificateService.previousStep();
  }
}