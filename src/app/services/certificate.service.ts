import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Certificate, CertificateProject, CertificateSettings } from '../models/certificate.model';
import { Student } from '../models/student.model';
import { Template, TextArea } from '../models/template.model';

@Injectable({
  providedIn: 'root'
})
export class CertificateService {
  private currentProjectSubject = new BehaviorSubject<CertificateProject | null>(null);
  private currentStepSubject = new BehaviorSubject<number>(1);
  private studentsSubject = new BehaviorSubject<Student[]>([]);
  private selectedTemplateSubject = new BehaviorSubject<Template | null>(null);
  private customTextSubject = new BehaviorSubject<string>('');
  private generatedCertificatesSubject = new BehaviorSubject<Certificate[]>([]);
  private institutionLogoSubject = new BehaviorSubject<string | null>(null);
  private managerNameSubject = new BehaviorSubject<string>('');

  public currentProject$ = this.currentProjectSubject.asObservable();
  public currentStep$ = this.currentStepSubject.asObservable();
  public students$ = this.studentsSubject.asObservable();
  public selectedTemplate$ = this.selectedTemplateSubject.asObservable();
  public customText$ = this.customTextSubject.asObservable();
  public generatedCertificates$ = this.generatedCertificatesSubject.asObservable();
  public institutionLogo$ = this.institutionLogoSubject.asObservable();
  public managerName$ = this.managerNameSubject.asObservable();

  private undoStack: any[] = [];
  private redoStack: any[] = [];

  constructor() {
    this.loadFromLocalStorage();
  }

  // Navigation methods
  setCurrentStep(step: number): void {
    this.currentStepSubject.next(step);
    this.saveToLocalStorage();
  }

  getCurrentStep(): number {
    return this.currentStepSubject.value;
  }

  nextStep(): void {
    const currentStep = this.getCurrentStep();
    if (currentStep < 5) {
      this.setCurrentStep(currentStep + 1);
    }
  }

  previousStep(): void {
    const currentStep = this.getCurrentStep();
    if (currentStep > 1) {
      this.setCurrentStep(currentStep - 1);
    }
  }

  // Template methods
  setSelectedTemplate(template: Template): void {
    this.selectedTemplateSubject.next({ ...template });
    this.saveToLocalStorage();
  }

  getSelectedTemplate(): Template | null {
    return this.selectedTemplateSubject.value;
  }

  // Students methods
  setStudents(students: Student[]): void {
    this.studentsSubject.next([...students]);
    this.saveToLocalStorage();
  }

  getStudents(): Student[] {
    return this.studentsSubject.value;
  }

  addStudent(student: Student): void {
    const currentStudents = this.getStudents();
    this.setStudents([...currentStudents, student]);
  }

  removeStudent(studentId: string): void {
    const currentStudents = this.getStudents();
    this.setStudents(currentStudents.filter(s => s.id !== studentId));
  }

  // Custom text methods
  setCustomText(text: string): void {
    this.customTextSubject.next(text);
    this.saveToLocalStorage();
  }

  getCustomText(): string {
    return this.customTextSubject.value;
  }

  // Certificate generation
  generateCertificates(): Certificate[] {
    const template = this.getSelectedTemplate();
    const students = this.getStudents();
    const customText = this.getCustomText();

    if (!template || students.length === 0) {
      return [];
    }

    const certificates: Certificate[] = students.map(student => ({
      id: this.generateId(),
      student,
      template,
      customText,
      textAreas: [...template.textAreas],
      generatedAt: new Date(),
      settings: this.getDefaultSettings()
    }));

    this.generatedCertificatesSubject.next(certificates);
    this.saveToLocalStorage();
    return certificates;
  }

  getGeneratedCertificates(): Certificate[] {
    return this.generatedCertificatesSubject.value;
  }

  setInstitutionLogo(logo: string | null): void {
    this.institutionLogoSubject.next(logo);
    this.saveToLocalStorage();
  }

  getInstitutionLogo(): string | null {
    return this.institutionLogoSubject.value;
  }

