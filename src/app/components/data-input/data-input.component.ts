import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { Student } from '../../models/student.model';
import { Template } from '../../models/template.model';
import { CertificateService } from '../../services/certificate.service';
import { ExcelService } from '../../services/excel.service';

interface UploadStatus {
  type: 'success' | 'error' | 'info';
  message: string;
}

interface UploadedImage {
  name: string;
  url: string;
  file: File;
}

@Component({
  selector: 'app-data-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './data-input.component.html',
  styleUrls: ['./data-input.component.css']
})
export class DataInputComponent implements OnInit, OnDestroy {
  selectedTemplate: Template | null = null;
  students: Student[] = [];
  customText: string = '';
  managerName: string = '';
  newStudentName: string = '';
  showManualInput: boolean = false;
  uploadStatus: UploadStatus | null = null;
  uploadedImages: UploadedImage[] = [];
  isLoading: boolean = false;
  loadingMessage: string = '';

  // إضافة متغيرات جديدة للشعار
  institutionLogo: string | null = null; // base64 للشعار
  logoFileName: string = '';
  showImageMatching: boolean = false;

  private destroy$ = new Subject<void>();

  constructor(
    private certificateService: CertificateService,
    private excelService: ExcelService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadData(): void {
    this.certificateService.selectedTemplate$
      .pipe(takeUntil(this.destroy$))
      .subscribe(template => {
        this.selectedTemplate = template;
      });

    this.certificateService.students$
      .pipe(takeUntil(this.destroy$))
      .subscribe(students => {
        this.students = students;
      });

    this.certificateService.customText$
      .pipe(takeUntil(this.destroy$))
      .subscribe(text => {
        this.customText = text;
      });

    // إضافة subscriptions جديدة
    this.certificateService.institutionLogo$
      .pipe(takeUntil(this.destroy$))
      .subscribe(logo => {
        this.institutionLogo = logo;
      });

    this.certificateService.managerName$
      .pipe(takeUntil(this.destroy$))
      .subscribe(name => {
        this.managerName = name;
      });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.processExcelFile(file);
    }
  }

  private async processExcelFile(file: File): Promise<void> {
    const validation = this.excelService.validateExcelFile(file);
    if (!validation.isValid) {
      this.setUploadStatus('error', validation.error!);
      return;
    }

    this.isLoading = true;
    this.loadingMessage = 'جاري قراءة الملف...';

    try {
      let students: Student[];
      
      if (file.type === 'text/csv') {
        students = await this.excelService.readCSVFile(file);
      } else {
        students = await this.excelService.readExcelFile(file);
      }

      this.certificateService.setStudents(students);
      this.setUploadStatus('success', `تم تحميل ${students.length} طالب بنجاح`);
    } catch (error) {
      console.error('Error processing file:', error);
      this.setUploadStatus('error', error instanceof Error ? error.message : 'فشل في قراءة الملف');
    } finally {
      this.isLoading = false;
    }
  }

  addStudent(): void {
    if (!this.newStudentName.trim()) return;

    const student: Student = {
      id: this.generateId(),
      name: this.newStudentName.trim()
    };

    this.certificateService.addStudent(student);
    this.newStudentName = '';
    this.showManualInput = false;
  }

  removeStudent(studentId: string): void {
    this.certificateService.removeStudent(studentId);
  }

  onLogoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      
      if (!file.type.startsWith('image/')) {
        this.setUploadStatus('error', 'يرجى اختيار ملف صورة');
        return;
      }

