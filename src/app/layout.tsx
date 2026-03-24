import type { Metadata } from 'next';
import { JetBrains_Mono, Outfit } from 'next/font/google';
import './globals.css';
import ScrollProgress from '@/components/ScrollProgress';
import CustomCursor from '@/components/CustomCursor';

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-jetbrains',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-outfit',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://umair-ahmad.vercel.app'),
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
    url: 'https://umair-ahmad.vercel.app',
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
    canonical: 'https://umair-ahmad.vercel.app',
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
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Umair Ahmad',
  jobTitle: 'Cybersecurity Specialist & Full-Stack Developer',
  url: 'https://umair-ahmad.vercel.app',
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
  image: 'https://umair-ahmad.vercel.app/og-image.png',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`dark ${jetbrainsMono.variable} ${outfit.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-bg text-white font-body antialiased">
        <ScrollProgress />
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
