export const AppSettings = {
    templates: [
      {
        id: '1',
        name: 'قالب 1',
        imagePath: 'assets/templates/thumbs/2.jpg',
        thumbnail: 'assets/templates/thumbs/2.jpg',
        width: 800,
        height: 600,
        description: 'قالب 1',
        textAreas: [
          {
            id: 'title',
            label: 'عنوان الشهادة',
            x: 400, y: 120,
            width: 400, height: 50,
            fontSize: 28,
            fontFamily: 'Arial',
            color: '#1f2937',
            textAlign: 'center' as const,
            fontWeight: 'bold' as const,
            defaultText: 'شهادة تقدير', // تصحيح الإملاء من "صهادة" إلى "شهادة"
            isDraggable: true,
            isResizable: true
          },
          {
            id: 'name',
            label: 'اسم الطالب',
            x: 400, y: 220,
            width: 350, height: 50,
            fontSize: 32,
            fontFamily: 'Arial',
            color: '#3b82f6',
            textAlign: 'center' as const,
            fontWeight: 'bold' as const,
            defaultText: '[اسم الطالب]',
            isDraggable: true,
            isResizable: true
          },
          {
            id: 'content',
            label: 'نص الشهادة',
            x: 400, y: 320,
            width: 600, height: 120,
            fontSize: 18,
            fontFamily: 'Arial',
            color: '#374151',
            textAlign: 'center' as const,
            fontWeight: 'normal' as const,
            defaultText: 'نقدر لكم جهودكم المتميزة في التطوير والإبداع والعمل الدؤوب من أجل تحقيق النجاح والتميز',
            isDraggable: true,
            isResizable: true
          },
          {
            id: 'manager',
            label: 'اسم المدير/المسؤول',
            x: 200, y: 500,
            width: 200, height: 40,
            fontSize: 16,
            fontFamily: 'Arial',
            color: '#6b7280',
            textAlign: 'center' as const,
            fontWeight: 'normal' as const,
            defaultText: 'المدير العام',
            isDraggable: true,
            isResizable: true
          },
          {
            id: 'date',
            label: 'تاريخ الشهادة',
            x: 600, y: 500,
            width: 150, height: 40,
            fontSize: 14,
            fontFamily: 'Arial',
            color: '#6b7280',
            textAlign: 'center' as const,
            fontWeight: 'normal' as const,
            defaultText: '2024/12/17',
            isDraggable: true,
            isResizable: true
          },
          {
            id: 'logo',
            label: 'مكان الشعار',
            x: 100, y: 100,
            width: 80, height: 80,
            fontSize: 12,
            fontFamily: 'Arial',
            color: '#9ca3af',
            textAlign: 'center' as const,
            fontWeight: 'normal' as const,
            defaultText: 'الشعار',
            isDraggable: true,
            isResizable: true
          }
        ]
      },
      {
        id: '2',
        name: 'قالب 2',
        imagePath: 'assets/templates/thumbs/1.jpg',
        thumbnail: 'assets/templates/thumbs/1.jpg',
        width: 800,
        height: 600,
        description: 'قالب   2',
        textAreas: [
          {
            id: 'title',
            label: 'عنوان الشهادة',
            x: 400, y: 140,
            width: 350, height: 50,
            fontSize: 28,
            fontFamily: 'Arial',
            color: '#166534',
            textAlign: 'center' as const,
            fontWeight: 'bold' as const,
            defaultText: 'شهادة مشاركة', // تصحيح الإملاء
            isDraggable: true,
            isResizable: true
          },
          {
            id: 'name',
            label: 'اسم الطالب',
            x: 400, y: 240,
            width: 300, height: 45,
            fontSize: 24,
            fontFamily: 'Arial',
            color: '#dc2626',
            textAlign: 'center' as const,
            fontWeight: 'bold' as const,
            defaultText: '[اسم الطالب]',
            isDraggable: true,
            isResizable: true
          },
          {
            id: 'content',
            label: 'نص الشهادة',
            x: 400, y: 340,
            width: 500, height: 100,
            fontSize: 16,
            fontFamily: 'Arial',
            color: '#374151',
            textAlign: 'center' as const,
            fontWeight: 'normal' as const,
            defaultText: 'بمناسبة المشاركة الفعالة والمتميزة في الأنشطة والبرامج التطويرية',
            isDraggable: true,
            isResizable: true
          },
          {
            id: 'manager',
            label: 'اسم المدير',
            x: 200, y: 480,
            width: 180, height: 35,
            fontSize: 14,
            fontFamily: 'Arial',
            color: '#6b7280',
            textAlign: 'center' as const,
            fontWeight: 'normal' as const,
            defaultText: 'رئيس المؤسسة',
            isDraggable: true,
            isResizable: true
          },
          {
            id: 'date',
            label: 'التاريخ',
            x: 600, y: 480,
            width: 120, height: 35,
            fontSize: 12,
            fontFamily: 'Arial',
            color: '#6b7280',
            textAlign: 'center' as const,
            fontWeight: 'normal' as const,
            defaultText: '2024/12/17',
            isDraggable: true,
            isResizable: true
          }
        ]
      },
      {
        id: '3',
        name: 'قالب 3',
        imagePath: 'assets/templates/thumbs/3.jpg',
        thumbnail: 'assets/templates/thumbs/3.jpg',
        width: 800,
        height: 600,
        description: 'قالب 3',
        textAreas: [
          {
            id: 'title',
            label: 'عنوان الشهادة',
            x: 400, y: 140,
            width: 350, height: 50,
            fontSize: 28,
            fontFamily: 'Arial',
            color: '#166534',
            textAlign: 'center' as const,
            fontWeight: 'bold' as const,
            defaultText: 'شهادة مشاركة', // تصحيح الإملاء
            isDraggable: true,
            isResizable: true
          },
          {
            id: 'name',
            label: 'اسم الطالب',
            x: 400, y: 240,
            width: 300, height: 45,
            fontSize: 24,
            fontFamily: 'Arial',
            color: '#dc2626',
            textAlign: 'center' as const,
            fontWeight: 'bold' as const,
            defaultText: '[اسم الطالب]',
            isDraggable: true,
            isResizable: true
          },
          {
            id: 'content',
            label: 'نص الشهادة',
            x: 400, y: 340,
            width: 500, height: 100,
            fontSize: 16,
            fontFamily: 'Arial',
            color: '#374151',
            textAlign: 'center' as const,
            fontWeight: 'normal' as const,
            defaultText: 'بمناسبة المشاركة الفعالة والمتميزة في الأنشطة والبرامج التطويرية',
            isDraggable: true,
            isResizable: true
          },
          {
            id: 'manager',
            label: 'اسم المدير',
            x: 200, y: 480,
            width: 180, height: 35,
            fontSize: 14,
            fontFamily: 'Arial',
            color: '#6b7280',
            textAlign: 'center' as const,
            fontWeight: 'normal' as const,
            defaultText: 'رئيس المؤسسة',
            isDraggable: true,
            isResizable: true
          },
          {
            id: 'date',
            label: 'التاريخ',
            x: 600, y: 480,
            width: 120, height: 35,
            fontSize: 12,
            fontFamily: 'Arial',
            color: '#6b7280',
            textAlign: 'center' as const,
            fontWeight: 'normal' as const,
            defaultText: '2024/12/17',
            isDraggable: true,
            isResizable: true
          }
        ]
      }
    ],
    
    // باقي الإعدادات...
    fonts: [
      { name: 'Arial', value: 'Arial, sans-serif' },
      { name: 'Times New Roman', value: 'Times New Roman, serif' },
      { name: 'Helvetica', value: 'Helvetica, sans-serif' },
      { name: 'Georgia', value: 'Georgia, serif' },
      { name: 'Verdana', value: 'Verdana, sans-serif' },
      { name: 'Tahoma', value: 'Tahoma, sans-serif' },
      { name: 'Trebuchet MS', value: 'Trebuchet MS, sans-serif' },
      { name: 'Courier New', value: 'Courier New, monospace' }
    ],
  
    exportFormats: [
      { name: 'PNG', value: 'png', description: 'صورة عالية الجودة مع خلفية شفافة' },
      { name: 'JPG', value: 'jpg', description: 'صورة مضغوطة بحجم أصغر' },
      { name: 'PDF', value: 'pdf', description: 'ملف PDF جاهز للطباعة' }
    ],
  
    qualityOptions: [
      { name: 'عالية', value: 'high', scale: 3 },
      { name: 'متوسطة', value: 'medium', scale: 2 },
      { name: 'منخفضة', value: 'low', scale: 1 }
    ],
  
    defaultSettings: {
      maxFileSize: 10 * 1024 * 1024, // 10MB
      supportedImageTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
      supportedExcelTypes: [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
        'application/vnd.ms-excel', // .xls
        'text/csv' // .csv
      ],
      autoSaveInterval: 30000, // 30 seconds
      maxUndoSteps: 50
    },
  
    messages: {
      errors: {
        fileTooBig: 'حجم الملف كبير جداً. الحد الأقصى هو 10 ميجابايت',
        unsupportedFileType: 'نوع الملف غير مدعوم',
        noStudentsFound: 'لم يتم العثور على أي أسماء في الملف',
        templateNotFound: 'لم يتم العثور على القالب المحدد',
        exportFailed: 'فشل في تصدير الشهادات',
        networkError: 'خطأ في الاتصال بالشبكة'
      },
      success: {
        fileUploaded: 'تم رفع الملف بنجاح',
        projectSaved: 'تم حفظ المشروع بنجاح',
        certificatesGenerated: 'تم إنشاء الشهادات بنجاح',
        exportCompleted: 'تم تصدير الشهادات بنجاح'
      },
      info: {
        autoSaved: 'تم الحفظ التلقائي',
        welcomeBack: 'مرحباً بعودتك! تم استعادة مشروعك السابق',
        selectTemplate: 'يرجى اختيار قالب للبدء',
        addStudents: 'يرجى إضافة أسماء الطلاب'
      }
    }
  };