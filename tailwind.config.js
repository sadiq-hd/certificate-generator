/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
    "./src/app/**/*.{html,ts,css,scss,sass,less,styl}",
    "./src/components/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      // ألوان مخصصة للمشروع
      colors: {
        certificate: {
          50: '#eff6ff',
          100: '#dbeafe', 
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        }
      },
      
      // خطوط مخصصة (إذا كان عندك خطوط عربية)
      fontFamily: {
        'arabic': ['Cairo', 'Tajawal', 'sans-serif'],
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      
      // Animation مخصصة
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s infinite',
      },
      
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        }
      },
      
      // Spacing مخصص للـ certificates
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      
      // Box shadows مخصصة
      boxShadow: {
        'certificate': '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'inner-light': 'inset 0 1px 2px 0 rgba(255, 255, 255, 0.05)',
      },
      
      // Border radius مخصص
      borderRadius: {
        '4xl': '2rem',
      },
      
      // Z-index values
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      }
    },
  },
  plugins: [
    // Plugin للـ forms (إذا احتجته)
    // require('@tailwindcss/forms'),
    
    // Plugin مخصص للـ RTL
    function({ addUtilities }) {
      const newUtilities = {
        '.dir-rtl': {
          direction: 'rtl',
        },
        '.dir-ltr': {
          direction: 'ltr',
        },
        // Utilities للـ resize handles
        '.resize-handle-base': {
          position: 'absolute',
          width: '8px',
          height: '8px',
          backgroundColor: '#3b82f6',
          border: '1px solid white',
          borderRadius: '50%',
          cursor: 'pointer',
          zIndex: '10',
        }
      }
      addUtilities(newUtilities)
    }
  ],
  
  // إعدادات للـ RTL
  corePlugins: {
    // تأكد إن هذول شغالين
    textAlign: true,
    direction: true,
  }
}