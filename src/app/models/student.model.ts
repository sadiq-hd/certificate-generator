export interface Student {
    id: string;
    name: string;
    image?: string; // base64 encoded image or file path
    additionalInfo?: { [key: string]: any };
  }
  
  export interface StudentData {
    students: Student[];
    managerName?: string;
    institutionLogo?: string;
    additionalFields?: { [key: string]: any };
  }