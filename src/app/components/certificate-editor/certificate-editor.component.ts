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

interface LogoResizeState {
  isResizing: boolean;
  startX: number;
  startY: number;
  startWidth: number;
  startHeight: number;
  direction: string;
}

interface CustomTextItem {
  id: string;
  label: string;
  value: string;
  placeholder: string;
}

interface LogoPosition {
  x: number;
  y: number;
}

interface LogoSize {
  width: number;
  height: number;
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

  // Main Properties
  selectedTemplate: Template | null = null;
  students: Student[] = [];
  customText: string = '';
  certificateName: string = ''; // إضافة متغير اسم الشهادة
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

  // Logo Control Properties
  isLogoVisible: boolean = true;
  logoPosition: LogoPosition = { x: 100, y: 100 };
  logoSize: LogoSize = { width: 120, height: 120 };

  // Custom Texts
  customTexts: CustomTextItem[] = [
    { id: 'schoolName', label: 'اسم المدرسة', value: '', placeholder: 'أدخل اسم المدرسة' },
    { id: 'principalTitle', label: 'منصب المدير', value: 'مدير المدرسة', placeholder: 'مدير المدرسة' },
    { id: 'supervisorName', label: 'اسم المشرف', value: '', placeholder: 'أدخل اسم المشرف' },
    { id: 'supervisorTitle', label: 'منصب المشرف', value: 'المشرف التربوي', placeholder: 'المشرف التربوي' },
    { id: 'courseName', label: 'اسم الدورة', value: '', placeholder: 'أدخل اسم الدورة' },
    { id: 'certificateNumber', label: 'رقم الشهادة', value: '', placeholder: 'رقم الشهادة' },
    { id: 'issuePlace', label: 'مكان الإصدار', value: '', placeholder: 'مكان إصدار الشهادة' }
  ];

  // Form Properties
  newTextLabel: string = '';
  newTextValue: string = '';
  showAddTextDialog: boolean = false;

  // State Management
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

  private logoResizeState: LogoResizeState = {
    isResizing: false,
    startX: 0,
    startY: 0,
    startWidth: 0,
    startHeight: 0,
    direction: ''
  };

  // Undo/Redo
  canUndo: boolean = false;
  canRedo: boolean = false;

  private destroy$ = new Subject<void>();

  constructor(
    private certificateService: CertificateService,
    private templateService: TemplateService
  ) {
    this.loadCustomFonts();
  }

