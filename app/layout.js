
import "./globals.css";
import Providers from "@/components/Providers";
import { Inter, Poppins } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700', '800'],
  subsets: ['latin'],
  variable: '--font-poppins',
  display: 'swap',
});

export const metadata = {
  metadataBase: new URL('https://www.fakhriitservices.com'), // Replace with actual domain if known, or use localhost for dev
  title: {
    default: "Fakhri IT Services | No.1 Amazon Seller Services Partner",
    template: "%s | Fakhri IT Services"
  },
  description: "Your trusted Amazon seller services partner since 2016. Expert account management, FBA operations, PPC advertising, and growth strategies for Amazon sellers.",
  keywords: ["Amazon seller services", "Amazon account management", "FBA services", "Amazon PPC", "Amazon consulting"],
  authors: [{ name: "Fakhri IT Services" }],
  creator: "Fakhri IT Services",
  publisher: "Fakhri IT Services",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Fakhri IT Services | No.1 Amazon Seller Services Partner",
    description: "Your trusted Amazon seller services partner since 2016.",
    url: 'https://www.fakhriitservices.com',
    siteName: "Fakhri IT Services",
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body suppressHydrationWarning={true}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
