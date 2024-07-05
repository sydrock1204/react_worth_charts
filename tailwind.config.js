/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ["IBM Plex Mono", "monospace"]
      },
      width: {
        "watchList-sm": "80px",
        "watchList-md": "160px",
        "watchList-lg": "320px",
        "watchList-xl": "480px",
      },
      colors: {
        "color-brand-green": "#008C48",
        "color-brand-yello": "#ffff66",
        "color-brand-black": "#051140",
        "color-brand-white": "#ffffff",

        "color-state-success": "#008C48",
        "color-state-error": "#DE0E0E",
        "color-state-warning": "#FFFF66",

        "color-black": "#14192C",
        "color-white": "#F9FAFF",

        "gray1": "#333333",
        "gray2": "#4F4F4F",
        "gray3": "#828282",
        "gray4": "#BDBDBD",
        "gray5": "#E0E0E0",
      },

      fontSize: {
        "lg": "20px",
        "md": "18px",
        "nr": "16px",
        "sm": "14px"
      },

      screens: {
        "sm": "320px",
        "md": "768px",
        "lg": "1024px",
        "xl": "1440px",
      }
    },
  },
  plugins: [],
}

