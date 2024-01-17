/** @type {import('tailwindcss').Config} */
module.exports = {
  
  mode: 'jit',
  content: ["./src/**/*.{js,jsx,ts,tsx}"
    , "./src/**/*.{js,jsx,ts,tsx}",
    "./src/**/**/*.{js,jsx,ts,tsx}",
    'node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}'

  ],
  

  theme: {
    
    extend: {
      screens: {
        '2xs': { min: '300px' },
        xs: { max: '575px' }, // Mobile (iPhone 3 - iPhone XS Max).
        sm: { min: '300px' }, // Mobile (matches max: iPhone 11 Pro Max landscape @ 896px).
        md: { min: '898px' }, // Tablet (matches max: iPad Pro @ 1112px).
        lg: { min: '1200px' }, // Desktop smallest.
        xl: { min: '1259px' }, // Desktop wide.
        '2xl': { min: '1359px' } // Desktop widescreen.
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('flowbite/plugin'),
    
     {
      tailwindcss: {},
      autoprefixer: {},
      ...(process.env.NODE_ENV === 'production' ? { cssnano: {} } : {})
    },
    require('tailwind-accent-color'),
  ],
}
