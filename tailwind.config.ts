import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#6366F1', // A nice shade of indigo
        secondary: '#8B5CF6', // A complementary purple
        accent: '#EC4899', // A vibrant pink
        background: '#F9FAFB', // Light gray background
        text: '#1F2937', // Dark gray text
        'text-light': '#6B7280', // Lighter gray text
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Lexend', 'sans-serif'],
      },
      boxShadow: {
        'neumorphic': '5px 5px 10px #d1d9e6, -5px -5px 10px #f9f9f9',
        'neumorphic-pressed': 'inset 3px 3px 7px #d1d9e6, inset -3px -3px 7px #f9f9f9',
      },
    },
  },
  plugins: [],
};
export default config;
