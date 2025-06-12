import { Injectable } from '@angular/core';
import { Certificate, CertificateSettings } from '../models/certificate.model';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import JSZip from 'jszip';

@Injectable({
  providedIn: 'root'
})
export class ExportService {

  constructor() {}

  // Export single certificate as image
  async exportCertificateAsImage(
    certificateElement: HTMLElement,
    certificate: Certificate,
    settings: CertificateSettings
  ): Promise<Blob> {
    try {
      const canvas = await html2canvas(certificateElement, {
        scale: settings.scale,
        backgroundColor: settings.backgroundColor,
        useCORS: true,
        allowTaint: true,
        logging: false,
        width: certificate.template.width,
        height: certificate.template.height
      });

      return new Promise((resolve) => {
        canvas.toBlob((blob) => {
          resolve(blob!);
        }, `image/${settings.format}`, this.getQuality(settings.quality));
      });
    } catch (error) {
      throw new Error('فشل في تصدير الشهادة كصورة: ' + error);
    }
  }

  // Export single certificate as PDF
  async exportCertificateAsPDF(
    certificateElement: HTMLElement,
    certificate: Certificate,
    settings: CertificateSettings
  ): Promise<Blob> {
    try {
      const canvas = await html2canvas(certificateElement, {
        scale: settings.scale,
        backgroundColor: settings.backgroundColor,
        useCORS: true,
        allowTaint: true,
        logging: false
      });

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
        // Find certificate element in DOM
        const certElement = document.getElementById(`certificate-${certificate.id}`);
        if (!certElement) {
          console.warn(`Certificate element not found for ${certificate.student.name}`);
          continue;
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

        folder?.file(filename, blob);

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

  // Download blob as file
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

  // Export single certificate
  async exportSingleCertificate(
    certificate: Certificate,
    settings: CertificateSettings
  ): Promise<void> {
    const certElement = document.getElementById(`certificate-${certificate.id}`);
    if (!certElement) {
      throw new Error('عنصر الشهادة غير موجود');
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

    this.downloadBlob(blob, filename);
  }

  // Export all certificates
  async exportAllCertificates(
    certificates: Certificate[],
    settings: CertificateSettings,
    onProgress?: (progress: number) => void
  ): Promise<void> {
    if (certificates.length === 1) {
      // Single certificate - download directly
      await this.exportSingleCertificate(certificates[0], settings);
    } else {
      // Multiple certificates - create ZIP
      const zipBlob = await this.exportMultipleCertificates(certificates, settings, onProgress);
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
      this.downloadBlob(zipBlob, `certificates_${timestamp}.zip`);
    }
  }

  // Preview certificate for export
  async previewCertificate(
    certificateElement: HTMLElement,
    certificate: Certificate,
    settings: CertificateSettings
  ): Promise<string> {
    try {
      const canvas = await html2canvas(certificateElement, {
        scale: Math.min(settings.scale, 1), // Lower scale for preview
        backgroundColor: settings.backgroundColor,
        useCORS: true,
        allowTaint: true,
        logging: false
      });

      return canvas.toDataURL('image/png', 0.8);
    } catch (error) {
      throw new Error('فشل في إنشاء معاينة الشهادة: ' + error);
    }
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