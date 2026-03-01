import { getPricingPlans, getFAQs, getCatalogServices } from '@/lib/actions/content';
import PricingContent from '@/components/pricing/PricingContent';


export const metadata = {
    title: "Pricing Plans | Fakhri IT Services - Transparent Amazon Service Pricing",
    description: "Flexible pricing plans for Amazon sellers. Choose from Elite, Premium, and Platinum packages designed to scale your Amazon business.",
    keywords: ["Amazon services pricing", "seller services cost", "Amazon management packages", "FBA fees", "PPC management cost"],
    openGraph: {
        title: "Pricing Plans | Fakhri IT Services",
        description: "Transparent pricing for Amazon success.",
        url: 'https://www.fakhriitservices.com/pricing',
        siteName: 'Fakhri IT Services',
        locale: 'en_US',
        type: 'website',
    },
};

export default async function PricingPage() {
    const [plans, faqs, servicesRaw] = await Promise.all([
        getPricingPlans(),
        getFAQs('pricing'),
        getCatalogServices()
    ]);

    // Format services for the add-ons list based on Standard Price
    const services = servicesRaw
        .filter(srv => srv.pricing && srv.pricing.standard && srv.pricing.standard.price > 0)
        .map(srv => ({
            id: srv._id,
            name: srv.name,
            category: srv.category,
            price: srv.pricing.standard.price
        }));

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'PriceSpecification',
        name: 'Amazon Seller Service Plans',
        description: 'Comprehensive plans for Amazon sellers including Account Management, PPC, and FBA.',
        priceCurrency: 'INR',
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <PricingContent plans={plans} faqs={faqs} services={services} />
        </>
    );
}
