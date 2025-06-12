import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { Certificate } from '../../models/certificate.model';
import { Template, TextArea } from '../../models/template.model';
import { CertificateService } from '../../services/certificate.service';
import { ExportService } from '../../services/export.service';

type ViewMode = 'grid' | 'list' | 'single';

@Component({
  selector: 'app-preview-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './preview-panel.component.html',
  styleUrls: ['./preview-panel.component.css']
})
export class PreviewPanelComponent implements OnInit, OnDestroy {
  certificates: Certificate[] = [];
  filteredCertificates: Certificate[] = [];
  selectedTemplate: Template | null = null;
  selectedCertificates = new Set<string>();
  
  viewMode: ViewMode = 'grid';
  searchTerm: string = '';
  
  // Single view properties
  currentCertificateIndex: number = 0;
  currentCertificate: Certificate | null = null;
  displayScale: number = 1;
  displayWidth: number = 800;
  displayHeight: number = 600;
  
  // Modal properties
  showModal: boolean = false;
  modalCertificate: Certificate | null = null;
  
  // Selection state
  allSelected: boolean = false;
  someSelected: boolean = false;

  private destroy$ = new Subject<void>();

  constructor(
    private certificateService: CertificateService,
    private exportService: ExportService
  ) {}

  ngOnInit(): void {
    this.loadData();
    this.calculateDisplaySize();
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
        this.filteredCertificates = [...certificates];
        this.updateCurrentCertificate();
        this.updateSelectionState();
        
        // Auto-select all certificates initially
        if (certificates.length > 0 && this.selectedCertificates.size === 0) {
          this.selectAll();
        }
      });

    // Load selected template
    this.certificateService.selectedTemplate$
      .pipe(takeUntil(this.destroy$))
      .subscribe(template => {
        this.selectedTemplate = template;
        this.calculateDisplaySize();
      });
  }

  private calculateDisplaySize(): void {
    if (this.selectedTemplate) {
      const maxWidth = Math.min(800, window.innerWidth * 0.8);
      const maxHeight = Math.min(600, window.innerHeight * 0.6);
      
      const scaleX = maxWidth / this.selectedTemplate.width;
      const scaleY = maxHeight / this.selectedTemplate.height;
      this.displayScale = Math.min(scaleX, scaleY, 1);
      
      this.displayWidth = this.selectedTemplate.width * this.displayScale;
      this.displayHeight = this.selectedTemplate.height * this.displayScale;
    }
  }

  // View mode management
  setViewMode(mode: ViewMode): void {
    this.viewMode = mode;
    this.updateCurrentCertificate();
  }

  // Search and filtering
  filterCertificates(): void {
    if (!this.searchTerm.trim()) {
      this.filteredCertificates = [...this.certificates];
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredCertificates = this.certificates.filter(cert =>
        cert.student?.name?.toLowerCase().includes(term) || false
      );
    }
    
    this.currentCertificateIndex = 0;
    this.updateCurrentCertificate();
    this.updateSelectionState();
  }

  // Selection management
  toggleCertificateSelection(certificateId: string): void {
    if (this.selectedCertificates.has(certificateId)) {
      this.selectedCertificates.delete(certificateId);
    } else {
      this.selectedCertificates.add(certificateId);
    }
    this.updateSelectionState();
  }

  selectAll(): void {
    this.filteredCertificates.forEach(cert => {
      this.selectedCertificates.add(cert.id);
    });
    this.updateSelectionState();
  }

  clearSelection(): void {
    this.selectedCertificates.clear();
    this.updateSelectionState();
  }

  toggleAllSelection(): void {
    if (this.allSelected) {
      this.clearSelection();
    } else {
      this.selectAll();
    }
  }

  private updateSelectionState(): void {
    const filteredIds = this.filteredCertificates.map(cert => cert.id);
    const selectedFilteredCount = filteredIds.filter(id => 
      this.selectedCertificates.has(id)
    ).length;
    
    this.allSelected = selectedFilteredCount === filteredIds.length && filteredIds.length > 0;
    this.someSelected = selectedFilteredCount > 0 && selectedFilteredCount < filteredIds.length;
  }

  // Single view navigation
  private updateCurrentCertificate(): void {
    if (this.filteredCertificates.length > 0 && this.currentCertificateIndex >= 0) {
      this.currentCertificate = this.filteredCertificates[this.currentCertificateIndex] || null;
    } else {
      this.currentCertificate = null;
    }
  }

  previousCertificate(): void {
    if (this.currentCertificateIndex > 0) {
      this.currentCertificateIndex--;
      this.updateCurrentCertificate();
    }
  }

  nextCertificate(): void {
    if (this.currentCertificateIndex < this.filteredCertificates.length - 1) {
      this.currentCertificateIndex++;
      this.updateCurrentCertificate();
    }
  }

  // Zoom controls
  zoomIn(): void {
    if (this.displayScale < 2) {
      this.displayScale = Math.min(2, this.displayScale + 0.1);
      this.updateDisplaySize();
    }
  }

  zoomOut(): void {
    if (this.displayScale > 0.2) {
      this.displayScale = Math.max(0.2, this.displayScale - 0.1);
      this.updateDisplaySize();
    }
  }

  resetZoom(): void {
    this.calculateDisplaySize();
  }

  private updateDisplaySize(): void {
    if (this.selectedTemplate) {
      this.displayWidth = this.selectedTemplate.width * this.displayScale;
      this.displayHeight = this.selectedTemplate.height * this.displayScale;
    }
  }

  // Modal management
  viewCertificate(certificate: Certificate): void {
    this.modalCertificate = certificate;
    this.showModal = true;
    document.body.style.overflow = 'hidden';
  }

  closeModal(): void {
    this.showModal = false;
    this.modalCertificate = null;
    document.body.style.overflow = 'auto';
  }

  // Certificate actions
  duplicateCertificate(certificate: Certificate): void {
    const duplicated: Certificate = {
      ...certificate,
      id: this.generateId(),
      generatedAt: new Date()
    };
    
    // Add to certificates array
    this.certificates.push(duplicated);
    this.filterCertificates();
  }

  deleteCertificate(certificateId: string): void {
    if (confirm('هل أنت متأكد من حذف هذه الشهادة؟')) {
      this.certificates = this.certificates.filter(cert => cert.id !== certificateId);
      this.selectedCertificates.delete(certificateId);
      this.filterCertificates();
    }
  }

  // Text display logic
  getDisplayText(certificate: Certificate, textArea: TextArea): string {
    if (!certificate || !textArea) {
      return '';
    }
    
    switch (textArea.id) {
      case 'name':
        return certificate.student?.name || textArea.defaultText;
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

  // Utility methods
  getInitials(name: string | undefined): string {
    if (!name) return '؟';
    
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .substring(0, 2)
      .toUpperCase();
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  }

  getCurrentDateTime(): string {
    return new Intl.DateTimeFormat('ar-SA', {
      month: 'short',
      day: 'numeric'
    }).format(new Date());
  }

  getEstimatedSize(): string {
    if (this.certificates.length === 0 || !this.selectedTemplate) {
      return '0 KB';
    }

    const settings = {
      quality: 'high' as const,
      format: 'png' as const,
      scale: 2,
      backgroundColor: '#ffffff'
    };

    const sizeEstimate = this.exportService.getEstimatedTotalSize(
      this.certificates, 
      settings
    );

    return `${sizeEstimate.size} ${sizeEstimate.unit}`;
  }

  trackByCertificateId(index: number, certificate: Certificate): string {
    return certificate.id;
  }

  // Navigation
  goBack(): void {
    this.certificateService.previousStep();
  }

  continueToExport(): void {
    if (this.selectedCertificates.size === 0) {
      alert('يرجى تحديد شهادة واحدة على الأقل للتصدير');
      return;
    }

    // Filter selected certificates and update service
    const selectedCerts = this.certificates.filter(cert => 
      this.selectedCertificates.has(cert.id)
    );
    
    // Update the service with selected certificates only
    // This might require adding a method to the service
    this.certificateService.nextStep();
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}