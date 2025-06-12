import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Certificate, CertificateSettings } from '../../models/certificate.model';
import { Template } from '../../models/template.model';
import { CertificateService } from '../../services/certificate.service';
import { ExportService } from '../../services/export.service';

@Component({
  selector: 'app-preview-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './preview-panel.component.html',
  styleUrls: ['./preview-panel.component.css']
})
export class PreviewPanelComponent implements OnInit {
  certificates: Certificate[] = [];
  selectedTemplate: Template | null = null;
  selectedCertificates = new Set<string>();
  institutionLogo: string | null = null;
  
  // Export settings
  exportSettings: CertificateSettings = {
    format: 'png',
    quality: 'high',
    scale: 2,
    backgroundColor: '#ffffff'
  };

  availableFormats = [
    { value: 'png', name: 'PNG', description: 'صورة بجودة عالية' },
    { value: 'jpg', name: 'JPG', description: 'صورة مضغوطة' },
    { value: 'pdf', name: 'PDF', description: 'ملف PDF' }
  ];

  availableQualities = [
    { value: 'high', name: 'عالية', scale: 2 },
    { value: 'medium', name: 'متوسطة', scale: 1.5 },
    { value: 'low', name: 'منخفضة', scale: 1 }
  ];

  isExporting = false;
  exportProgress = 0;
  exportStatus = '';

  constructor(
    private certificateService: CertificateService,
    private exportService: ExportService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.certificateService.generatedCertificates$.subscribe(certs => {
      this.certificates = certs;
      // تحديد جميع الشهادات افتراضياً
      this.certificates.forEach(cert => this.selectedCertificates.add(cert.id));
    });

    this.certificateService.selectedTemplate$.subscribe(template => {
      this.selectedTemplate = template;
    });

    this.certificateService.institutionLogo$.subscribe(logo => {
      this.institutionLogo = logo;
      this.exportService.setInstitutionLogo(logo);
    });

    // إضافة اسم المدير
    this.certificateService.managerName$.subscribe(managerName => {
      this.exportService.setManagerName(managerName);
    });
  }

  getEstimatedSize(): string {
    if (this.certificates.length === 0) return '0 KB';
    
    const estimate = this.exportService.getEstimatedTotalSize(this.certificates, this.exportSettings);
    return `${estimate.size} ${estimate.unit}`;
  }

  setFormat(format: string): void {
    this.exportSettings.format = format as any;
  }

  setQuality(quality: string): void {
    this.exportSettings.quality = quality as any;
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
      
      this.exportStatus = 'تم التصدير بنجاح!';
    } catch (error) {
      console.error('Export error:', error);
      this.exportStatus = 'فشل في التصدير';
    } finally {
      this.isExporting = false;
    }
  }

  async exportSelected(): Promise<void> {
    const selectedCerts = this.certificates.filter(cert => this.selectedCertificates.has(cert.id));
    if (selectedCerts.length === 0 || this.isExporting) return;

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
      
      this.exportStatus = 'تم التصدير بنجاح!';
    } catch (error) {
      console.error('Export error:', error);
      this.exportStatus = 'فشل في التصدير';
    } finally {
      this.isExporting = false;
    }
  }

  getDisplayText(certificate: Certificate, textArea: any): string {
    switch (textArea.id) {
      case 'name':
        return certificate.student.name || textArea.defaultText;
      case 'title':
        return textArea.defaultText;
      case 'content':
        return certificate.customText || textArea.defaultText;
      case 'manager':
        return textArea.defaultText;
      case 'date':
        return new Date().toLocaleDateString('ar-SA') || textArea.defaultText;
      default:
        return textArea.defaultText;
    }
  }

  goBack(): void {
    this.certificateService.previousStep();
  }

  startOver(): void {
    this.certificateService.resetAll();
    this.certificateService.setCurrentStep(1);
  }
}