export const AppSettings = {
    templates: [
      {
        id: '1',
        name: 'قالب كلاسيكي أزرق',
        imagePath: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iYmciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojZGJlYWZlO3N0b3Atb3BhY2l0eToxIiAvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiNmM2Y0ZjY7c3RvcC1vcGFjaXR5OjEiIC8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogIDwvZGVmcz4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2JnKSIgLz4KICA8cmVjdCB4PSI1MCIgeT0iNTAiIHdpZHRoPSI3MDAiIGhlaWdodD0iNTAwIiBmaWxsPSJub25lIiBzdHJva2U9IiMzYjgyZjYiIHN0cm9rZS13aWR0aD0iMyIgcng9IjEwIiAvPgogIDxyZWN0IHg9IjgwIiB5PSI4MCIgd2lkdGg9IjY0MCIgaGVpZ2h0PSI0NDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzM3NDE1MSIgc3Ryb2tlLXdpZHRoPSIxIiByeD0iNSIgLz4KICA8dGV4dCB4PSI0MDAiIHk9IjEwMCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjI0IiBmaWxsPSIjMzc0MTUxIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj7YtdmH2KfYr9ipINiq2YLYr9mK2LE8L3RleHQ+CiAgPGNpcmNsZSBjeD0iMTAwIiBjeT0iMTUwIiByPSIyMCIgZmlsbD0iIzM0OTY1ZSIgLz4KICA8Y2lyY2xlIGN4PSI3MDAiIGN5PSIxNTAiIHI9IjIwIiBmaWxsPSIjMzQ5NjVlIiAvPgo8L3N2Zz4=',
        thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGJlYWZlIiAvPgogIDxyZWN0IHg9IjEwIiB5PSIxMCIgd2lkdGg9IjE4MCIgaGVpZ2h0PSIxMzAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzM3NDE1MSIgc3Ryb2tlLXdpZHRoPSIyIiAvPgogIDx0ZXh0IHg9IjEwMCIgeT0iNDAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzM3NDE1MSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+2LTZh9in2K/YqTwvdGV4dD4KICA8dGV4dCB4PSIxMDAiIHk9IjgwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiMzYjgyZjYiIHRleHQtYW5jaG9yPSJtaWRkbGUiPtin2LPZhSDYp9mE2LfYp9mE2KjYqTwvdGV4dD4KICA8dGV4dCB4PSIxMDAiIHk9IjEyMCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEwIiBmaWxsPSIjNmI3MjgwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj7ZhtizINin2YTYtNmH2KfYr9ipPC90ZXh0Pgo8L3N2Zz4=',
        width: 800,
        height: 600,
        description: 'قالب أنيق باللون الأزرق',
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
            defaultText: 'شهادة تقدير',
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
            width: 600, height: 120,  // زيادة الارتفاع للنص المتعدد الأسطر
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
        name: 'قالب أخضر طبيعي',
        imagePath: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ3JlZW5CZyIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiNmMGZkZjQ7c3RvcC1vcGFjaXR5OjEiIC8+CiAgICAgIDxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6I2VjZmRmNTtzdG9wLW9wYWNpdHk6MSIgLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgPC9kZWZzPgogIDxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JlZW5CZykiIC8+CiAgPHJlY3QgeD0iNjAiIHk9IjYwIiB3aWR0aD0iNjgwIiBoZWlnaHQ9IjQ4MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMTY2NTM0IiBzdHJva2Utd2lkdGg9IjQiIHJ4PSIxNSIgLz4KICA8Y2lyY2xlIGN4PSIxNTAiIGN5PSIxNTAiIHI9IjMwIiBmaWxsPSIjMzQ5NjVlIiBvcGFjaXR5PSIwLjMiIC8+CiAgPGNpcmNsZSBjeD0iNjUwIiBjeT0iMTUwIiByPSIzMCIgZmlsbD0iIzM0OTY1ZSIgb3BhY2l0eT0iMC4zIiAvPgogIDxjaXJjbGUgY3g9IjE1MCIgY3k9IjQ1MCIgcj0iMzAiIGZpbGw9IiMzNDk2NWUiIG9wYWNpdHk9IjAuMyIgLz4KICA8Y2lyY2xlIGN4PSI2NTAiIGN5PSI0NTAiIHI9IjMwIiBmaWxsPSIjMzQ5NjVlIiBvcGFjaXR5PSIwLjMiIC8+Cjwvc3ZnPg==',
        thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmZGY0IiAvPgogIDxyZWN0IHg9IjE1IiB5PSIxNSIgd2lkdGg9IjE3MCIgaGVpZ2h0PSIxMjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzE2NjUzNCIgc3Ryb2tlLXdpZHRoPSIyIiAvPgogIDx0ZXh0IHg9IjEwMCIgeT0iNDAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzE2NjUzNCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+2LTZh9in2K/YqSBUcGI8L3RleHQ+CiAgPHRleHQgeD0iMTAwIiB5PSI4MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIiBmaWxsPSIjMzQ5NjVlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj7Yp9iz2YUg2KfZhNi32KfZhNioPC90ZXh0PgogIDx0ZXh0IHg9IjEwMCIgeT0iMTIwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTAiIGZpbGw9IiM2Yjcy4PIiIHRleHQtYW5jaG9yPSJtaWRkbGUiPtmG2LUg2KfZhNi02YfYp9iv2KlmL3RleHQ+Cjwvc3ZnPg==',
        width: 800,
        height: 600,
        description: 'قالب طبيعي باللون الأخضر',
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
            defaultText: 'شهادة مشاركة',
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