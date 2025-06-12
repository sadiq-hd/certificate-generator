import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Template } from '../models/template.model';
import { AppSettings } from '../app.settings';

@Injectable({
  providedIn: 'root'
})
export class TemplateService {
  private templates: Template[] = AppSettings.templates;

  constructor() {}

  // Get all available templates
  getTemplates(): Observable<Template[]> {
    return of(this.templates);
  }

  // Get template by ID
  getTemplateById(id: string): Observable<Template | undefined> {
    const template = this.templates.find(t => t.id === id);
    return of(template);
  }

  // Load template image
  loadTemplateImage(imagePath: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = imagePath;
    });
  }

  // Check if template image exists
  checkImageExists(imagePath: string): Promise<boolean> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = imagePath;
    });
  }

  // Get template dimensions
  getTemplateDimensions(template: Template): Promise<{ width: number; height: number }> {
    return this.loadTemplateImage(template.imagePath)
      .then(img => ({
        width: img.naturalWidth || template.width,
        height: img.naturalHeight || template.height
      }))
      .catch(() => ({
        width: template.width,
        height: template.height
      }));
  }

  // Create custom template (for future enhancement)
  createCustomTemplate(templateData: Partial<Template>): Template {
    const newTemplate: Template = {
      id: this.generateId(),
      name: templateData.name || 'قالب مخصص',
      imagePath: templateData.imagePath || '',
      thumbnail: templateData.thumbnail || templateData.imagePath || '',
      width: templateData.width || 800,
      height: templateData.height || 600,
      textAreas: templateData.textAreas || [],
      description: templateData.description || 'قالب مخصص'
    };

    this.templates.push(newTemplate);
    return newTemplate;
  }

  // Validate template structure
  validateTemplate(template: Template): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!template.id) errors.push('معرف القالب مطلوب');
    if (!template.name) errors.push('اسم القالب مطلوب');
    if (!template.imagePath) errors.push('مسار صورة القالب مطلوب');
    if (template.width <= 0) errors.push('عرض القالب يجب أن يكون أكبر من صفر');
    if (template.height <= 0) errors.push('ارتفاع القالب يجب أن يكون أكبر من صفر');

    // Validate text areas
    template.textAreas.forEach((area, index) => {
      if (!area.id) errors.push(`منطقة النص ${index + 1}: المعرف مطلوب`);
      if (!area.label) errors.push(`منطقة النص ${index + 1}: التسمية مطلوبة`);
      if (area.x < 0 || area.y < 0) errors.push(`منطقة النص ${index + 1}: الموقع غير صحيح`);
      if (area.width <= 0 || area.height <= 0) errors.push(`منطقة النص ${index + 1}: الأبعاد غير صحيحة`);
      if (area.fontSize <= 0) errors.push(`منطقة النص ${index + 1}: حجم الخط غير صحيح`);
    });

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Get fonts list
  getFonts() {
    return AppSettings.fonts;
  }

  // Helper method to generate ID
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}