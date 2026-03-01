import { notFound } from 'next/navigation';
import { getBlogPostBySlug, getBlogPosts } from '@/lib/actions/blog';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Clock, ArrowLeft, Tag } from 'lucide-react';
import { ScrollReveal } from '@/components/animations/ScrollReveal';
import ShareButtons from '@/components/blog/ShareButtons';

export async function generateStaticParams() {
    const { posts } = await getBlogPosts({ limit: 100 });
    return posts.map((post) => ({
        slug: post.slug,
    }));
}

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const post = await getBlogPostBySlug(slug);

    if (!post) {
        return {
            title: 'Post Not Found',
        };
    }

    return {
        title: `${post.title} | Fakhri IT Services`,
        description: post.excerpt,
    };
}

export default async function BlogPostPage({ params }) {
    const { slug } = await params;
    const post = await getBlogPostBySlug(slug);

    if (!post) {
        notFound();
    }

    // Fetch related posts
    const { posts: relatedPosts } = await getBlogPosts({
        limit: 3,
        category: post.category
    });

    const filteredRelated = relatedPosts.filter(p => p._id !== post._id);

    return (
        <>
            {/* Hero Section with Thumbnail */}
            <section className="section-padding bg-gradient-to-b from-secondary/50 to-background">
                <div className="container-custom">
                    <ScrollReveal>
                        {/* Back Button */}
                        <Link
                            href="/blog"
                            className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors mb-8 group"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                            Back to Blog
                        </Link>

                        {/* Category Badge */}
                        <div className="mb-4">
                            <span className="badge-primary">{post.category}</span>
                        </div>

                        {/* Title */}
                        <h1 className="heading-xl mb-6 max-w-4xl">
                            {post.title}
                        </h1>

                        {/* Meta Information */}
                        <div className="flex flex-wrap items-center gap-6 text-muted-foreground mb-8">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <span className="text-sm">
                                    {new Date(post.publishDate).toLocaleDateString('en-US', {
                                        month: 'long',
                                        day: 'numeric',
                                        year: 'numeric'
                                    })}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                <span className="text-sm">{post.readTime}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm">By {post.author.name}</span>
                            </div>
                        </div>

                        {/* Thumbnail Image */}
                        <div className="relative w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden bg-muted">
                            <Image
                                src={post.thumbnail || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800'}
                                alt={post.title}
                                fill
                                unoptimized={post.thumbnail?.startsWith('http')}
                                className="object-cover"
                                priority
                            />
                        </div>
                    </ScrollReveal>
                </div>
            </section>

            {/* Article Content */}
            <section className="section-padding">
                <div className="container-custom">
                    <div className="max-w-4xl mx-auto">
                        <ScrollReveal>
                            <article className="prose prose-lg max-w-none">
                                <div
                                    className="text-muted-foreground leading-relaxed [&>h2]:text-foreground [&>h2]:heading-md [&>h2]:mt-10 [&>h2]:mb-4 [&>p]:mb-6"
                                    dangerouslySetInnerHTML={{ __html: post.content }}
                                />
                            </article>

                            {/* Tags */}
                            {post.tags && post.tags.length > 0 && (
                                <div className="mt-12 pt-8 border-t border-border">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <Tag className="w-4 h-4 text-muted-foreground" />
                                        {post.tags.map((tag, index) => (
                                            <span
                                                key={index}
                                                className="px-3 py-1 text-sm bg-secondary/50 text-foreground rounded-full"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Share Section */}
                            <div className="mt-8 p-6 bg-card rounded-xl border border-border">
                                <ShareButtons title={post.title} slug={post.slug} />
                            </div>

                            {/* CTA */}
                            <div className="mt-12 p-8 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl border border-primary/20">
                                <div className="text-center">
                                    <h3 className="heading-md mb-3">
                                        Need Help with Your Amazon Business?
                                    </h3>
                                    <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                                        Our team of Amazon experts is here to help you implement these strategies
                                        and grow your business.
                                    </p>
                                    <Link
                                        href="/contact"
                                        className="btn-primary"
                                    >
                                        Get in Touch
                                    </Link>
                                </div>
                            </div>
                        </ScrollReveal>
                    </div>
                </div>
            </section>

            {/* Related Posts */}
            {filteredRelated.length > 0 && (
                <section className="section-padding bg-secondary/30">
                    <div className="container-custom">
                        <ScrollReveal>
                            <h2 className="heading-lg mb-8 text-center">Related Articles</h2>
                            <div className="grid md:grid-cols-3 gap-8">
                                {filteredRelated.map((relatedPost) => (
                                    <Link
                                        key={relatedPost._id}
                                        href={`/blog/${relatedPost.slug}`}
                                        className="card-premium group"
                                    >
                                        <div className="relative w-full h-48 rounded-lg overflow-hidden mb-4 bg-muted">
                                            <Image
                                                src={relatedPost.thumbnail || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800'}
                                                alt={relatedPost.title}
                                                fill
                                                unoptimized={relatedPost.thumbnail?.startsWith('http')}
                                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        </div>
                                        <span className="badge-primary text-xs mb-2">
                                            {relatedPost.category}
                                        </span>
                                        <h3 className="font-poppins font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                                            {relatedPost.title}
                                        </h3>
                                        <p className="text-sm text-muted-foreground line-clamp-2">
                                            {relatedPost.excerpt}
                                        </p>
                                    </Link>
                                ))}
                            </div>
                        </ScrollReveal>
                    </div>
                </section>
            )}
        </>
    );
}
