import { Student } from './student.model';
import { Template, TextArea } from './template.model';

export interface Certificate {
  id: string;
  student: Student;
  template: Template;
  customText: string;
  textAreas: TextArea[];
  generatedAt: Date;
  settings: CertificateSettings;
}

export interface CertificateSettings {
  quality: 'low' | 'medium' | 'high';
  format: 'png' | 'jpg' | 'pdf';
  scale: number;
  backgroundColor: string;
}

export interface CertificateProject {
  id: string;
  name: string;
  template: Template;
  students: Student[];
  customText: string;
  textAreas: TextArea[];
  settings: CertificateSettings;
  createdAt: Date;
  updatedAt: Date;
}