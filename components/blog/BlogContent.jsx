'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowRight, Search, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { ScrollReveal, StaggerContainer, StaggerItem } from '@/components/animations/ScrollReveal';
import { getBlogPosts, getBlogCategories } from '@/lib/actions/blog';

export default function BlogContent({ initialCategories = [], initialPostsData = {} }) {
    const defaultCategories = [
        { name: "All", slug: "all" },
        ...initialCategories.map(cat => ({
            name: cat,
            slug: cat.toLowerCase().replace(/\s+/g, '-')
        }))
    ];

    const [posts, setPosts] = useState(initialPostsData.posts || []);
    const [categories, setCategories] = useState(defaultCategories);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(initialPostsData.pages || 0);
    const [totalPosts, setTotalPosts] = useState(initialPostsData.total || 0);
    const [loading, setLoading] = useState(false); // Initially false!

    const limit = 6;

    // Fallback if categories are not loaded initially.
    useEffect(() => {
        if (categories.length === 1 && categories[0].name === "All") {
            async function fetchCategories() {
                const cats = await getBlogCategories();
                setCategories([
                    { name: "All", slug: "all" },
                    ...cats.map(cat => ({
                        name: cat,
                        slug: cat.toLowerCase().replace(/\s+/g, '-')
                    }))
                ]);
            }
            fetchCategories();
        }
    }, [categories]);

    useEffect(() => {
        // Skip fetch on initial render since SSR provided the data
        if (page === 1 && selectedCategory === 'All' && searchQuery === '') return;

        async function loadPosts() {
            setLoading(true);
            const result = await getBlogPosts({
                page,
                limit,
                search: searchQuery,
                category: selectedCategory === 'All' ? '' : selectedCategory
            });

            if (result && !result.error) {
                setPosts(result.posts);
                setTotalPages(result.pages);
                setTotalPosts(result.total);
            }
            setLoading(false);
        }

        const debounce = setTimeout(loadPosts, 300);
        return () => clearTimeout(debounce);
    }, [page, selectedCategory, searchQuery]);

    const handleCategoryChange = (cat) => {
        setSelectedCategory(cat);
        setPage(1);
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setPage(1);
    };

    return (
        <>
            {/* Hero Section */}
            <section className="section-padding bg-gradient-to-b from-secondary/50 to-background overflow-hidden">
                <div className="container-custom">
                    <ScrollReveal>
                        <div className="text-center max-w-3xl mx-auto">
                            <span className="badge-primary mb-4">Blog</span>
                            <h1 className="heading-xl mb-6">
                                Amazon Seller <span className="text-primary">Insights</span> & Tips
                            </h1>
                            <p className="body-lg mb-8 text-muted-foreground">
                                Expert insights, strategies, and tips to help you grow your Amazon business.
                                Stay updated with the latest marketplace trends.
                            </p>

                            {/* Search bar */}
                            <div className="relative max-w-xl mx-auto">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <input
                                    type="text"
                                    placeholder="Search articles..."
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                    className="w-full pl-12 pr-4 py-4 bg-background border border-border rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-sm"
                                />
                            </div>
                        </div>
                    </ScrollReveal>
                </div>
            </section>

            {/* Category Filter */}
            <section className="sticky top-16 md:top-20 z-30 bg-background/95 backdrop-blur-lg border-b border-border py-4 shadow-sm">
                <div className="container-custom sm:flex sm:items-center sm:justify-between">
                    <div className="flex flex-wrap justify-center sm:justify-start gap-2 mb-4 sm:mb-0">
                        {categories.map((category) => (
                            <button
                                key={category.name}
                                onClick={() => handleCategoryChange(category.name)}
                                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${selectedCategory === category.name
                                    ? 'bg-primary text-primary-foreground shadow-md'
                                    : 'text-muted-foreground hover:text-primary hover:bg-primary/10 border border-border'
                                    }`}
                            >
                                {category.name}
                            </button>
                        ))}
                    </div>
                    {/* Results Counter */}
                    <div className="text-center sm:text-right">
                        <p className="text-sm text-muted-foreground">
                            {loading ? (
                                <span className="flex items-center gap-1 justify-center sm:justify-end">
                                    <Loader2 className="w-3 h-3 animate-spin" /> Updating...
                                </span>
                            ) : (
                                <>
                                    Showing <span className="font-semibold text-foreground">{totalPosts}</span> {totalPosts === 1 ? 'article' : 'articles'}
                                </>
                            )}
                        </p>
                    </div>
                </div>
            </section>

            {/* Blog Posts Grid */}
            <section className="section-padding min-h-[60vh]">
                <div className="container-custom">
                    {loading && posts.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
                            <p className="text-muted-foreground">Loading expert insights...</p>
                        </div>
                    ) : (
                        <>
                            <StaggerContainer key={`${selectedCategory}-${page}`} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {posts.map((post) => (
                                    <StaggerItem key={post._id}>
                                        <motion.article
                                            className="card-premium h-full flex flex-col overflow-hidden group"
                                            whileHover={{ y: -5 }}
                                        >
                                            {/* Thumbnail Image */}
                                            <Link href={`/blog/${post.slug}`} className="block mb-4">
                                                <div className="relative w-full h-52 rounded-xl overflow-hidden bg-muted">
                                                    <Image
                                                        src={post.thumbnail || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800'}
                                                        alt={post.title}
                                                        fill
                                                        unoptimized={post.thumbnail?.startsWith('http')}
                                                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                                                        <span className="text-white text-xs font-medium flex items-center">
                                                            Read Article <ArrowRight className="ml-1 w-3 h-3" />
                                                        </span>
                                                    </div>
                                                </div>
                                            </Link>

                                            {/* Category Badge */}
                                            <div className="mb-4">
                                                <span className="badge-primary text-[10px] uppercase tracking-wider font-bold">{post.category}</span>
                                            </div>

                                            {/* Title */}
                                            <h2 className="heading-sm mb-3 group-hover:text-primary transition-colors line-clamp-2">
                                                <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                                            </h2>

                                            {/* Excerpt */}
                                            <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-1 line-clamp-3">
                                                {post.excerpt}
                                            </p>

                                            {/* Meta */}
                                            <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4 pt-4 border-t border-border">
                                                <div className="flex items-center gap-1.5">
                                                    <Calendar className="w-3.5 h-3.5 text-primary" />
                                                    {post.publishDate ? new Date(post.publishDate).toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric'
                                                    }) : 'Recently Published'}
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <Clock className="w-3.5 h-3.5 text-primary" />
                                                    {post.readTime || '5 min read'}
                                                </div>
                                            </div>

                                            {/* Read More */}
                                            <Link
                                                href={`/blog/${post.slug}`}
                                                className="inline-flex items-center text-primary font-bold text-sm"
                                            >
                                                <span>Full Story</span>
                                                <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                            </Link>
                                        </motion.article>
                                    </StaggerItem>
                                ))}
                            </StaggerContainer>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="mt-16 flex justify-center items-center gap-4">
                                    <button
                                        onClick={() => setPage(p => Math.max(1, p - 1))}
                                        disabled={page === 1}
                                        className="p-2 rounded-lg border border-border hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                                    >
                                        <ChevronLeft className="w-5 h-5" />
                                    </button>

                                    <div className="flex items-center gap-2">
                                        {[...Array(totalPages)].map((_, i) => (
                                            <button
                                                key={i}
                                                onClick={() => setPage(i + 1)}
                                                className={`w-10 h-10 rounded-lg text-sm font-bold transition-all ${page === i + 1
                                                    ? 'bg-primary text-primary-foreground shadow-lg scale-110'
                                                    : 'hover:bg-secondary text-muted-foreground'
                                                    }`}
                                            >
                                                {i + 1}
                                            </button>
                                        ))}
                                    </div>

                                    <button
                                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                        disabled={page === totalPages}
                                        className="p-2 rounded-lg border border-border hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                                    >
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                </div>
                            )}

                            {posts.length === 0 && !loading && (
                                <div className="text-center py-20 bg-secondary/20 rounded-3xl border border-dashed border-border">
                                    <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                                    <p className="text-muted-foreground text-lg mb-2 font-medium">
                                        No articles matched your search.
                                    </p>
                                    <button
                                        onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                                        className="text-primary hover:underline font-bold"
                                    >
                                        Clear all filters
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </section>
        </>
    );
}
