import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import SiteHeader from '@/components/SiteHeader';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { BUSINESS } from '@/lib/constants';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(BUSINESS.url),
  title: {
    default: 'Sudofim Serv SRL - Echipamente Industriale & Sudura | Ploiesti',
    template: '%s | Sudofim Serv SRL',
  },
  description: 'Vanzare, inchiriere si service echipamente de sudura, generatoare de curent si utilaje industriale in Ploiesti, Prahova. Peste 400 echipamente disponibile.',
  keywords: [
    'sudura electrofuziune', 'aparate sudura', 'generatoare curent', 'echipamente industriale',
    'Ploiesti', 'inchiriere utilaje', 'compactoare', 'compresoare', 'masini de taiat',
    'sudura cap la cap', 'service echipamente', 'Prahova', 'Sudofim Serv',
  ],
  authors: [{ name: BUSINESS.companyName }],
  creator: BUSINESS.companyName,
  openGraph: {
    type: 'website',
    locale: 'ro_RO',
    url: BUSINESS.url,
    siteName: BUSINESS.shortName,
    title: 'Sudofim Serv SRL - Echipamente Industriale & Sudura',
    description: 'Peste 400 echipamente industriale. Vanzare, inchiriere si service in Ploiesti si toata Romania.',
  },
  alternates: { canonical: BUSINESS.url },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
};

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': `${BUSINESS.url}/#localbusiness`,
  name: BUSINESS.companyName,
  url: BUSINESS.url,
  telephone: BUSINESS.salesPhone1Intl,
  email: BUSINESS.email,
  address: {
    '@type': 'PostalAddress',
    addressLocality: BUSINESS.city,
    addressRegion: BUSINESS.county,
    addressCountry: 'RO',
  },
  openingHoursSpecification: [
    { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday'], opens: '08:00', closes: '17:00' },
  ],
  areaServed: { '@type': 'Country', name: 'Romania' },
  description: BUSINESS.description,
};

const webSiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: BUSINESS.shortName,
  url: BUSINESS.url,
  description: BUSINESS.description,
  inLanguage: 'ro-RO',
  potentialAction: {
    '@type': 'SearchAction',
    target: { '@type': 'EntryPoint', urlTemplate: `${BUSINESS.url}/echipamente/?search={search_term_string}` },
    'query-input': 'required name=search_term_string',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ro" className={inter.variable}>
      <head>
        <meta name="theme-color" content="#BD0004" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }} />
      </head>
      <body className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
        <SiteHeader />
        <main id="main-content" className="flex-1">{children}</main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
