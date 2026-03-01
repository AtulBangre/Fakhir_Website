import Hero from '@/components/home/Hero';
import Partners from '@/components/home/Partners';
import TrustBadges from '@/components/home/TrustBadges';
import ServicesPreview from '@/components/home/ServicesPreview';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import CTA from '@/components/home/CTA';
import Testimonials from '@/components/home/Testimonials';
import FaQ from '@/components/home/FaQ';
import { getServices, getTestimonials, getFAQs, getCompanyData } from '@/lib/actions/content';


export const metadata = {
  title: "Fakhri IT Services | No.1 Amazon Seller Services Partner",
  description: "Your trusted Amazon seller services partner since 2016. Expert account management, FBA operations, PPC advertising, and growth strategies for Amazon sellers.",
  keywords: ["Amazon seller services", "Amazon account management", "FBA services", "Amazon PPC", "Amazon consulting", "e-commerce agency"],
  openGraph: {
    title: "Fakhri IT Services | No.1 Amazon Seller Services Partner",
    description: "Your trusted Amazon seller services partner since 2016.",
    url: 'https://www.fakhriitservices.com',
    siteName: 'Fakhri IT Services',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Fakhri IT Services | No.1 Amazon Seller Services Partner",
    description: "Expert Amazon seller solutions to grow your business.",
  }
};

export default async function Home() {
  const [services, testimonials, faqs, company] = await Promise.all([
    getServices(),
    getTestimonials(),
    getFAQs(),
    getCompanyData()
  ]);

  const homeFAQs = faqs.filter(f => f.categories && f.categories.home);


  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Fakhri IT Services',
    url: 'https://www.fakhriitservices.com',
    logo: 'https://www.fakhriitservices.com/logo.png',
    sameAs: [
      'https://www.facebook.com/fakhriitservices',
      'https://twitter.com/fakhriitservices',
      'https://www.linkedin.com/company/fakhri-it-services',
      'https://www.instagram.com/fakhriitservices'
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+91-1234567890',
      contactType: 'customer service'
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero company={company} />
      <Partners company={company} />
      <TrustBadges company={company} />
      <ServicesPreview services={services} />
      <WhyChooseUs company={company} />
      <CTA />
      <Testimonials testimonials={testimonials} />
      <FaQ data={homeFAQs} />
    </>
  );
}
