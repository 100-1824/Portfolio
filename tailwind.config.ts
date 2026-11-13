import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ink: { DEFAULT: '#04060A', 2: '#070B11', 3: '#0A0F17', 4: '#101722' },
        fg: { DEFAULT: '#E8F0F7', muted: '#8A97A8', dim: '#566274' },
        line: 'rgba(232,240,247,0.08)',
        mint: { DEFAULT: '#3DF5C4', soft: '#3DF5C41A', deep: '#13B98E' },
        signal: { blue: '#6E8BFF', red: '#FF5A4E', amber: '#FFB547', violet: '#A98BFF' },
        // legacy alias kept for any stray usage
        bg: '#04060A',
        accent: '#3DF5C4',
      },
      fontFamily: {
        display: ['var(--font-display)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        body: ['var(--font-body)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
        heading: ['var(--font-display)', 'ui-sans-serif', 'sans-serif'],
      },
      letterSpacing: { tightest: '-0.045em' },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'out-quint': 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      keyframes: {
        marquee: { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
        'spin-slow': { to: { transform: 'rotate(360deg)' } },
        scan: { '0%': { transform: 'translateY(-100%)' }, '100%': { transform: 'translateY(100%)' } },
        ping2: { '75%, 100%': { transform: 'scale(2.4)', opacity: '0' } },
        blink: { '0%,49%': { opacity: '1' }, '50%,100%': { opacity: '0' } },
        shimmer: { from: { backgroundPosition: '200% 0' }, to: { backgroundPosition: '-200% 0' } },
      },
      animation: {
        marquee: 'marquee 40s linear infinite',
        'spin-slow': 'spin-slow 120s linear infinite',
        'spin-slower': 'spin-slow 200s linear infinite',
        scan: 'scan 4s cubic-bezier(0.65,0,0.35,1) infinite',
        ping2: 'ping2 2s cubic-bezier(0,0,0.2,1) infinite',
        blink: 'blink 1.06s steps(1) infinite',
        shimmer: 'shimmer 6s linear infinite',
      },
    },
  },
  plugins: [],
};
export default config;
