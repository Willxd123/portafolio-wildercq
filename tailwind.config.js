/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
    "./node_modules/flowbite/**/*.js" // add this line
  ],
  theme: {  // ← AGREGAR esta línea
    extend: {
      colors: {
        // Paleta de grises personalizada basada en la imagen
        'custom-gray': {
          50: '#f8f9fa',   // Más claro
          100: '#e9ecef',  // NE-035 Sucre
          200: '#dee2e6',  // NE-030 Tolima  
          300: '#ced4da',  // NE-039 Viña del Mar
          400: '#adb5bd',  // Intermedio
          500: '#6c757d',  // NE-043 Calama
          600: '#495057',  // Intermedio
          700: '#343a40',  // NE-022 Yopal
          800: '#212529',  // Más oscuro
          900: '#1a1d20',  // Más oscuro aún
        },
        'blue-gray': {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
        // Colores de acento para elementos interactivos
        'accent': {
          blue: '#3b82f6',
          green: '#10b981',
          purple: '#8b5cf6',
          orange: '#f59e0b',
        }
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-in-out',
        'slide-up': 'slideUp 0.8s ease-out',
        'pulse-slow': 'pulse 3s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },  // ← AGREGAR esta línea
  },  // ← AGREGAR esta línea
  plugins: [
    require('flowbite/plugin')
  ],
}