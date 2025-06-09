# منشئ الشهادات - Certificate Generator

تطبيق Angular 18 شامل لإنشاء وتخصيص الشهادات بطريقة سهلة ومرنة.

## 🌟 الميزات الرئيسية

- **اختيار القوالب**: مجموعة متنوعة من قوالب الشهادات القابلة للتخصيص
- **إدخال البيانات**: رفع ملفات Excel أو إدخال يدوي للأسماء
- **محرر متقدم**: سحب وإفلات النصوص مع تخصيص الخطوط والألوان
- **معاينة شاملة**: عرض جميع الشهادات قبل التصدير
- **تصدير متعدد التنسيقات**: PNG, JPG, PDF
- **واجهة عربية**: دعم كامل للغة العربية مع RTL

## 🚀 البدء السريع

### المتطلبات
- Node.js (الإصدار 18 أو أحدث)
- Angular CLI
- npm أو yarn

### التثبيت

1. **نسخ المشروع**
```bash
git clone <repository-url>
cd certificate-generator
```

2. **تثبيت المكتبات**
```bash
npm install
```

3. **إعداد Tailwind CSS**
```bash
# تم تكوينه مسبقاً في package.json
npm run build
```

4. **تشغيل التطبيق**
```bash
ng serve
```

5. **فتح المتصفح**
```
http://localhost:4200
```

## 📁 هيكل المشروع

```
src/
├── app/
│   ├── components/          # المكونات الرئيسية
│   │   ├── template-selector/
│   │   ├── data-input/
│   │   ├── certificate-editor/
│   │   ├── preview-panel/
│   │   └── export-panel/
│   ├── services/           # الخدمات
│   │   ├── certificate.service.ts
│   │   ├── template.service.ts
│   │   ├── excel.service.ts
│   │   └── export.service.ts
│   ├── models/             # النماذج
│   │   ├── student.model.ts
│   │   ├── template.model.ts
│   │   └── certificate.model.ts
│   └── app.config.ts       # إعدادات التطبيق
└── assets/
    ├── templates/          # صور القوالب
    ├── fonts/             # الخطوط (اختياري)
    └── icons/             # الأيقونات
```

## 🎨 إضافة قوالب جديدة

1. **إضافة صورة القالب**
```bash
# إضافة صورة القالب إلى
src/assets/templates/your-template.png

# إضافة صورة مصغرة (اختياري)
src/assets/templates/thumbs/your-template-thumb.png
```

2. **تحديث ملف الإعدادات**
```typescript
// في src/app/app.config.ts
export const AppConfig = {
  templates: [
    {
      id: 'unique-id',
      name: 'اسم القالب',
      imagePath: 'assets/templates/your-template.png',
      thumbnail: 'assets/templates/thumbs/your-template-thumb.png',
      width: 800,
      height: 600,
      description: 'وصف القالب',
      textAreas: [
        {
          id: 'name',
          label: 'اسم الطالب',
          x: 400, // موقع أفقي (من المنتصف)
          y: 250, // موقع عمودي (من المنتصف)
          width: 300,
          height: 60,
          fontSize: 36,
          fontFamily: 'Arial',
          color: '#000000',
          textAlign: 'center',
          fontWeight: 'bold',
          defaultText: '[اسم الطالب]',
          isDraggable: true,
          isResizable: true
        }
        // إضافة المزيد من مناطق النص حسب الحاجة
      ]
    }
  ]
};
```

## 📊 إعداد ملفات Excel

يجب أن يحتوي ملف Excel على:
- **العمود الأول**: أسماء الطلاب
- **أعمدة إضافية**: معلومات أخرى (اختياري)

### مثال على ملف Excel:
| اسم الطالب | التخصص | المعدل |
|------------|---------|--------|
| أحمد محمد | هندسة | 3.8 |
| فاطمة علي | طب | 3.9 |

## ⚙️ التخصيص المتقدم

### إضافة خطوط جديدة
```typescript
// في src/app/app.config.ts
fonts: [
  { name: 'خط مخصص', value: 'CustomFont, Arial, sans-serif' }
]
```

### تخصيص تنسيقات التصدير
```typescript
// في src/app/app.config.ts
exportFormats: [
  { name: 'WebP', value: 'webp', description: 'تنسيق حديث عالي الجودة' }
]
```

## 🛠️ البناء والنشر

### بناء للإنتاج
```bash
ng build --configuration production
```

### النشر على خادم
```bash
# نسخ مجلد dist إلى الخادم
cp -r dist/certificate-generator/* /var/www/html/
```

## 🐛 استكشاف الأخطاء

### مشاكل شائعة:

1. **ملفات القوالب لا تظهر**
   - تأكد من وجود الملفات في `src/assets/templates/`
   - تحقق من صحة المسارات في `app.config.ts`

2. **خطأ في قراءة Excel**
   - تأكد من أن الملف يحتوي على أسماء في العمود الأول
   - جرب حفظ الملف بتنسيق xlsx

3. **مشاكل في التصدير**
   - تأكد من أن المتصفح يدعم تحميل الملفات
   - جرب تقليل جودة التصدير

## 📝 الترخيص

هذا المشروع مفتوح المصدر ومتاح للاستخدام والتطوير.

## 🤝 المساهمة

نرحب بالمساهمات! يرجى:
1. عمل Fork للمشروع
2. إنشاء فرع جديد للميزة
3. تطبيق التغييرات
4. إرسال Pull Request

## 📧 الدعم

للحصول على الدعم أو الإبلاغ عن مشاكل، يرجى إنشاء Issue في المستودع.

---

**تم التطوير بـ ❤️ لخدمة المجتمع التعليمي**