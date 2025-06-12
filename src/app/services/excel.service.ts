import { Injectable } from '@angular/core';
import * as ExcelJS from 'exceljs';
import { Student } from '../models/student.model';

@Injectable({
  providedIn: 'root'
})
export class ExcelService {
  
  constructor() {}

  // Read Excel file and convert to students array
  async readExcelFile(file: File): Promise<Student[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          const arrayBuffer = e.target?.result as ArrayBuffer;
          const workbook = new ExcelJS.Workbook();
          
          // قراءة الملف
          await workbook.xlsx.load(arrayBuffer);
          
          // الحصول على الورقة الأولى
          const worksheet = workbook.getWorksheet(1);
          if (!worksheet) {
            throw new Error('لا توجد ورقة عمل في الملف');
          }

          const students = this.processWorksheet(worksheet);
          resolve(students);
        } catch (error) {
          reject(new Error('فشل في قراءة ملف Excel: ' + error));
        }
      };
      
      reader.onerror = () => reject(new Error('فشل في قراءة الملف'));
      reader.readAsArrayBuffer(file);
    });
  }

  // Process worksheet data into Student objects
  private processWorksheet(worksheet: ExcelJS.Worksheet): Student[] {
    const students: Student[] = [];
    let headers: string[] = [];
    let headerRowIndex = -1;

    // العثور على صف الرؤوس
    worksheet.eachRow((row, rowNumber) => {
      if (headerRowIndex === -1 && row.hasValues) {
        const values = row.values as any[];
        if (values && values.length > 1) {
          headers = values.slice(1).map(v => String(v || '').trim()).filter(h => h);
          if (headers.length > 0) {
            headerRowIndex = rowNumber;
          }
        }
      }
    });

    if (headerRowIndex === -1 || headers.length === 0) {
      throw new Error('لم يتم العثور على رؤوس الأعمدة');
    }

    // معالجة صفوف البيانات
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > headerRowIndex && row.hasValues) {
        const values = row.values as any[];
        if (!values || values.length <= 1) return;

        const student: Student = {
          id: this.generateId(),
          name: '',
          additionalInfo: {}
        };

        // معالجة البيانات في كل عمود
        for (let i = 0; i < headers.length && i + 1 < values.length; i++) {
          const header = headers[i].toLowerCase();
          const value = values[i + 1];
          
          if (!value) continue;

          const cellValue = this.getCellValue(value);
          if (!cellValue) continue;

          // تحديد عمود الاسم
          if (this.isNameColumn(header)) {
            student.name = cellValue;
          } else {
            // معلومات إضافية
            student.additionalInfo![headers[i]] = cellValue;
          }
        }

        // إضافة الطالب فقط إذا كان له اسم
        if (student.name.trim()) {
          students.push(student);
        } else {
          console.warn(`تم تجاهل الصف ${rowNumber}: لا يحتوي على اسم`);
        }
      }
    });

    if (students.length === 0) {
      throw new Error('لم يتم العثور على أي أسماء صحيحة في الملف');
    }

    return students;
  }

  // Extract cell value handling different types
  private getCellValue(cellValue: any): string {
    if (cellValue === null || cellValue === undefined) {
      return '';
    }

    // إذا كان الخلية تحتوي على نص غني (rich text)
    if (typeof cellValue === 'object' && cellValue.richText) {
      return cellValue.richText.map((rt: any) => rt.text).join('');
    }

    // إذا كان الخلية تحتوي على formula
    if (typeof cellValue === 'object' && cellValue.result) {
      return String(cellValue.result).trim();
    }

    // إذا كان الخلية تحتوي على hyperlink
    if (typeof cellValue === 'object' && cellValue.hyperlink) {
      return cellValue.text || cellValue.hyperlink || '';
    }

    // القيم العادية
    return String(cellValue).trim();
  }

  // Identify if a column header represents a name
  private isNameColumn(header: string): boolean {
    const nameIndicators = [
      'name', 'اسم', 'الاسم', 'اسم الطالب', 'student name', 'الطالب',
      'first name', 'last name', 'full name', 'student', 'طالب',
      'اسم كامل', 'الاسم الكامل', 'اسم الطلاب'
    ];
    
    return nameIndicators.some(indicator => 
      header.includes(indicator.toLowerCase())
    );
  }

  // Validate Excel file
  validateExcelFile(file: File): { isValid: boolean; error?: string } {
    // فحص حجم الملف (الحد الأقصى 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return { isValid: false, error: 'حجم الملف كبير جداً (الحد الأقصى 10 ميجا)' };
    }

    // فحص نوع الملف
    const validTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.ms-excel', // .xls
      'text/csv' // .csv
    ];

    if (!validTypes.includes(file.type)) {
      return { isValid: false, error: 'نوع الملف غير مدعوم. يرجى استخدام Excel أو CSV' };
    }

    return { isValid: true };
  }

  // Read CSV file (ExcelJS يدعم CSV أيضاً)
  async readCSVFile(file: File): Promise<Student[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          const csvText = e.target?.result as string;
          const students = this.parseCSVManually(csvText);
          resolve(students);
        } catch (error) {
          reject(new Error('فشل في قراءة ملف CSV: ' + error));
        }
      };
      
      reader.onerror = () => reject(new Error('فشل في قراءة الملف'));
      reader.readAsText(file, 'UTF-8');
    });
  }

  // Manual CSV parsing fallback
  private parseCSVManually(csvText: string): Student[] {
    const lines = csvText.split('\n').filter(line => line.trim());
    
    if (lines.length === 0) {
      throw new Error('الملف فارغ');
    }

    const students: Student[] = [];
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
      
      if (values.length === 0 || !values[0]) continue;

      const student: Student = {
        id: this.generateId(),
        name: '',
        additionalInfo: {}
      };

      for (let j = 0; j < headers.length && j < values.length; j++) {
        const header = headers[j].toLowerCase();
        const value = values[j];

        if (!value) continue;

        if (this.isNameColumn(header)) {
          student.name = value;
        } else {
          student.additionalInfo![headers[j]] = value;
        }
      }

      if (student.name) {
        students.push(student);
      }
    }

    return students;
  }

  // Create sample Excel file for download
  async createSampleExcelFile(): Promise<Blob> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Students');

    // إضافة الرؤوس
    worksheet.addRow(['اسم الطالب', 'التخصص', 'المعدل', 'تاريخ التخرج']);
    
    // إضافة بيانات تجريبية
    const sampleData = [
      ['أحمد محمد علي', 'هندسة البرمجيات', '3.8', '2024-06-15'],
      ['فاطمة عبدالله', 'إدارة الأعمال', '3.9', '2024-06-15'],
      ['خالد سعد', 'الطب', '3.7', '2024-06-15'],
      ['نورا أحمد', 'الصيدلة', '3.85', '2024-06-15']
    ];

    sampleData.forEach(row => {
      worksheet.addRow(row);
    });

    // تنسيق الرؤوس
    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' }
    };

    // تعديل عرض الأعمدة
    worksheet.columns.forEach(column => {
      column.width = 15;
    });

    // تحويل إلى buffer ثم blob
    const buffer = await workbook.xlsx.writeBuffer();
    return new Blob([buffer], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
  }

  // Export students to Excel
  async exportToExcel(students: Student[], filename: string = 'students.xlsx'): Promise<void> {
    if (!students || students.length === 0) {
      throw new Error('لا توجد بيانات للتصدير');
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Students');

    // تحضير الرؤوس
    const headers = ['اسم الطالب'];
    const additionalFields = new Set<string>();

    // جمع جميع الحقول الإضافية
    students.forEach(student => {
      if (student.additionalInfo) {
        Object.keys(student.additionalInfo).forEach(key => additionalFields.add(key));
      }
    });

    headers.push(...Array.from(additionalFields));

    // إضافة الرؤوس
    worksheet.addRow(headers);

    // إضافة البيانات
    students.forEach(student => {
      const row = [student.name];
      additionalFields.forEach(field => {
        row.push(student.additionalInfo?.[field] || '');
      });
      worksheet.addRow(row);
    });

    // تنسيق الرؤوس
    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' }
    };

    // تعديل عرض الأعمدة
    worksheet.columns.forEach(column => {
      column.width = 15;
    });

    // تحميل الملف
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  // Helper method to generate ID
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}