  // إضافة دوال إدارة اسم المدير
  setManagerName(name: string): void {
    this.managerNameSubject.next(name);
    this.saveToLocalStorage();
  }

  getManagerName(): string {
    return this.managerNameSubject.value;
  }

  // Text area management
  updateTextArea(areaId: string, updates: Partial<TextArea>): void {
    this.saveState(); // للتراجع
    
    const template = this.getSelectedTemplate();
    if (template) {
      const textAreas = template.textAreas.map(area => 
        area.id === areaId ? { ...area, ...updates } : area
      );
      
      const updatedTemplate = { ...template, textAreas };
      this.setSelectedTemplate(updatedTemplate);
    }
  }

  // Undo/Redo functionality
  private saveState(): void {
    const state = {
      template: this.getSelectedTemplate(),
      students: this.getStudents(),
      customText: this.getCustomText(),
      step: this.getCurrentStep()
    };
    
    this.undoStack.push(JSON.stringify(state));
    this.redoStack = []; // Clear redo stack
    
    // Limit undo stack size
    if (this.undoStack.length > 50) {
      this.undoStack.shift();
    }
  }

  undo(): boolean {
    if (this.undoStack.length === 0) return false;
    
    const currentState = {
      template: this.getSelectedTemplate(),
      students: this.getStudents(),
      customText: this.getCustomText(),
      step: this.getCurrentStep()
    };
    
    this.redoStack.push(JSON.stringify(currentState));
    const previousState = JSON.parse(this.undoStack.pop()!);
    
    this.restoreState(previousState);
    return true;
  }

  redo(): boolean {
    if (this.redoStack.length === 0) return false;
    
    const currentState = {
      template: this.getSelectedTemplate(),
      students: this.getStudents(),
      customText: this.getCustomText(),
      step: this.getCurrentStep()
    };
    
    this.undoStack.push(JSON.stringify(currentState));
    const nextState = JSON.parse(this.redoStack.pop()!);
    
    this.restoreState(nextState);
    return true;
  }

  private restoreState(state: any): void {
    if (state.template) this.selectedTemplateSubject.next(state.template);
    if (state.students) this.studentsSubject.next(state.students);
    if (state.customText) this.customTextSubject.next(state.customText);
    if (state.step) this.currentStepSubject.next(state.step);
  }

