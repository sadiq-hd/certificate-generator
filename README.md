# Certificate Generator

A comprehensive Angular 18 application to easily create and customize certificates.

## 🌟 Features

* **Template Selection**: A variety of customizable certificate templates
* **Data Input**: Upload Excel files or enter names manually
* **Advanced Editor**: Drag-and-drop text with customizable fonts and colors
* **Full Preview**: Preview all certificates before export
* **Multi-format Export**: PNG, JPG, PDF
* **RTL Support**: Full Arabic language and RTL support

## 🚀 Quick Start

### Requirements

* Node.js (v18 or later)
* Angular CLI
* npm or yarn

### Installation

1. **Clone the Repository**

```bash
git clone <repository-url>
cd certificate-generator
```

2. **Install Dependencies**

```bash
npm install
```

3. **Tailwind CSS Setup**

```bash
# Already configured in package.json
npm run build
```

4. **Run the App**

```bash
ng serve
```

5. **Open in Browser**

```
http://localhost:4200
```

## 📁 Project Structure

```
src/
├── app/
│   ├── components/          # Core components
│   │   ├── template-selector/
│   │   ├── data-input/
│   │   ├── certificate-editor/
│   │   ├── preview-panel/
│   │   └── export-panel/
│   ├── services/            # Services
│   │   ├── certificate.service.ts
│   │   ├── template.service.ts
│   │   ├── excel.service.ts
│   │   └── export.service.ts
│   ├── models/              # Data models
│   │   ├── student.model.ts
│   │   ├── template.model.ts
│   │   └── certificate.model.ts
│   └── app.config.ts        # App configuration
└── assets/
    ├── templates/           # Template images
    ├── fonts/               # Optional custom fonts
    └── icons/               # Icons
```

## 🎨 Adding New Templates

1. **Add Template Image**

```bash
# Add your template image to:
src/assets/templates/your-template.png

# Add a thumbnail (optional):
src/assets/templates/thumbs/your-template-thumb.png
```

2. **Update Configuration File**

```typescript
// Inside src/app/app.config.ts
export const AppConfig = {
  templates: [
    {
      id: 'unique-id',
      name: 'Template Name',
      imagePath: 'assets/templates/your-template.png',
      thumbnail: 'assets/templates/thumbs/your-template-thumb.png',
      width: 800,
      height: 600,
      description: 'Template description',
      textAreas: [
        {
          id: 'name',
          label: 'Student Name',
          x: 400,
          y: 250,
          width: 300,
          height: 60,
          fontSize: 36,
          fontFamily: 'Arial',
          color: '#000000',
          textAlign: 'center',
          fontWeight: 'bold',
          defaultText: '[Student Name]',
          isDraggable: true,
          isResizable: true
        }
      ]
    }
  ]
};
```

## 📊 Excel File Format

Your Excel file should contain:

* **First Column**: Student names
* **Additional Columns**: Optional fields (e.g., major, GPA)

### Example:

| Student Name   | Major       | GPA |
| -------------- | ----------- | --- |
| Ahmed Mohammed | Engineering | 3.8 |
| Fatima Ali     | Medicine    | 3.9 |

## ⚙️ Advanced Customization

### Add Custom Fonts

```typescript
// In src/app/app.config.ts
fonts: [
  { name: 'Custom Font', value: 'CustomFont, Arial, sans-serif' }
]
```

### Export Format Options

```typescript
// In src/app/app.config.ts
exportFormats: [
  { name: 'WebP', value: 'webp', description: 'Modern high-quality format' }
]
```

## 🛠️ Build & Deploy

### Production Build

```bash
ng build --configuration production
```

### Deploy to Server

```bash
# Copy dist folder to your web server directory
cp -r dist/certificate-generator/* /var/www/html/
```

## 🐛 Troubleshooting

### Common Issues:

1. **Templates Not Showing**

   * Check if files exist in `src/assets/templates/`
   * Ensure correct paths in `app.config.ts`

2. **Excel Read Errors**

   * Ensure names are in the first column
   * Try saving the file as `.xlsx`

3. **Export Issues**

   * Make sure your browser supports file downloads
   * Try reducing export quality if needed

## 📝 License

This project is open-source and available for use and development.

## 🤝 Contributing

We welcome contributions! Please:

1. Fork the repo
2. Create a feature branch
3. Make your changes
4. Submit a Pull Request

## 📧 Support

For support or to report issues, please open an Issue in the repository.

---

**Developed with ❤️ by Sadiq Al-Dubaissi**
