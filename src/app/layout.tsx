import type { Metadata } from 'next';
import type { Viewport } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import ScrollProgress from '@/components/ScrollProgress';
import CustomCursor from '@/components/CustomCursor';
import SmoothScroll from '@/components/SmoothScroll';
import Preloader from '@/components/Preloader';

// Fonts are bundled in the repo so builds never depend on fetching Google Fonts.
const display = localFont({
  src: './fonts/space-grotesk-latin-wght-normal.woff2',
  weight: '300 700',
  variable: '--font-display',
  display: 'swap',
});

const body = localFont({
  src: './fonts/inter-latin-wght-normal.woff2',
  weight: '100 900',
  variable: '--font-body',
  display: 'swap',
});

const mono = localFont({
  src: './fonts/jetbrains-mono-latin-wght-normal.woff2',
  weight: '100 800',
  variable: '--font-mono',
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#04060A',
  colorScheme: 'dark',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://umair-ahmed-portfolio.vercel.app'),
  title: {
    default: 'Umair Ahmad | Cybersecurity & Full-Stack Developer',
    template: '%s | Umair Ahmad',
  },
  description:
    'Umair Ahmad — Cybersecurity Specialist, AI/ML Engineer, Full-Stack Developer & DevOps Engineer based in Islamabad, Pakistan. BS Software Engineering at COMSATS Wah (2022–2026).',
  keywords: [
    'Umair Ahmad',
    'cybersecurity developer Pakistan',
    'full-stack developer Islamabad',
    'AI ML engineer portfolio',
    'penetration testing Pakistan',
    'Laravel developer Pakistan',
    'intrusion detection system',
    'COMSATS software engineering',
    'DevOps engineer Pakistan',
    'cybersecurity portfolio',
  ],
  authors: [{ name: 'Umair Ahmad', url: 'https://github.com/100-1824' }],
  creator: 'Umair Ahmad',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://umair-ahmed-portfolio.vercel.app',
    title: 'Umair Ahmad | Cybersecurity & Full-Stack Developer',
    description:
      'Cybersecurity Specialist · AI/ML Engineer · Full-Stack Developer · DevOps Engineer. Based in Islamabad, Pakistan.',
    siteName: 'Umair Ahmad Portfolio',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Umair Ahmad — Cybersecurity & Full-Stack Developer, Islamabad Pakistan',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Umair Ahmad | Cybersecurity & Full-Stack Developer',
    description:
      'Cybersecurity Specialist · AI/ML Engineer · Full-Stack Developer · DevOps Engineer. Based in Islamabad, Pakistan.',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: 'https://umair-ahmed-portfolio.vercel.app',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
    },
  },
  verification: {
    google: 'F6gK_GHiO3mBp15co7GtnQ10kr3MdxtxjRwTpha4Lus',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Umair Ahmad',
  jobTitle: 'Cybersecurity Specialist & Full-Stack Developer',
  url: 'https://umair-ahmed-portfolio.vercel.app',
  email: '18umair24@gmail.com',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Islamabad',
    addressRegion: 'Korang Town',
    addressCountry: 'PK',
  },
  sameAs: ['https://github.com/100-1824', 'https://linkedin.com/in/umair1824'],
  alumniOf: {
    '@type': 'EducationalOrganization',
    name: 'COMSATS University Islamabad — Wah Campus',
  },
  hasCredential: [
    'ISC2 Certified in Cybersecurity (CC)',
    'Google Professional Cybersecurity Certificate',
    'Certified AppSec Practitioner (CAP)',
  ],
  knowsAbout: [
    'Cybersecurity',
    'Penetration Testing',
    'AI/ML',
    'Deep Learning',
    'Full-Stack Development',
    'Laravel',
    'Python',
    'DevOps',
    'Docker',
    'Kubernetes',
  ],
  image: 'https://umair-ahmed-portfolio.vercel.app/og-image.png',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`dark ${display.variable} ${body.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <a
          href="#about"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[400] focus:rounded-full focus:bg-mint focus:px-4 focus:py-2 focus:text-ink"
        >
          Skip to content
        </a>
        <Preloader />
        <ScrollProgress />
        <CustomCursor />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
