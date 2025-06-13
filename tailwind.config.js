/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
    "./src/app/**/*.{html,ts,css,scss,sass,less,styl}",
    "./src/components/**/*.{html,ts}",
  ],
  darkMode: 'media',
  theme: {
    extend: {
      colors: {
        certificate: {
          50: '#eff6ff',
          100: '#dbeafe', 
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        orange: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        }
      },
      fontFamily: {
        'arabic': ['Cairo', 'Tajawal', 'sans-serif'],
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'display': ['SF Pro Display', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.8s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'pulse-slow': 'pulse 3s infinite',
        'pulse-glow': 'pulseGlow 2s infinite',
        'gradient-flow': 'gradientFlow 3s ease infinite',
        'heartbeat': 'heartbeat 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'spin': 'spin 1s linear infinite',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slide-in-top': 'slideInFromTop 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(249, 115, 22, 0.4)' },
          '50%': { boxShadow: '0 0 0 10px rgba(249, 115, 22, 0)' },
        },
        gradientFlow: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        heartbeat: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 5px rgba(249, 115, 22, 0.3)' },
          '50%': { boxShadow: '0 0 20px rgba(249, 115, 22, 0.6)' },
        },
        spin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        slideInFromTop: {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      boxShadow: {
        'certificate': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'inner-light': 'inset 0 1px 2px 0 rgba(255, 255, 255, 0.05)',
        'template-hover': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        'orange-glow': '0 10px 25px rgba(249, 115, 22, 0.4)',
        'card-hover': '0 20px 40px rgba(0, 0, 0, 0.15)',
        'lift': '0 10px 25px rgba(0, 0, 0, 0.2)',
        'contact-hover': '0 8px 25px rgba(0, 0, 0, 0.15)',
        'inner': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
        'form-focus': '0 0 0 3px rgba(249, 115, 22, 0.1)',
        'form-valid': '0 0 0 3px rgba(16, 185, 129, 0.1)',
        'form-invalid': '0 0 0 3px rgba(239, 68, 68, 0.1)',
        'soft': '0 10px 25px rgba(0, 0, 0, 0.1)',
        'social': '0 0 20px rgba(249, 115, 22, 0.4)',
      },
      backgroundImage: {
        'btn-orange': 'linear-gradient(135deg, #f97316, #ea580c)',
        'btn-orange-hover': 'linear-gradient(135deg, #ea580c, #dc2626)',
        'progress-bar': 'linear-gradient(90deg, #f97316, #ea580c)',
        'gradient-text': 'linear-gradient(45deg, #f97316, #ea580c)',
        'dot-pattern': 'radial-gradient(circle, rgba(255, 255, 255, 0.1) 1px, transparent 1px)',
        'social-shine': 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
        'template-shine': 'linear-gradient(45deg, transparent, rgba(249, 115, 22, 0.1), transparent)',
        'certificate-shine': 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)',
        'slider-thumb': 'linear-gradient(45deg, #f97316, #ea580c)',
        'slider-thumb-hover': 'linear-gradient(45deg, #ea580c, #c2410c)',
      },
      backgroundSize: {
        '200': '200% 200%',
        'dot': '60px 60px',
      },
      scale: {
        '102': '1.02',
        '105': '1.05',
        '110': '1.1',
        '115': '1.15',
      },
      backdropBlur: {
        'xs': '2px',
        'sm': '4px',
        'md': '10px',
      },
      borderRadius: {
        '4xl': '2rem',
        'xl': '12px',
        '2xl': '16px',
        '3xl': '24px',
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'bounce-smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
      screens: {
        'xs': '475px',
      },
    },
  },
  corePlugins: {
    textAlign: true,
    direction: true,
  },
  plugins: [
    function({ addUtilities, addComponents, addBase }) {
      addBase({
        '*': {
          'transition-property': 'color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter',
          'transition-timing-function': 'cubic-bezier(0.4, 0, 0.2, 1)',
          'transition-duration': '150ms',
        },
        '[dir="rtl"] input[type="text"], [dir="rtl"] textarea, [dir="rtl"] select': {
          'text-align': 'right',
        },
        '[dir="ltr"] input[type="email"], [dir="ltr"] input[type="tel"]': {
          'text-align': 'left',
          'direction': 'ltr',
        },
        'input:focus, textarea:focus, select:focus': {
          'box-shadow': '0 0 0 3px rgba(249, 115, 22, 0.1)',
        },
        'button:focus, .template-card:focus': {
          'outline': '2px solid #f97316',
          'outline-offset': '2px',
        },
        'button:disabled': {
          'opacity': '0.6',
          'cursor': 'not-allowed',
          'transform': 'none !important',
        },
        'button:active:not(:disabled)': {
          'transform': 'translateY(0) !important',
        },
      });

      addUtilities({
        '.dir-rtl': {
          direction: 'rtl',
        },
        '.dir-ltr': {
          direction: 'ltr',
        },
        '.scrollbar-thin': {
          'scrollbar-width': 'thin',
          'scrollbar-color': '#fdba74 #f3f4f6',
        },
        '.scrollbar-thin::-webkit-scrollbar': {
          'width': '6px',
          'height': '6px',
        },
        '.scrollbar-thin::-webkit-scrollbar-track': {
          'background': '#f3f4f6',
          'border-radius': '10px',
        },
        '.scrollbar-thin::-webkit-scrollbar-thumb': {
          'background': 'linear-gradient(45deg, #f97316, #ea580c)',
          'border-radius': '10px',
        },
        '.scrollbar-thin::-webkit-scrollbar-thumb:hover': {
          'background': 'linear-gradient(45deg, #ea580c, #c2410c)',
        },
        '.gradient-text': {
          'background': 'linear-gradient(45deg, #f97316, #ea580c)',
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
          'background-clip': 'text',
        },
        '.text-shadow': {
          'text-shadow': '0 1px 2px rgba(0, 0, 0, 0.1)',
        },
        '.text-shadow-lg': {
          'text-shadow': '0 1px 2px rgba(0, 0, 0, 0.5)',
        },
        '.text-shadow-glow': {
          'text-shadow': '0 0 10px rgba(249, 115, 22, 0.5)',
        },
        '.hover-lift': {
          'transition': 'transform 0.3s ease, box-shadow 0.3s ease',
        },
        '.hover-lift:hover': {
          'transform': 'translateY(-5px)',
          'box-shadow': '0 10px 25px rgba(0, 0, 0, 0.2)',
        },
        '.hover-orange:hover': {
          'color': '#f97316',
          'transform': 'scale(1.1)',
        },
        '.hover-scale-105:hover': {
          'transform': 'scale(1.05)',
        },
        '.hover-translate-y-neg-1:hover': {
          'transform': 'translateY(-4px)',
        },
        '.form-valid': {
          'border-color': '#10b981 !important',
          'box-shadow': '0 0 0 3px rgba(16, 185, 129, 0.1) !important',
        },
        '.form-invalid': {
          'border-color': '#ef4444 !important',
          'box-shadow': '0 0 0 3px rgba(239, 68, 68, 0.1) !important',
        },
        '.bg-dot-pattern': {
          'background-image': 'radial-gradient(circle, rgba(255, 255, 255, 0.1) 1px, transparent 1px)',
          'background-size': '60px 60px',
        },
        '.line-clamp-2': {
          'display': '-webkit-box',
          '-webkit-line-clamp': '2',
          '-webkit-box-orient': 'vertical',
          'overflow': 'hidden',
        },
        '.resize-handle-base': {
          'position': 'absolute',
          'width': '8px',
          'height': '8px',
          'background-color': '#3b82f6',
          'border': '1px solid white',
          'border-radius': '50%',
          'cursor': 'pointer',
          'z-index': '10',
        },
      });

      addComponents({
        '.template-card': {
          'transition': 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          'position': 'relative',
          'overflow': 'hidden',
        },
        '.template-card::before': {
          'content': "''",
          'position': 'absolute',
          'top': '0',
          'left': '0',
          'right': '0',
          'bottom': '0',
          'background': 'linear-gradient(45deg, transparent, rgba(249, 115, 22, 0.1), transparent)',
          'transform': 'translateX(-100%)',
          'transition': 'transform 0.6s',
          'z-index': '1',
        },
        '.template-card:hover::before': {
          'transform': 'translateX(100%)',
        },
        '.template-card:hover': {
          'transform': 'translateY(-8px) scale(1.02)',
          'box-shadow': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        },
        '.template-card:hover img': {
          'transform': 'scale(1.1)',
        },
        '.btn-orange': {
          'background': 'linear-gradient(135deg, #f97316, #ea580c)',
          'transition': 'all 0.3s ease',
          'position': 'relative',
          'overflow': 'hidden',
        },
        '.btn-orange::before': {
          'content': "''",
          'position': 'absolute',
          'top': '0',
          'left': '-100%',
          'width': '100%',
          'height': '100%',
          'background': 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
          'transition': 'left 0.5s',
        },
        '.btn-orange:hover::before': {
          'left': '100%',
        },
        '.btn-orange:hover': {
          'background': 'linear-gradient(135deg, #ea580c, #dc2626)',
          'transform': 'translateY(-2px)',
          'box-shadow': '0 10px 25px rgba(249, 115, 22, 0.4)',
        },
        '.contact-card': {
          'transition': 'all 0.3s ease',
          'border-radius': '12px',
          'overflow': 'hidden',
        },
        '.contact-card:hover': {
          'transform': 'translateY(-2px)',
          'box-shadow': '0 8px 25px rgba(0, 0, 0, 0.15)',
        },
        '.contact-card:hover .contact-icon': {
          'transform': 'scale(1.1) rotate(5deg)',
        },
        '.contact-icon': {
          'transition': 'all 0.3s ease',
        },
        '.social-icon': {
          'transition': 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          'position': 'relative',
          'overflow': 'hidden',
        },
        '.social-icon::before': {
          'content': "''",
          'position': 'absolute',
          'top': '0',
          'left': '-100%',
          'width': '100%',
          'height': '100%',
          'background': 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
          'transition': 'left 0.6s',
        },
        '.social-icon:hover::before': {
          'left': '100%',
        },
        '.social-icon:hover': {
          'transform': 'scale(1.15)',
          'box-shadow': '0 0 20px rgba(249, 115, 22, 0.4)',
        },
        '.stat-card': {
          'transition': 'all 0.3s ease',
          'backdrop-filter': 'blur(10px)',
          '-webkit-backdrop-filter': 'blur(10px)',
          'border': '1px solid rgba(255, 255, 255, 0.1)',
        },
        '.stat-number': {
          'font-family': 'SF Pro Display, system-ui, sans-serif',
          'font-weight': '800',
          'text-shadow': '0 2px 4px rgba(0, 0, 0, 0.3)',
        },
        '.quick-link': {
          'position': 'relative',
          'transition': 'all 0.3s ease',
        },
        '.loading-spinner': {
          'border': '4px solid #fed7aa',
          'border-top': '4px solid #f97316',
          'border-radius': '50%',
          'width': '40px',
          'height': '40px',
          'animation': 'spin 1s linear infinite',
        },
        '.progress-bar': {
          'background': 'linear-gradient(90deg, #f97316, #ea580c)',
          'background-size': '200% 200%',
          'animation': 'gradient-flow 3s ease infinite',
          'transition': 'width 0.5s ease-out',
        },
        '.selected-template': {
          'border-color': '#f97316 !important',
          'box-shadow': '0 0 0 4px rgba(249, 115, 22, 0.2)',
          'transform': 'scale(1.05)',
        },
        '.logo-container': {
          'transition': 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        },
        '.logo-container:hover': {
          'transform': 'scale(1.05)',
          'box-shadow': '0 10px 25px rgba(249, 115, 22, 0.3)',
        },
        '.certificate-preview': {
          'position': 'relative',
          'overflow': 'hidden',
        },
        '.developer-name': {
          'transition': 'all 0.3s ease',
          'position': 'relative',
        },
        '.heart-icon': {
          'animation': 'heartbeat 2s ease-in-out infinite',
          'filter': 'drop-shadow(0 0 5px rgba(239, 68, 68, 0.5))',
        },
        '.newsletter-form': {
          'position': 'relative',
        },
        '.newsletter-input': {
          'transition': 'all 0.3s ease',
          'background': 'rgba(31, 41, 55, 0.8)',
          'backdrop-filter': 'blur(10px)',
          '-webkit-backdrop-filter': 'blur(10px)',
        },
        '.newsletter-button': {
          'transition': 'all 0.3s ease',
          'position': 'relative',
          'overflow': 'hidden',
        },
      });
    },
  ],
};