  ngOnInit(): void {
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

  // Data Loading
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

      // إضافة subscription لاسم الشهادة
      this.certificateService.certificateName$
        .pipe(takeUntil(this.destroy$))
        .subscribe(name => {
          this.certificateName = name || '';
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

  // Font Loading
  private loadCustomFonts(): void {
    const fonts = [
      'ae_AlArabiya',
      '18 Khebrat Musamim', 
      'Hacen Samra Lt',
      'mohammed bold art normal',
      'mohammed bold art bold'
    ];

    fonts.forEach(font => {
      const link = document.createElement('link');
      link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(font)}&display=swap`;
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    });
  }

  // Logo Control Methods
  toggleLogoVisibility(): void {
    this.isLogoVisible = !this.isLogoVisible;
  }

  updateLogoPosition(): void {
    // Position updates handled by reactive binding
    console.log('Logo position updated:', this.logoPosition);
  }

  updateLogoSize(): void {
    this.logoSize.width = Math.max(50, Math.min(400, this.logoSize.width));
    this.logoSize.height = Math.max(50, Math.min(400, this.logoSize.height));
    console.log('Logo size updated:', this.logoSize);
  }

  setLogoSize(size: 'small' | 'medium' | 'large'): void {
    switch(size) {
      case 'small':
        this.logoSize = { width: 80, height: 80 };
        break;
      case 'medium':
        this.logoSize = { width: 120, height: 120 };
        break;
      case 'large':
        this.logoSize = { width: 180, height: 180 };
        break;
    }
    this.updateLogoSize();
  }

  // Logo Resize Methods
  startLogoResize(event: MouseEvent, direction: string): void {
    event.preventDefault();
    event.stopPropagation();

    this.logoResizeState = {
      isResizing: true,
      startX: event.clientX,
      startY: event.clientY,
      startWidth: this.logoSize.width,
      startHeight: this.logoSize.height,
      direction: direction
    };

    document.addEventListener('mousemove', this.onLogoResize.bind(this));
    document.addEventListener('mouseup', this.stopLogoResize.bind(this));
  }

  private onLogoResize(event: MouseEvent): void {
    if (!this.logoResizeState.isResizing) return;

    event.preventDefault();

    const deltaX = event.clientX - this.logoResizeState.startX;
    const deltaY = event.clientY - this.logoResizeState.startY;

    let newWidth = this.logoResizeState.startWidth;
    let newHeight = this.logoResizeState.startHeight;

    switch (this.logoResizeState.direction) {
      case 'se':
        newWidth = Math.max(50, Math.min(400, this.logoResizeState.startWidth + deltaX));
        newHeight = Math.max(50, Math.min(400, this.logoResizeState.startHeight + deltaY));
        break;
      case 'sw':
        newWidth = Math.max(50, Math.min(400, this.logoResizeState.startWidth - deltaX));
        newHeight = Math.max(50, Math.min(400, this.logoResizeState.startHeight + deltaY));
        break;
      case 'ne':
        newWidth = Math.max(50, Math.min(400, this.logoResizeState.startWidth + deltaX));
        newHeight = Math.max(50, Math.min(400, this.logoResizeState.startHeight - deltaY));
        break;
      case 'nw':
        newWidth = Math.max(50, Math.min(400, this.logoResizeState.startWidth - deltaX));
        newHeight = Math.max(50, Math.min(400, this.logoResizeState.startHeight - deltaY));
        break;
    }

    this.logoSize.width = newWidth;
    this.logoSize.height = newHeight;
  }

  private stopLogoResize(event: MouseEvent): void {
    if (this.logoResizeState.isResizing) {
      this.logoResizeState.isResizing = false;
      document.removeEventListener('mousemove', this.onLogoResize.bind(this));
      document.removeEventListener('mouseup', this.stopLogoResize.bind(this));
    }
  }

  // Custom Text Management
  addCustomText(): void {
    if (!this.newTextLabel.trim() || !this.selectedTemplate) return;

    const newId = 'custom_' + Date.now();
    const newTextArea: TextArea = {
      id: newId,
      label: this.newTextLabel,
      x: this.selectedTemplate.width / 2,
      y: this.selectedTemplate.height / 2,
      width: 200,
      height: 50,
      fontSize: 20,
      fontFamily: 'Arial',
      fontWeight: 'normal',
      color: '#000000',
      textAlign: 'center',
      isDraggable: true,
      isResizable: true,
      defaultText: this.newTextValue || this.newTextLabel
    };

    this.customTexts.push({
      id: newId,
      label: this.newTextLabel,
      value: this.newTextValue || this.newTextLabel,
      placeholder: this.newTextLabel
    });

    this.textAreas.push(newTextArea);
    this.saveChanges();
    
    this.newTextLabel = '';
    this.newTextValue = '';
    this.showAddTextDialog = false;
    
    this.selectTextArea(newId);
  }

  addPredefinedText(customText: CustomTextItem): void {
    if (!this.selectedTemplate) return;

    const newTextArea: TextArea = {
      id: customText.id,
      label: customText.label,
      x: this.selectedTemplate.width / 2,
      y: this.selectedTemplate.height / 2,
      width: 200,
      height: 50,
      fontSize: 18,
      fontFamily: 'Arial',
      fontWeight: 'normal',
      color: '#000000',
      textAlign: 'center',
      isDraggable: true,
      isResizable: true,
      defaultText: customText.value || customText.placeholder
    };

    this.textAreas.push(newTextArea);
    this.saveChanges();
    this.selectTextArea(customText.id);
  }

  removeCustomText(textAreaId: string): void {
    this.textAreas = this.textAreas.filter(area => area.id !== textAreaId);
    
    if (textAreaId.startsWith('custom_')) {
      this.customTexts = this.customTexts.filter(text => text.id !== textAreaId);
    }
    
    if (this.selectedTextAreaId === textAreaId) {
      this.selectedTextAreaId = null;
      this.selectedTextArea = null;
    }
    
    this.saveChanges();
  }

  updateCustomTextValue(customTextId: string, value: string): void {
    const customText = this.customTexts.find(text => text.id === customTextId);
    if (customText) {
      customText.value = value;
      
      const textArea = this.textAreas.find(area => area.id === customTextId);
      if (textArea) {
        textArea.defaultText = value;
        this.saveChanges();
      }
    }
  }

  isCustomTextArea(textAreaId: string): boolean {
    return this.customTexts.some(text => text.id === textAreaId);
  }

  isSpecialTextArea(textAreaId: string): boolean {
    return textAreaId === 'logo';
  }

  isCustomTextInTemplate(customTextId: string): boolean {
    return this.textAreas.some(area => area.id === customTextId);
  }

  getAvailableCustomTexts(): CustomTextItem[] {
    return this.customTexts.filter(text => !this.isCustomTextInTemplate(text.id));
  }

  // Text Area Management
  selectTextArea(textAreaId: string): void {
    this.selectedTextAreaId = textAreaId;
    if (textAreaId === 'logo') {
      this.selectedTextArea = {
        id: 'logo',
        label: 'شعار المؤسسة',
        x: this.logoPosition.x,
        y: this.logoPosition.y,
        width: this.logoSize.width,
        height: this.logoSize.height,
        fontSize: 16,
        fontFamily: 'Arial',
        fontWeight: 'normal',
        color: '#000000',
        textAlign: 'center',
        isDraggable: true,
        isResizable: true,
        defaultText: 'شعار المؤسسة'
      };
    } else {
      this.selectedTextArea = this.textAreas.find(area => area.id === textAreaId) || null;
    }
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

  getStudentsWithImages(): number {
    return this.students.filter(student => student.image && student.image.trim() !== '').length;
  }

  resizeElement(textAreaId: string, direction: 'smaller' | 'larger'): void {
    if (textAreaId === 'logo') {
      const scaleFactor = direction === 'larger' ? 1.1 : 0.9;
      this.logoSize.width = Math.max(50, Math.min(400, this.logoSize.width * scaleFactor));
      this.logoSize.height = Math.max(50, Math.min(400, this.logoSize.height * scaleFactor));
      return;
    }

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
    
    const customText = this.customTexts.find(text => text.id === textArea.id);
    if (customText) {
      return customText.value || textArea.defaultText;
    }
    
    switch (textArea.id) {
      case 'name':
        return currentStudent?.name || textArea.defaultText;
      case 'title':
        // استخدام اسم الشهادة المدخل من المستخدم بدلاً من النص الافتراضي
        return this.certificateName || textArea.defaultText;
      case 'content':
        return this.customText || textArea.defaultText;
      case 'manager':
        return this.managerName || textArea.defaultText;
      case 'date':
        return new Date().toLocaleDateString('ar-SA') || textArea.defaultText;
      case 'logo':
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

    if (textAreaId === 'logo') {
      this.selectTextArea(textAreaId);
      this.dragState = {
        isDragging: true,
        startX: event.clientX,
        startY: event.clientY,
        startLeft: this.logoPosition.x,
        startTop: this.logoPosition.y,
        textAreaId: textAreaId
      };
    } else {
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
    }

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

    if (this.dragState.textAreaId === 'logo') {
      // Handle logo dragging
      if (this.selectedTemplate) {
        const constrainedX = Math.max(
          this.logoSize.width / 2,
          Math.min(this.selectedTemplate.width - this.logoSize.width / 2, newX)
        );
        const constrainedY = Math.max(
          this.logoSize.height / 2,
          Math.min(this.selectedTemplate.height - this.logoSize.height / 2, newY)
        );

        this.logoPosition.x = constrainedX;
        this.logoPosition.y = constrainedY;
      }
    } else {
      // Handle text area dragging
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

    switch (this.resizeState.direction) {
      case 'se':
        newWidth = Math.max(50, this.resizeState.startWidth + deltaX);
        newHeight = Math.max(20, this.resizeState.startHeight + deltaY);
        break;
      case 'sw':
        newWidth = Math.max(50, this.resizeState.startWidth - deltaX);
        newHeight = Math.max(20, this.resizeState.startHeight + deltaY);
        newX = this.resizeState.startLeft + (this.resizeState.startWidth - newWidth) / 2;
        break;
      case 'ne':
        newWidth = Math.max(50, this.resizeState.startWidth + deltaX);
        newHeight = Math.max(20, this.resizeState.startHeight - deltaY);
        newY = this.resizeState.startTop + (this.resizeState.startHeight - newHeight) / 2;
        break;
      case 'nw':
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
    this.canUndo = true; // Placeholder
    this.canRedo = false; // Placeholder
  }

  resetToDefault(): void {
    if (this.selectedTemplate) {
      this.textAreas = [...this.selectedTemplate.textAreas];
      this.logoPosition = { x: 100, y: 100 };
      this.logoSize = { width: 120, height: 120 };
      this.isLogoVisible = true;
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
      if (this.selectedTextArea.id === 'logo') {
        this.toggleLogoVisibility();
      } else if (this.selectedTextArea.id.startsWith('custom_') || 
          this.customTexts.some(text => text.id === this.selectedTextArea!.id)) {
        this.removeCustomText(this.selectedTextArea.id);
      } else {
        this.toggleTextAreaVisibility(this.selectedTextArea.id);
      }
      event.preventDefault();
    }

    // Arrow keys for fine positioning
    if (this.selectedTextArea && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
      const step = event.shiftKey ? 10 : 1;
      
      if (this.selectedTextArea.id === 'logo') {
        let newX = this.logoPosition.x;
        let newY = this.logoPosition.y;

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

        // Apply constraints
        if (this.selectedTemplate) {
          newX = Math.max(this.logoSize.width / 2, Math.min(this.selectedTemplate.width - this.logoSize.width / 2, newX));
          newY = Math.max(this.logoSize.height / 2, Math.min(this.selectedTemplate.height - this.logoSize.height / 2, newY));
        }

        this.logoPosition.x = newX;
        this.logoPosition.y = newY;
      } else {
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
      }
      
      event.preventDefault();
    }
  }

  // Window resize handler
  @HostListener('window:resize', ['$event'])
  onWindowResize(event: any): void {
    this.calculateCanvasSize();
  }

  // Utility Methods
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Error handling
  private handleError(error: any, context: string): void {
    console.error(`Error in ${context}:`, error);
    // You can add more sophisticated error handling here
  }

  // Cleanup
  private cleanup(): void {
    document.removeEventListener('mousemove', this.onDrag.bind(this));
    document.removeEventListener('mouseup', this.stopDrag.bind(this));
    document.removeEventListener('mousemove', this.onResize.bind(this));
    document.removeEventListener('mouseup', this.stopResize.bind(this));
    document.removeEventListener('mousemove', this.onLogoResize.bind(this));
    document.removeEventListener('mouseup', this.stopLogoResize.bind(this));
  }
}