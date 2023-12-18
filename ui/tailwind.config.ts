import type { Config } from 'tailwindcss';

import baseConfig from '@stackwise-tooling/tailwind-config';

export default {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  presets: [baseConfig],
} satisfies Config;
