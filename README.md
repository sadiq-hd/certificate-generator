# 🏆 Certificate Generator

> **Smart and Advanced Certificate Creator** - Create your custom certificates easily and quickly using Angular 18 & Tailwind CSS

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-Visit_Site-blue?style=for-the-badge)](https://shahadat-generator.netlify.app/)
[![Angular](https://img.shields.io/badge/Angular-18-red?style=flat-square&logo=angular)](https://angular.io/)
[![Tailwind](https://img.shields.io/badge/Tailwind-CSS-blue?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Netlify](https://img.shields.io/badge/Deployed_on-Netlify-00C7B7?style=flat-square&logo=netlify)](https://shahadat-generator.netlify.app/)

---

## ✨ Key Features

🎨 **Diverse Templates** - A collection of ready-to-use and customizable templates  
📊 **Data Import** - Upload Excel files or enter names manually  
✏️ **Advanced Editor** - Drag-and-drop text elements with font and color customization  
👀 **Comprehensive Preview** - Review all certificates before export  
💾 **Multi-format Export** - PNG, JPG, PDF in high quality  
🌍 **RTL Support** - Full Arabic language and right-to-left direction support  
📱 **Responsive Design** - Works on all devices and screen sizes  
⚡ **Fast Performance** - Optimized with Tailwind CSS for speed  

---

## 🎯 Quick Preview

### 🔥 Try It Now
**[🌐 Live Demo - shahadat-generator.netlify.app](https://shahadat-generator.netlify.app/)**

---

## 🚀 Quick Start

### 📋 Requirements

- **Node.js** (version 18 or later)
- **Angular CLI** (`npm install -g @angular/cli`)
- **npm** or **yarn**

### ⚡ Installation

```bash
# 1. Clone the repository
git clone https://github.com/sadiq-hd/certificate-generator.git
cd certificate-generator

# 2. Install dependencies
npm install

# 3. Run the project
ng serve

# 4. Open in browser
# http://localhost:4200
```

**🎉 That's it! The project is ready to use**

---

## 📁 Project Structure

```
src/
├── app/
│   ├── components/              # Core components
│   │   ├── template-selector/   # Template selection
│   │   ├── data-input/         # Data input
│   │   ├── certificate-editor/ # Certificate editor
│   │   ├── preview-panel/      # Preview panel
│   │   ├── export-panel/       # Export panel
│   │   ├── header/             # Header
│   │   └── footer/             # Footer
│   ├── services/               # Services
│   │   ├── certificate.service.ts
│   │   ├── template.service.ts
│   │   ├── excel.service.ts
│   │   └── export.service.ts
│   ├── models/                 # Data models
│   │   ├── student.model.ts
│   │   ├── template.model.ts
│   │   └── certificate.model.ts
│   ├── pages/                  # Pages
│   │   ├── home/
│   │   ├── templates/
│   │   ├── generator/
│   │   └── contact/
│   └── shared/                 # Shared components
└── assets/
    ├── templates/              # Template images
    ├── fonts/                  # Custom fonts
    └── icons/                  # Icons
```

---

## 🎨 Adding New Templates

### 1. Add Template Image

```bash
# Add your template image to:
src/assets/templates/my-template.png

# Add a thumbnail (optional):
src/assets/templates/thumbs/my-template-thumb.png
```

### 2. Update Template Configuration

```typescript
// In src/app/app.config.ts
export const TEMPLATES = [
  {
    id: 'my-template',
    name: 'Excellence Certificate',
    imagePath: 'assets/templates/my-template.png',
    thumbnail: 'assets/templates/thumbs/my-template-thumb.png',
    width: 1200,
    height: 800,
    description: 'Elegant template for official certificates',
    textAreas: [
      {
        id: 'student-name',
        label: 'Student Name',
        x: 600,
        y: 400,
        width: 400,
        height: 80,
        fontSize: 42,
        fontFamily: 'Arial, sans-serif',
        color: '#2c3e50',
        textAlign: 'center',
        fontWeight: 'bold',
        placeholder: '[Student Name]'
      }
    ]
  }
];
```

---

## 📊 Excel File Format

### 📋 Required Format:

| Student Name   | Major       | GPA |
|----------------|-------------|-----|
| Ahmed Mohammed | Engineering | 3.8 |
| Fatima Ali     | Medicine    | 3.9 |
| Sarah Ahmed    | Business    | 3.7 |

### ✅ Important Tips:
- **First Column**: Student names (required)
- **Additional Columns**: Optional fields
- **Format**: `.xlsx` or `.xls`
- **Encoding**: Supports Arabic text

---

## ⚙️ Advanced Customizations

### 🎭 Adding Custom Fonts

```typescript
// In src/app/app.config.ts
export const FONTS = [
  { name: 'Cairo', value: 'Cairo, sans-serif' },
  { name: 'Amiri', value: 'Amiri, serif' },
  { name: 'Tajawal', value: 'Tajawal, sans-serif' }
];
```

### 🎨 Export Settings

```typescript
// In src/app/app.config.ts
export const EXPORT_OPTIONS = {
  formats: ['png', 'jpg', 'pdf'],
  qualities: [0.8, 0.9, 1.0],
  sizes: ['original', 'print', 'web']
};
```

### 🌈 Color Customization

```typescript
// In tailwind.config.js
theme: {
  extend: {
    colors: {
      'certificate-gold': '#FFD700',
      'certificate-blue': '#1E40AF',
      'certificate-green': '#059669'
    }
  }
}
```

---

## 🛠️ Build & Deploy

### Production Build

```bash
ng build --configuration production
```

### Deploy to Netlify

```bash
# The project is already configured for Netlify
# Just connect your GitHub repo to Netlify

# Build command: ng build --configuration production
# Publish directory: dist/certificate-generator/browser
```

### Deploy to Other Platforms

```bash
# Copy dist folder to your web server
cp -r dist/certificate-generator/browser/* /var/www/html/
```

---

## 🐛 Troubleshooting

### Common Issues:

1. **Templates Not Showing**
   - Check if files exist in `src/assets/templates/`
   - Ensure correct paths in configuration files

2. **Excel Read Errors**
   - Ensure names are in the first column
   - Try saving the file as `.xlsx`
   - Check for empty rows

3. **Export Issues**
   - Make sure your browser supports file downloads
   - Try reducing export quality if needed
   - Check browser console for errors

4. **RTL/Arabic Issues**
   - Ensure proper font loading
   - Check text direction settings
   - Verify Arabic font support

---

## 🎯 Technologies Used

- **Frontend**: Angular 18, TypeScript 5.0
- **Styling**: Tailwind CSS 3.0
- **Build Tool**: Angular CLI
- **Deployment**: Netlify
- **File Processing**: SheetJS for Excel reading
- **Export**: html2canvas for image generation

---

## 📝 License

This project is open-source and available under the MIT License.

---

## 🤝 Contributing

We welcome contributions! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

---

## 📧 Support

For support or to report issues:
- **GitHub Issues**: [Create an issue](https://github.com/sadiq-hd/certificate-generator/issues)
- **Live Demo**: [shahadat-generator.netlify.app](https://shahadat-generator.netlify.app/)

---

## 🌟 Show Your Support

If this project helped you, please give it a ⭐ on GitHub!

---

**Developed with ❤️ by [Sadiq Al-Dubaisi](https://github.com/sadiq-hd)**

[![GitHub](https://img.shields.io/badge/GitHub-Follow-black?style=flat-square&logo=github)](https://github.com/sadiq-hd)
[![Website](https://img.shields.io/badge/Website-Visit-blue?style=flat-square&logo=netlify)](https://shahadat-generator.netlify.app/)