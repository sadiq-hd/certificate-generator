import { Injectable } from '@angular/core';
import { Certificate, CertificateSettings } from '../models/certificate.model';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import JSZip from 'jszip';

@Injectable({
  providedIn: 'root'
})
export class ExportService {
  // خاصية الشعار
  private institutionLogo: string | null = null;

  constructor() {}

  // Export single certificate as image
  async exportCertificateAsImage(
    certificateElement: HTMLElement,
    certificate: Certificate,
    settings: CertificateSettings
  ): Promise<Blob> {
    try {
      // التأكد من أن العنصر مرئي قبل التصدير
      const originalStyle = certificateElement.style.cssText;
      certificateElement.style.position = 'fixed';
      certificateElement.style.left = '-9999px';
      certificateElement.style.top = '-9999px';
      certificateElement.style.visibility = 'visible';
      certificateElement.style.opacity = '1';
      certificateElement.style.zIndex = '-1000';

      // انتظار تحميل الصور
      await this.waitForImages(certificateElement);

      const canvas = await html2canvas(certificateElement, {
        scale: settings.scale,
        backgroundColor: settings.backgroundColor,
        useCORS: true,
        allowTaint: false,
        logging: false,
        width: certificate.template.width,
        height: certificate.template.height,
        foreignObjectRendering: false,
        imageTimeout: 15000,
        removeContainer: false
      });

      // إعادة الستايل الأصلي
      certificateElement.style.cssText = originalStyle;

      return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('فشل في إنشاء الصورة'));
          }
        }, `image/${settings.format}`, this.getQuality(settings.quality));
      });
    } catch (error) {
      throw new Error('فشل في تصدير الشهادة كصورة: ' + error);
    }
  }

  // انتظار تحميل جميع الصور في العنصر
  private waitForImages(element: HTMLElement): Promise<void> {
    return new Promise((resolve) => {
      const images = element.querySelectorAll('img');
      if (images.length === 0) {
        resolve();
        return;
      }

      let loadedCount = 0;
      const totalImages = images.length;

      const checkComplete = () => {
        loadedCount++;
        if (loadedCount === totalImages) {
          resolve();
        }
      };

      images.forEach((img) => {
        if (img.complete && img.naturalHeight !== 0) {
          checkComplete();
        } else {
          img.onload = checkComplete;
          img.onerror = checkComplete; // حتى لو فشلت الصورة، نكمل
        }
      });
    });
  }

  // Export single certificate as PDF
  async exportCertificateAsPDF(
    certificateElement: HTMLElement,
    certificate: Certificate,
    settings: CertificateSettings
  ): Promise<Blob> {
    try {
      // التأكد من أن العنصر مرئي
      const originalStyle = certificateElement.style.cssText;
      certificateElement.style.position = 'fixed';
      certificateElement.style.left = '-9999px';
      certificateElement.style.top = '-9999px';
      certificateElement.style.visibility = 'visible';
      certificateElement.style.opacity = '1';

      await this.waitForImages(certificateElement);

      const canvas = await html2canvas(certificateElement, {
        scale: settings.scale,
        backgroundColor: settings.backgroundColor,
        useCORS: true,
        allowTaint: false,
        logging: false
      });

      // إعادة الستايل الأصلي
      certificateElement.style.cssText = originalStyle;

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: certificate.template.width > certificate.template.height ? 'landscape' : 'portrait',
        unit: 'px',
        format: [certificate.template.width, certificate.template.height]
      });

      pdf.addImage(
        imgData,
        'PNG',
        0,
        0,
        certificate.template.width,
        certificate.template.height
      );

      return pdf.output('blob');
    } catch (error) {
      throw new Error('فشل في تصدير الشهادة كـ PDF: ' + error);
    }
  }

  // إنشاء عنصر شهادة مؤقت للتصدير
  private createTemporaryCertificateElement(certificate: Certificate): HTMLElement {
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.left = '-9999px';
    container.style.top = '-9999px';
    container.style.width = certificate.template.width + 'px';
    container.style.height = certificate.template.height + 'px';
    container.style.background = 'white';
    container.style.visibility = 'hidden';

    // صورة الخلفية
    const bgImg = document.createElement('img');
    bgImg.src = certificate.template.imagePath;
    bgImg.style.position = 'absolute';
    bgImg.style.top = '0';
    bgImg.style.left = '0';
    bgImg.style.width = '100%';
    bgImg.style.height = '100%';
    bgImg.style.objectFit = 'cover';
    container.appendChild(bgImg);

    // النصوص
    certificate.textAreas.forEach(textArea => {
      const textElement = document.createElement('div');
      textElement.style.position = 'absolute';
      textElement.style.left = (textArea.x - textArea.width/2) + 'px';
      textElement.style.top = (textArea.y - textArea.height/2) + 'px';
      textElement.style.width = textArea.width + 'px';
      textElement.style.height = textArea.height + 'px';
      textElement.style.fontFamily = textArea.fontFamily;
      textElement.style.fontSize = textArea.fontSize + 'px';
      textElement.style.fontWeight = textArea.fontWeight;
      textElement.style.color = textArea.color;
      textElement.style.textAlign = textArea.textAlign;
      textElement.style.lineHeight = '1.4';
      textElement.style.display = 'flex';
      textElement.style.alignItems = 'center';
      textElement.style.justifyContent = 'center';
      textElement.style.wordBreak = 'break-word';
      textElement.style.overflow = 'hidden';

      if (textArea.id === 'logo' && this.institutionLogo) {
        const logoImg = document.createElement('img');
        logoImg.src = this.institutionLogo;
        logoImg.style.maxWidth = '100%';
        logoImg.style.maxHeight = '100%';
        logoImg.style.objectFit = 'contain';
        textElement.appendChild(logoImg);
      } else if (textArea.id !== 'logo') {
        textElement.textContent = this.getDisplayText(certificate, textArea);
      }

      container.appendChild(textElement);
    });

    document.body.appendChild(container);
    return container;
  }

  // Export multiple certificates
  async exportMultipleCertificates(
    certificates: Certificate[],
    settings: CertificateSettings,
    onProgress?: (progress: number) => void
  ): Promise<Blob> {
    if (certificates.length === 0) {
      throw new Error('لا توجد شهادات للتصدير');
    }

    const zip = new JSZip();
    const folder = zip.folder('certificates');

    for (let i = 0; i < certificates.length; i++) {
      const certificate = certificates[i];
      
      try {
        // إنشاء عنصر مؤقت للشهادة
        const tempElement = this.createTemporaryCertificateElement(certificate);

        let blob: Blob;
        let filename: string;

        if (settings.format === 'pdf') {
          blob = await this.exportCertificateAsPDF(tempElement, certificate, settings);
          filename = `${this.sanitizeFilename(certificate.student.name)}.pdf`;
        } else {
          blob = await this.exportCertificateAsImage(tempElement, certificate, settings);
          filename = `${this.sanitizeFilename(certificate.student.name)}.${settings.format}`;
        }

        folder?.file(filename, blob);

        // إزالة العنصر المؤقت
        document.body.removeChild(tempElement);

        // Update progress
        if (onProgress) {
          onProgress(Math.round(((i + 1) / certificates.length) * 100));
        }
      } catch (error) {
        console.error(`Error exporting certificate for ${certificate.student.name}:`, error);
      }
    }

    return zip.generateAsync({ type: 'blob' });
  }

  // باقي الدوال تبقى كما هي...
  
  downloadBlob(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  async exportSingleCertificate(
    certificate: Certificate,
    settings: CertificateSettings
  ): Promise<void> {
    let certElement = document.getElementById(`certificate-${certificate.id}`);
    
    // إذا ما لقينا العنصر، ننشئ واحد مؤقت
    if (!certElement) {
      certElement = this.createTemporaryCertificateElement(certificate);
    }

    let blob: Blob;
    let filename: string;

    if (settings.format === 'pdf') {
      blob = await this.exportCertificateAsPDF(certElement, certificate, settings);
      filename = `${this.sanitizeFilename(certificate.student.name)}.pdf`;
    } else {
      blob = await this.exportCertificateAsImage(certElement, certificate, settings);
      filename = `${this.sanitizeFilename(certificate.student.name)}.${settings.format}`;
    }

    // إذا كان عنصر مؤقت، نحذفه
    if (!document.getElementById(`certificate-${certificate.id}`)) {
      document.body.removeChild(certElement);
    }

    this.downloadBlob(blob, filename);
  }

  async exportAllCertificates(
    certificates: Certificate[],
    settings: CertificateSettings,
    onProgress?: (progress: number) => void
  ): Promise<void> {
    if (certificates.length === 1) {
      await this.exportSingleCertificate(certificates[0], settings);
    } else {
      const zipBlob = await this.exportMultipleCertificates(certificates, settings, onProgress);
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
      this.downloadBlob(zipBlob, `certificates_${timestamp}.zip`);
    }
  }

  // Helper methods
  private getQuality(quality: string): number {
    switch (quality) {
      case 'high': return 1.0;
      case 'medium': return 0.8;
      case 'low': return 0.6;
      default: return 0.8;
    }
  }

  private sanitizeFilename(filename: string): string {
    return filename
      .replace(/[<>:"/\\|?*]/g, '_')
      .replace(/\s+/g, '_')
      .substring(0, 100);
  }

  private getDisplayText(certificate: Certificate, textArea: any): string {
    switch (textArea.id) {
      case 'name':
        return certificate.student.name || textArea.defaultText;
      case 'title':
        return textArea.defaultText;
      case 'content':
        return certificate.customText || textArea.defaultText;
      case 'manager':
        return this.managerName || textArea.defaultText; // استخدام اسم المدير المحفوظ
      case 'date':
        return new Date().toLocaleDateString('ar-SA') || textArea.defaultText;
      default:
        return textArea.defaultText;
    }
  }

  // إضافة خاصية اسم المدير
  private managerName: string = '';

  // إضافة دالة setInstitutionLogo
  setInstitutionLogo(logo: string | null): void {
    this.institutionLogo = logo;
  }

  getInstitutionLogo(): string | null {
    return this.institutionLogo;
  }

  // إضافة دالة تعيين اسم المدير
  setManagerName(name: string): void {
    this.managerName = name;
  }

  getManagerName(): string {
    return this.managerName;
  }

  // Get file size estimate
  getEstimatedFileSize(
    certificate: Certificate,
    settings: CertificateSettings
  ): { size: string; unit: string } {
    const width = certificate.template.width * settings.scale;
    const height = certificate.template.height * settings.scale;
    const pixels = width * height;

    let bytes: number;

    switch (settings.format) {
      case 'png':
        bytes = pixels * 4; // 4 bytes per pixel for RGBA
        break;
      case 'jpg':
        bytes = pixels * 0.5; // Compressed
        break;
      case 'pdf':
        bytes = pixels * 2; // Estimated
        break;
      default:
        bytes = pixels * 2;
    }

    return this.formatFileSize(bytes);
  }

  // Estimate total export size
  getEstimatedTotalSize(
    certificates: Certificate[],
    settings: CertificateSettings
  ): { size: string; unit: string } {
    if (certificates.length === 0) {
      return { size: '0', unit: 'KB' };
    }

    const singleSize = this.getEstimatedFileSize(certificates[0], settings);
    const totalBytes = this.parseSize(singleSize) * certificates.length;

    return this.formatFileSize(totalBytes);
  }

  private formatFileSize(bytes: number): { size: string; unit: string } {
    if (bytes === 0) return { size: '0', unit: 'B' };

    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return {
      size: parseFloat((bytes / Math.pow(k, i)).toFixed(1)).toString(),
      unit: sizes[i]
    };
  }

  private parseSize(sizeObj: { size: string; unit: string }): number {
    const size = parseFloat(sizeObj.size);
    const multipliers = { 'B': 1, 'KB': 1024, 'MB': 1024 * 1024, 'GB': 1024 * 1024 * 1024 };
    return size * (multipliers[sizeObj.unit as keyof typeof multipliers] || 1);
  }
}