import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { Template } from '../../models/template.model';
import { TemplateService } from '../../services/template.service';
import { CertificateService } from '../../services/certificate.service';

@Component({
  selector: 'app-template-selector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './template-selector.component.html',
  styleUrls: ['./template-selector.component.css']
})
export class TemplateSelectorComponent implements OnInit, OnDestroy {
  templates: Template[] = [];
  selectedTemplate: Template | null = null;
  isLoading = false;
  private destroy$ = new Subject<void>();

  constructor(
    private templateService: TemplateService,
    private certificateService: CertificateService
  ) {}

  ngOnInit(): void {
    this.loadTemplates();
    this.loadSelectedTemplate();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadTemplates(): void {
    this.isLoading = true;
    
    this.templateService.getTemplates()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (templates) => {
          this.templates = templates;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading templates:', error);
          this.isLoading = false;
        }
      });
  }

  private loadSelectedTemplate(): void {
    this.certificateService.selectedTemplate$
      .pipe(takeUntil(this.destroy$))
      .subscribe(template => {
        this.selectedTemplate = template;
      });
  }

  selectTemplate(template: Template): void {
    this.selectedTemplate = template;
    this.certificateService.setSelectedTemplate(template);
  }

  continueToNext(): void {
    if (this.selectedTemplate) {
      this.certificateService.nextStep();
    }
  }

  goBack(): void {
    this.certificateService.previousStep();
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'assets/images/template-placeholder.png';
  }

  trackByTemplateId(index: number, template: Template): string {
    return template.id;
  }
}