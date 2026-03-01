import { getJobs } from '@/lib/actions/content';
import CareerContent from '@/components/career/CareerContent';

export const metadata = {
    title: "Careers | Fakhri IT Services - Join Our Amazon Agency Team",
    description: "Build your career with Fakhri IT Services. Explore current job openings for account managers, PPC specialists, content creators, and more.",
    keywords: "Amazon agency jobs, e-commerce careers, work at Fakhri IT Services",
};

export default async function CareerPage() {
    const jobs = await getJobs();
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Careers at Fakhri IT Services',
        description: 'Job openings and career opportunities.',
        url: 'https://www.fakhriitservices.com/career',
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <CareerContent jobs={jobs} />
        </>
    );
}
