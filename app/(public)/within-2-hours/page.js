import Within2HoursContent from '@/components/within-2-hours/Within2HoursContent';
import { getCatalogServices, getCompanyData } from '@/lib/actions/content';
export const metadata = {
    title: "Within 2 Hours Support | Fakhri IT Services - Priority Assistance",
    description: "Get urgent Amazon seller support within 2 hours. Priority handling for account issues, listing problems, and critical business needs.",
    keywords: "urgent Amazon support, priority seller help, quick Amazon assistance",
};

export default async function Within2HoursPage() {
    const [services, company] = await Promise.all([
        getCatalogServices(),
        getCompanyData()
    ]);

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: 'Within 2 Hours Priority Support',
        description: 'Urgent Amazon seller support service.',
        provider: {
            '@type': 'Organization',
            name: 'Fakhri IT Services',
        },
        serviceType: 'Priority Support',
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <Within2HoursContent initialServices={services} initialCompany={company} />
        </>
    );
}
