import { getCompanyData, getTeamMembers, getMilestones } from '@/lib/actions/content';
import AboutContent from '@/components/about/AboutContent';

export const metadata = {
    title: "About Us | Fakhri IT Services - Your Amazon Growth Partner",
    description: "Learn about Fakhri IT Services, a leading Amazon agency helping brands scale since 2016. Meet our expert team of account managers, creative designers, and strategists.",
    keywords: "About Fakhri IT Services, Amazon agency team, Amazon seller consultants, e-commerce experts",
};

export default async function AboutPage() {
    const [company, team, milestones] = await Promise.all([
        getCompanyData(),
        getTeamMembers(),
        getMilestones()
    ]);

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'AboutPage',
        name: 'About Fakhri IT Services',
        description: 'Your trusted Amazon seller services partner since 2016.',
        mainEntity: {
            '@type': 'Organization',
            name: 'Fakhri IT Services',
            foundingDate: '2016',
            url: 'https://www.fakhriitservices.com',
        }
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <AboutContent company={company} team={team} initialMilestones={milestones} />
        </>
    );
}
