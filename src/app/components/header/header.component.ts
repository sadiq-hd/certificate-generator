import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Step {
  id: number;
  name: string;
  description: string;
  tips?: string[];
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  @Input() showSaveButton: boolean = false;
  @Input() isSaving: boolean = false;
  
  @Output() saveClicked = new EventEmitter<void>();
  @Output() helpClicked = new EventEmitter<void>();

  showHelpModal: boolean = false;

  // Steps data - نفس البيانات من الملف الأصلي
  steps: Step[] = [
    {
      id: 1,
      name: 'اختيار القالب',
      description: 'اختر تصميم الشهادة المناسب من القوالب المتاحة',
      tips: [
        'تأكد من أن القالب يناسب نوع الشهادة المطلوبة',
        'يمكنك معاينة كل قالب قبل الاختيار',
        'القوالب قابلة للتخصيص في الخطوات التالية'
      ]
    },
    {
      id: 2,
      name: 'إدخال البيانات',
      description: 'أضف أسماء الطلاب والنصوص المطلوبة للشهادة',
      tips: [
        'يمكنك رفع ملف Excel يحتوي على أسماء الطلاب',
        'تأكد من أن العمود الأول يحتوي على الأسماء',
        'يمكنك إضافة الأسماء يدوياً واحداً تلو الآخر',
        'رفع الصور اختياري ولكنه يحسن من جودة الشهادات'
      ]
    },
    {
      id: 3,
      name: 'تحرير الشهادة',
      description: 'خصص مواقع النصوص والخطوط حسب احتياجاتك',
      tips: [
        'اسحب النصوص لتغيير مواقعها',
        'استخدم الأدوات الجانبية لتغيير الخطوط والألوان',
        'يمكنك تكبير وتصغير العرض للتحكم الدقيق',
        'استخدم أسهم لوحة المفاتيح للحركة الدقيقة'
      ]
    },
    {
      id: 4,
      name: 'معاينة الشهادات',
      description: 'راجع جميع الشهادات المولدة قبل التصدير',
      tips: [
        'تأكد من صحة جميع البيانات قبل التصدير',
        'يمكنك عرض الشهادات بطرق مختلفة (شبكة، قائمة، فردي)',
        'استخدم البحث للعثور على شهادة معينة بسرعة',
        'حدد الشهادات التي تريد تصديرها'
      ]
    },
    {
      id: 5,
      name: 'تصدير الشهادات',
      description: 'اختر إعدادات التصدير وحمل الملفات النهائية',
      tips: [
        'اختر التنسيق المناسب (PNG للجودة العالية، JPG للحجم الأصغر، PDF للطباعة)',
        'الجودة العالية تعطي نتائج أفضل لكنها تستغرق وقتاً أطول',
        'يمكنك تصدير شهادة واحدة أو جميع الشهادات',
        'احفظ المشروع للعودة إليه لاحقاً'
      ]
    }
  ];

  onSave(): void {
    this.saveClicked.emit();
  }

  onHelp(): void {
    this.showHelpModal = true;
    document.body.style.overflow = 'hidden';
  }

  closeHelp(): void {
    this.showHelpModal = false;
    document.body.style.overflow = 'auto';
  }
}