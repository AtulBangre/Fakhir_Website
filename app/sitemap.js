
import { getBlogPosts } from '@/lib/actions/blog';

export default async function sitemap() {
    const baseUrl = 'https://www.fakhriitservices.com'; // Replace with actual domain

    // Static routes
    const routes = [
        '',
        '/about',
        '/services',
        '/contact',
        '/career',
        '/blog',
        '/pricing',
        '/within-2-hours',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: route === '' ? 1 : 0.8,
    }));

    // Dynamic Blog Routes
    const { posts } = await getBlogPosts({ limit: 1000 }); // Fetch all posts
    const blogRoutes = posts.map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: new Date(post.updatedAt || post.createdAt),
        changeFrequency: 'monthly',
        priority: 0.6,
    }));

    return [...routes, ...blogRoutes];
}
