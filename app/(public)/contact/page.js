import { getCompanyData } from '@/lib/actions/content';
import ContactContent from '@/components/contact/ContactContent';

export const metadata = {
    title: "Contact Us | Fakhri IT Services - Get a Free Consultation",
    description: "Contact our team for a free Amazon account audit and consultation. We're here to help you scale your Amazon business.",
    keywords: "Contact Fakhri IT Services, Amazon consultant contact, free Amazon audit",
};

export default async function ContactPage() {
    const company = await getCompanyData();
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'ContactPage',
        name: 'Contact Fakhri IT Services',
        description: 'Get in touch for Amazon seller services.',
        url: 'https://www.fakhriitservices.com/contact',
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <ContactContent company={company} />
        </>
    );
}
