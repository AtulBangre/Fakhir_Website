import BlogContent from '@/components/blog/BlogContent';
import { getBlogPosts, getBlogCategories } from '@/lib/actions/blog';

export const metadata = {
    title: "Blog | Fakhri IT Services - Amazon Seller Insights & Tips",
    description: "Expert insights, tips, and strategies for Amazon sellers. Stay updated with the latest marketplace trends and growth tactics.",
    keywords: ["Amazon seller blog", "e-commerce tips", "Amazon strategies", "FBA guides", "PPC tips"],
    openGraph: {
        title: "Blog | Fakhri IT Services",
        description: "Expert insights for Amazon sellers.",
        url: 'https://www.fakhriitservices.com/blog',
        siteName: 'Fakhri IT Services',
        locale: 'en_US',
        type: 'website',
    },
};

export default async function BlogPage() {
    const [initialCategories, initialPostsData] = await Promise.all([
        getBlogCategories(),
        getBlogPosts({ page: 1, limit: 6 })
    ]);

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Blog',
        name: 'Fakhri IT Services Blog',
        description: 'Insights and strategies for Amazon sellers.',
        url: 'https://www.fakhriitservices.com/blog',
        publisher: {
            '@type': 'Organization',
            name: 'Fakhri IT Services',
            logo: {
                '@type': 'ImageObject',
                url: 'https://www.fakhriitservices.com/logo.png'
            }
        }
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <BlogContent initialCategories={initialCategories} initialPostsData={initialPostsData} />
        </>
    );
}
