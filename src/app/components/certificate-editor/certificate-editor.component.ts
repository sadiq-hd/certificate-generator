import { Component, OnInit, OnDestroy, ViewChild, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { Student } from '../../models/student.model';
import { Template, TextArea } from '../../models/template.model';
import { CertificateService } from '../../services/certificate.service';
import { TemplateService } from '../../services/template.service';
import { AppSettings } from '../../app.settings';

interface DragState {
  isDragging: boolean;
  startX: number;
  startY: number;
  startLeft: number;
  startTop: number;
  textAreaId: string;
}

interface ResizeState {
  isResizing: boolean;
  startX: number;
  startY: number;
  startWidth: number;
  startHeight: number;
  startLeft: number;
  startTop: number;
  textAreaId: string;
  direction: string;
}

@Component({
  selector: 'app-certificate-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './certificate-editor.component.html',
  styleUrls: ['./certificate-editor.component.css']
})
export class CertificateEditorComponent implements OnInit, OnDestroy {
  @ViewChild('certificateCanvas', { static: false }) certificateCanvas!: ElementRef;

  selectedTemplate: Template | null = null;
  students: Student[] = [];
  customText: string = '';
  textAreas: TextArea[] = [];
  selectedTextAreaId: string | null = null;
  selectedTextArea: TextArea | null = null;
  currentStudentIndex: number = 0;
  zoomLevel: number = 1;
  canvasWidth: number = 800;
  canvasHeight: number = 600;
  availableFonts = AppSettings.fonts;
  institutionLogo: string | null = null;
  managerName: string = '';

  // Drag and resize states
  private dragState: DragState = {
    isDragging: false,
    startX: 0,
    startY: 0,
    startLeft: 0,
    startTop: 0,
    textAreaId: ''
  };

  private resizeState: ResizeState = {
    isResizing: false,
    startX: 0,
    startY: 0,
    startWidth: 0,
    startHeight: 0,
    startLeft: 0,
    startTop: 0,
    textAreaId: '',
    direction: ''
  };

  // Undo/Redo
  canUndo: boolean = false;
  canRedo: boolean = false;

  private destroy$ = new Subject<void>();

  constructor(
    private certificateService: CertificateService,
    private templateService: TemplateService
  ) {}

  ngOnInit(): void {
    // تحقق من صحة البيانات قبل التحميل
    if (!this.certificateService.validateData()) {
      console.warn('Invalid data detected, clearing corrupted data...');
      this.certificateService.clearCorruptedData();
      return;
    }
    
    this.loadData();
    this.updateUndoRedoState();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadData(): void {
    try {
      this.certificateService.selectedTemplate$
        .pipe(takeUntil(this.destroy$))
        .subscribe(template => {
          if (template) {
            this.selectedTemplate = template;
            this.textAreas = [...template.textAreas];
            this.calculateCanvasSize();
          }
        });

      this.certificateService.students$
        .pipe(takeUntil(this.destroy$))
        .subscribe(students => {
          if (Array.isArray(students)) {
            this.students = students;
          } else {
            console.warn('Invalid students data received');
            this.students = [];
          }
        });

      this.certificateService.customText$
        .pipe(takeUntil(this.destroy$))
        .subscribe(text => {
          this.customText = text || '';
        });

      this.certificateService.institutionLogo$
        .pipe(takeUntil(this.destroy$))
        .subscribe(logo => {
          this.institutionLogo = logo;
        });

      this.certificateService.managerName$
        .pipe(takeUntil(this.destroy$))
        .subscribe(name => {
          this.managerName = name || '';
        });
    } catch (error) {
      console.error('Error loading data:', error);
      this.certificateService.clearCorruptedData();
    }
  }

  private calculateCanvasSize(): void {
    if (this.selectedTemplate) {
      const maxWidth = window.innerWidth < 1024 ? window.innerWidth - 100 : 800;
      const maxHeight = window.innerHeight - 400;
      
      const widthRatio = maxWidth / this.selectedTemplate.width;
      const heightRatio = maxHeight / this.selectedTemplate.height;
      const ratio = Math.min(widthRatio, heightRatio, 1);
      
      this.zoomLevel = ratio;
      this.canvasWidth = this.selectedTemplate.width * ratio;
      this.canvasHeight = this.selectedTemplate.height * ratio;
    }
  }

  // Text Area Management
  selectTextArea(textAreaId: string): void {
    this.selectedTextAreaId = textAreaId;
    this.selectedTextArea = this.textAreas.find(area => area.id === textAreaId) || null;
  }

  updateTextArea(textAreaId: string, updates: Partial<TextArea>): void {
    const index = this.textAreas.findIndex(area => area.id === textAreaId);
    if (index !== -1) {
      this.textAreas[index] = { ...this.textAreas[index], ...updates };
      this.saveChanges();
    }
  }

  toggleTextAreaVisibility(textAreaId: string): void {
    const textArea = this.textAreas.find(area => area.id === textAreaId);
    if (textArea) {
      textArea.isDraggable = !textArea.isDraggable;
      this.saveChanges();
    }
  }

  // NEW: Missing method - count students with images
  getStudentsWithImages(): number {
    return this.students.filter(student => student.image && student.image.trim() !== '').length;
  }

  // NEW: Missing method - resize element functionality
  resizeElement(textAreaId: string, direction: 'smaller' | 'larger'): void {
    const textArea = this.textAreas.find(area => area.id === textAreaId);
    if (!textArea) return;

    const scaleFactor = direction === 'larger' ? 1.1 : 0.9;
    const minWidth = 50;
    const minHeight = 20;
    const maxWidth = this.selectedTemplate ? this.selectedTemplate.width * 0.8 : 640;
    const maxHeight = this.selectedTemplate ? this.selectedTemplate.height * 0.8 : 480;

    const newWidth = Math.max(minWidth, Math.min(maxWidth, textArea.width * scaleFactor));
    const newHeight = Math.max(minHeight, Math.min(maxHeight, textArea.height * scaleFactor));

    this.updateTextArea(textAreaId, {
      width: newWidth,
      height: newHeight
    });
  }

  getDisplayText(textArea: TextArea): string {
    const currentStudent = this.students[this.currentStudentIndex];
    
    switch (textArea.id) {
      case 'name':
        return currentStudent?.name || textArea.defaultText;
      
      case 'title':
        return textArea.defaultText;
      
      case 'content':
        return this.customText || textArea.defaultText;
      
      case 'manager':
        return this.managerName || textArea.defaultText;
      
      case 'date':
        return new Date().toLocaleDateString('ar-SA') || textArea.defaultText;
      
      case 'logo':
        // للشعار، نعرض النص فقط في المحرر
        return this.institutionLogo ? 'الشعار' : textArea.defaultText;
      
      default:
        return textArea.defaultText;
    }
  }

  getStudentImage(): string | null {
    const currentStudent = this.students[this.currentStudentIndex];
    return currentStudent?.image || null;
  }

  getAlignmentLabel(align: string): string {
    switch (align) {
      case 'left': return 'يسار';
      case 'center': return 'وسط';
      case 'right': return 'يمين';
      default: return align;
    }
  }

  getAlignmentOptions(): ('left' | 'center' | 'right')[] {
    return ['left', 'center', 'right'];
  }

  // Student Navigation
  previousStudent(): void {
    if (this.currentStudentIndex > 0) {
      this.currentStudentIndex--;
    }
  }

  nextStudent(): void {
    if (this.currentStudentIndex < this.students.length - 1) {
      this.currentStudentIndex++;
    }
  }

  // Zoom Controls
  zoomIn(): void {
    if (this.zoomLevel < 2) {
      this.zoomLevel = Math.min(2, this.zoomLevel + 0.1);
      this.updateCanvasSize();
    }
  }

  zoomOut(): void {
    if (this.zoomLevel > 0.2) {
      this.zoomLevel = Math.max(0.2, this.zoomLevel - 0.1);
      this.updateCanvasSize();
    }
  }

  resetZoom(): void {
    this.calculateCanvasSize();
  }

  private updateCanvasSize(): void {
    if (this.selectedTemplate) {
      this.canvasWidth = this.selectedTemplate.width * this.zoomLevel;
      this.canvasHeight = this.selectedTemplate.height * this.zoomLevel;
    }
  }

  // Drag and Drop
  startDrag(event: MouseEvent, textAreaId: string): void {
    event.preventDefault();
    event.stopPropagation();

    const textArea = this.textAreas.find(area => area.id === textAreaId);
    if (!textArea || !textArea.isDraggable) return;

    this.selectTextArea(textAreaId);

    this.dragState = {
      isDragging: true,
      startX: event.clientX,
      startY: event.clientY,
      startLeft: textArea.x,
      startTop: textArea.y,
      textAreaId: textAreaId
    };

    document.addEventListener('mousemove', this.onDrag.bind(this));
    document.addEventListener('mouseup', this.stopDrag.bind(this));
  }

  @HostListener('document:mousemove', ['$event'])
  onDrag(event: MouseEvent): void {
    if (!this.dragState.isDragging) return;

    event.preventDefault();
    
    const deltaX = (event.clientX - this.dragState.startX) / this.zoomLevel;
    const deltaY = (event.clientY - this.dragState.startY) / this.zoomLevel;

    const newX = this.dragState.startLeft + deltaX;
    const newY = this.dragState.startTop + deltaY;

    // Boundary constraints
    const textArea = this.textAreas.find(area => area.id === this.dragState.textAreaId);
    if (textArea && this.selectedTemplate) {
      const constrainedX = Math.max(
        textArea.width / 2,
        Math.min(this.selectedTemplate.width - textArea.width / 2, newX)
      );
      const constrainedY = Math.max(
        textArea.height / 2,
        Math.min(this.selectedTemplate.height - textArea.height / 2, newY)
      );

      this.updateTextArea(this.dragState.textAreaId, {
        x: constrainedX,
        y: constrainedY
      });
    }
  }

  @HostListener('document:mouseup', ['$event'])
  stopDrag(event: MouseEvent): void {
    if (this.dragState.isDragging) {
      this.dragState.isDragging = false;
      document.removeEventListener('mousemove', this.onDrag.bind(this));
      document.removeEventListener('mouseup', this.stopDrag.bind(this));
    }
  }

  // Resize functionality
  startResize(event: MouseEvent, textAreaId: string, direction: string): void {
    event.preventDefault();
    event.stopPropagation();

    const textArea = this.textAreas.find(area => area.id === textAreaId);
    if (!textArea || !textArea.isResizable) return;

    this.resizeState = {
      isResizing: true,
      startX: event.clientX,
      startY: event.clientY,
      startWidth: textArea.width,
      startHeight: textArea.height,
      startLeft: textArea.x,
      startTop: textArea.y,
      textAreaId: textAreaId,
      direction: direction
    };

    document.addEventListener('mousemove', this.onResize.bind(this));
    document.addEventListener('mouseup', this.stopResize.bind(this));
  }

  onResize(event: MouseEvent): void {
    if (!this.resizeState.isResizing) return;

    event.preventDefault();

    const deltaX = (event.clientX - this.resizeState.startX) / this.zoomLevel;
    const deltaY = (event.clientY - this.resizeState.startY) / this.zoomLevel;

    let newWidth = this.resizeState.startWidth;
    let newHeight = this.resizeState.startHeight;
    let newX = this.resizeState.startLeft;
    let newY = this.resizeState.startTop;

    // Calculate new dimensions based on resize direction
    switch (this.resizeState.direction) {
      case 'se': // Southeast
        newWidth = Math.max(50, this.resizeState.startWidth + deltaX);
        newHeight = Math.max(20, this.resizeState.startHeight + deltaY);
        break;
      case 'sw': // Southwest
        newWidth = Math.max(50, this.resizeState.startWidth - deltaX);
        newHeight = Math.max(20, this.resizeState.startHeight + deltaY);
        newX = this.resizeState.startLeft + (this.resizeState.startWidth - newWidth) / 2;
        break;
      case 'ne': // Northeast
        newWidth = Math.max(50, this.resizeState.startWidth + deltaX);
        newHeight = Math.max(20, this.resizeState.startHeight - deltaY);
        newY = this.resizeState.startTop + (this.resizeState.startHeight - newHeight) / 2;
        break;
      case 'nw': // Northwest
        newWidth = Math.max(50, this.resizeState.startWidth - deltaX);
        newHeight = Math.max(20, this.resizeState.startHeight - deltaY);
        newX = this.resizeState.startLeft + (this.resizeState.startWidth - newWidth) / 2;
        newY = this.resizeState.startTop + (this.resizeState.startHeight - newHeight) / 2;
        break;
    }

    this.updateTextArea(this.resizeState.textAreaId, {
      width: newWidth,
      height: newHeight,
      x: newX,
      y: newY
    });
  }

  stopResize(event: MouseEvent): void {
    if (this.resizeState.isResizing) {
      this.resizeState.isResizing = false;
      document.removeEventListener('mousemove', this.onResize.bind(this));
      document.removeEventListener('mouseup', this.stopResize.bind(this));
    }
  }

  // Undo/Redo functionality
  undo(): void {
    const success = this.certificateService.undo();
    if (success) {
      this.loadData();
      this.updateUndoRedoState();
    }
  }

  redo(): void {
    const success = this.certificateService.redo();
    if (success) {
      this.loadData();
      this.updateUndoRedoState();
    }
  }

  private updateUndoRedoState(): void {
    // This would need to be implemented in the service
    this.canUndo = true; // Placeholder
    this.canRedo = false; // Placeholder
  }

  resetToDefault(): void {
    if (this.selectedTemplate) {
      this.textAreas = [...this.selectedTemplate.textAreas];
      this.saveChanges();
    }
  }

  private saveChanges(): void {
    if (this.selectedTemplate) {
      const updatedTemplate = {
        ...this.selectedTemplate,
        textAreas: [...this.textAreas]
      };
      this.certificateService.setSelectedTemplate(updatedTemplate);
    }
  }

  // Navigation
  goBack(): void {
    this.saveChanges();
    this.certificateService.previousStep();
  }

  generateCertificates(): void {
    if (this.students.length === 0) return;

    this.saveChanges();
    this.certificateService.generateCertificates();
    this.certificateService.nextStep();
  }

  // Keyboard shortcuts
  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (event.ctrlKey || event.metaKey) {
      switch (event.key.toLowerCase()) {
        case 'z':
          if (event.shiftKey) {
            this.redo();
          } else {
            this.undo();
          }
          event.preventDefault();
          break;
        case 'y':
          this.redo();
          event.preventDefault();
          break;
      }
    }

    // Delete selected text area
    if (event.key === 'Delete' && this.selectedTextArea) {
      this.toggleTextAreaVisibility(this.selectedTextArea.id);
      event.preventDefault();
    }

    // Arrow keys for fine positioning
    if (this.selectedTextArea && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
      const step = event.shiftKey ? 10 : 1;
      let newX = this.selectedTextArea.x;
      let newY = this.selectedTextArea.y;

      switch (event.key) {
        case 'ArrowUp':
          newY -= step;
          break;
        case 'ArrowDown':
          newY += step;
          break;
        case 'ArrowLeft':
          newX -= step;
          break;
        case 'ArrowRight':
          newX += step;
          break;
      }

      this.updateTextArea(this.selectedTextArea.id, { x: newX, y: newY });
      event.preventDefault();
    }
  }
}