  // Project management
  createNewProject(name: string): CertificateProject {
    const project: CertificateProject = {
      id: this.generateId(),
      name,
      template: this.getSelectedTemplate()!,
      students: this.getStudents(),
      customText: this.getCustomText(),
      textAreas: this.getSelectedTemplate()?.textAreas || [],
      settings: this.getDefaultSettings(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.currentProjectSubject.next(project);
    this.saveToLocalStorage();
    return project;
  }

  saveCurrentProject(): void {
    const currentProject = this.currentProjectSubject.value;
    if (currentProject) {
      const updatedProject: CertificateProject = {
        ...currentProject,
        template: this.getSelectedTemplate()!,
        students: this.getStudents(),
        customText: this.getCustomText(),
        updatedAt: new Date()
      };
      
      this.currentProjectSubject.next(updatedProject);
      this.saveToLocalStorage();
    }
  }

  loadProject(project: CertificateProject): void {
    this.currentProjectSubject.next(project);
    this.setSelectedTemplate(project.template);
    this.setStudents(project.students);
    this.setCustomText(project.customText);
    this.setCurrentStep(1);
  }

  // Reset methods
  resetAll(): void {
    this.selectedTemplateSubject.next(null);
    this.studentsSubject.next([]);
    this.customTextSubject.next('');
    this.generatedCertificatesSubject.next([]);
    this.currentProjectSubject.next(null);
    this.institutionLogoSubject.next(null);
    this.managerNameSubject.next('');
    this.setCurrentStep(1);
    this.clearLocalStorage();
  }

  // Helper methods
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Fixed cleanData method with proper seen Set
  private cleanData(obj: any): any {
    const seen = new Set(); // إضافة المتغير المفقود
    return JSON.parse(JSON.stringify(obj, (key, value) => {
      // تجنب المراجع الدائرية
      if (typeof value === 'object' && value !== null) {
        if (seen.has(value)) {
          return {};
        }
        seen.add(value);
      }
      return value;
    }));
  }

  private getDefaultSettings(): CertificateSettings {
    return {
      quality: 'high',
      format: 'png',
      scale: 2,
      backgroundColor: '#ffffff'
    };
  }

  // Local Storage with better error handling and size limits
  private saveToLocalStorage(): void {
    try {
      const data = {
        currentStep: this.getCurrentStep(),
        selectedTemplate: this.getSelectedTemplate(),
        students: this.getStudents(),
        customText: this.getCustomText(),
        generatedCertificates: this.getGeneratedCertificates(),
        currentProject: this.currentProjectSubject.value,
        institutionLogo: this.getInstitutionLogo(),
        managerName: this.getManagerName()
      };
      
      // تنظيف البيانات لتجنب المراجع الدائرية
      const cleanedData = this.cleanData(data);
      const dataString = JSON.stringify(cleanedData);
      
      // فحص حجم البيانات (5MB حد أقصى)
      if (dataString.length > 5242880) { // 5MB in bytes
        console.warn('Data too large for localStorage, skipping save');
        // يمكن حفظ البيانات الأساسية فقط
        const essentialData = {
          currentStep: this.getCurrentStep(),
          selectedTemplate: this.getSelectedTemplate(),
          students: this.getStudents().slice(0, 50), // حد أقصى 50 طالب
          customText: this.getCustomText(),
          institutionLogo: this.getInstitutionLogo(),
          managerName: this.getManagerName()
        };
        localStorage.setItem('certificateApp', JSON.stringify(essentialData));
        return;
      }
      
      localStorage.setItem('certificateApp', dataString);
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      // في حالة الخطأ، حاول حفظ البيانات الأساسية فقط
      try {
        const minimumData = {
          currentStep: this.getCurrentStep(),
          selectedTemplate: this.getSelectedTemplate(),
          students: this.getStudents().slice(0, 10),
          customText: this.getCustomText().substring(0, 1000)
        };
        localStorage.setItem('certificateApp', JSON.stringify(minimumData));
      } catch (fallbackError) {
        console.error('Failed to save even minimum data:', fallbackError);
        // امسح البيانات القديمة التي قد تكون تالفة
        localStorage.removeItem('certificateApp');
      }
    }
  }

  private loadFromLocalStorage(): void {
    const savedData = localStorage.getItem('certificateApp');
    if (savedData) {
      try {
        const data = JSON.parse(savedData);
        
        if (data.selectedTemplate) this.selectedTemplateSubject.next(data.selectedTemplate);
        if (data.students && Array.isArray(data.students)) this.studentsSubject.next(data.students);
        if (data.customText) this.customTextSubject.next(data.customText);
        if (data.generatedCertificates && Array.isArray(data.generatedCertificates)) {
          this.generatedCertificatesSubject.next(data.generatedCertificates);
        }
        if (data.currentProject) this.currentProjectSubject.next(data.currentProject);
        if (data.currentStep && typeof data.currentStep === 'number') {
          this.currentStepSubject.next(data.currentStep);
        }
        if (data.institutionLogo) this.institutionLogoSubject.next(data.institutionLogo);
        if (data.managerName) this.managerNameSubject.next(data.managerName);
      } catch (error) {
        console.error('Error loading from localStorage:', error);
        // في حالة تلف البيانات، امسحها
        localStorage.removeItem('certificateApp');
      }
    }
  }

  private clearLocalStorage(): void {
    localStorage.removeItem('certificateApp');
  }

  // إضافة دالة للتحقق من صحة البيانات
  public validateData(): boolean {
    const template = this.getSelectedTemplate();
    const students = this.getStudents();
    
    if (!template) {
      console.warn('No template selected');
      return false;
    }
    
    if (!Array.isArray(students)) {
      console.warn('Students data is not an array');
      return false;
    }
    
    return true;
  }

  // إضافة دالة لمسح البيانات التالفة
  public clearCorruptedData(): void {
    console.log('Clearing potentially corrupted data...');
    this.clearLocalStorage();
    this.resetAll();
  }
}