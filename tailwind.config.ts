import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      animation: {
        'dot-bounce': 'dot-bounce 1s ease-in-out infinite',
        'dot-bounce2': 'dot-bounce 1s ease-in-out infinite',
        'dot-bounce3': 'dot-bounce 1s ease-in-out infinite',
      },
      keyframes: {
        'dot-bounce': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-1px)' }, // Reduced from -10px to -5px
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