      if (file.size > 5 * 1024 * 1024) { // 5MB max
        this.setUploadStatus('error', 'حجم الشعار كبير جداً. الحد الأقصى 5 ميجابايت');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        this.institutionLogo = e.target?.result as string;
        this.logoFileName = file.name;
        this.certificateService.setInstitutionLogo(this.institutionLogo);
        this.setUploadStatus('success', 'تم تحميل الشعار بنجاح');
      };
      reader.readAsDataURL(file);
    }
  }

  removeLogo(): void {
    this.institutionLogo = null;
    this.logoFileName = '';
    this.certificateService.setInstitutionLogo(null);
  }

  onImagesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.processImageFiles(Array.from(input.files));
    }
  }

  private processImageFiles(files: File[]): void {
    this.isLoading = true;
    this.loadingMessage = 'جاري تحميل الصور...';

    const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const newImages: UploadedImage[] = [];

    files.forEach(file => {
      if (!validImageTypes.includes(file.type)) {
        console.warn(`File ${file.name} is not a valid image type`);
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        console.warn(`File ${file.name} is too large`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        newImages.push({
          name: file.name,
          url: imageUrl,
          file: file
        });

        if (newImages.length === files.filter(f => 
          validImageTypes.includes(f.type) && f.size <= 5 * 1024 * 1024
        ).length) {
          this.uploadedImages = [...this.uploadedImages, ...newImages];
          this.matchImagesToStudents();
          this.isLoading = false;
          this.setUploadStatus('success', `تم تحميل ${newImages.length} صورة`);
        }
      };
      reader.readAsDataURL(file);
    });
  }

  private matchImagesToStudents(): void {
    this.students.forEach(student => {
      const matchingImage = this.findBestImageMatch(student.name, this.uploadedImages);
      if (matchingImage) {
        student.image = matchingImage.url;
      }
    });

    this.certificateService.setStudents([...this.students]);
  }

  private findBestImageMatch(studentName: string, images: UploadedImage[]): UploadedImage | null {
    const normalizedStudentName = this.normalizeArabicText(studentName);
    
    // البحث عن أفضل مطابقة
    let bestMatch: UploadedImage | null = null;
    let bestScore = 0;

    images.forEach(image => {
      const normalizedFileName = this.normalizeArabicText(image.name.replace(/\.[^/.]+$/, ''));
      const score = this.calculateSimilarity(normalizedStudentName, normalizedFileName);
      
      if (score > bestScore && score > 0.3) { // عتبة أدنى للتشابه
        bestScore = score;
        bestMatch = image;
      }
    });

    return bestMatch;
  }

  private normalizeArabicText(text: string): string {
    return text
      .toLowerCase()
      .replace(/أ|إ|آ/g, 'ا')
      .replace(/ة/g, 'ه')
      .replace(/ي/g, 'ى')
      .replace(/\s+/g, '')
      .replace(/[^\u0600-\u06FF\u0750-\u077Fa-zA-Z]/g, '');
  }

  private calculateSimilarity(str1: string, str2: string): number {
    if (str1 === str2) return 1;
    if (str1.length === 0 || str2.length === 0) return 0;

    // البحث عن الكلمات المشتركة
    const words1 = str1.split(' ').filter(w => w.length > 1);
    const words2 = str2.split(' ').filter(w => w.length > 1);
    
    if (words1.length === 0 || words2.length === 0) {
      // إذا لم توجد كلمات، تحقق من التضمين
      return str1.includes(str2) || str2.includes(str1) ? 0.5 : 0;
    }

    let matchCount = 0;
    words1.forEach(word1 => {
      if (words2.some(word2 => word1.includes(word2) || word2.includes(word1))) {
        matchCount++;
      }
    });

    return matchCount / Math.max(words1.length, words2.length);
  }

  removeImage(imageName: string): void {
    this.uploadedImages = this.uploadedImages.filter(img => img.name !== imageName);
    
    // إزالة الصورة من الطلاب المرتبطين بها
    this.students.forEach(student => {
      if (student.image) {
        const matchingImage = this.uploadedImages.find(img => img.url === student.image);
        if (!matchingImage) {
          delete student.image;
        }
      }
    });

    this.certificateService.setStudents([...this.students]);
  }

  // دوال مساعدة للواجهة
  isImageMatched(imageName: string): boolean {
    const imageUrl = this.uploadedImages.find(img => img.name === imageName)?.url;
    return this.students.some(student => student.image === imageUrl);
  }

  getMatchedImagesCount(): number {
    return this.students.filter(student => student.image).length;
  }

  downloadSample(): void {
    try {
      this.excelService.createSampleExcelFile().then(blob => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'sample_students.xlsx';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      });
    } catch (error) {
      console.error('Error creating sample file:', error);
      this.setUploadStatus('error', 'فشل في إنشاء الملف النموذجي');
    }
  }

  goBack(): void {
    this.saveCurrentData();
    this.certificateService.previousStep();
  }

  continueToNext(): void {
    if (this.students.length === 0 || !this.customText.trim()) {
      this.setUploadStatus('error', 'يرجى إضافة الطلاب والنص الرئيسي للشهادة');
      return;
    }

    this.saveCurrentData();
    this.certificateService.nextStep();
  }

  private saveCurrentData(): void {
    this.certificateService.setStudents(this.students);
    this.certificateService.setCustomText(this.customText);
    this.certificateService.setManagerName(this.managerName);
    
    if (this.institutionLogo) {
      this.certificateService.setInstitutionLogo(this.institutionLogo);
    }
  }

  private setUploadStatus(type: UploadStatus['type'], message: string): void {
    this.uploadStatus = { type, message };
    
    setTimeout(() => {
      this.uploadStatus = null;
    }, 5000);
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}