'use client';

import { ScrollReveal } from '@/components/animations/ScrollReveal';
import { motion } from 'framer-motion';
import { Shield, FileText, Clock, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function LegalPageContent({ page }) {
    if (!page) return null;

    const Icon = page.slug === 'privacy-policy' ? Shield : page.slug === 'refund-policy' ? Clock : FileText;

    return (
        <div className="min-h-screen pb-20">
            {/* Simple Breadcrumb */}
            <div className="bg-secondary/30 py-4 border-b">
                <div className="container-custom">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                        <ChevronRight className="h-4 w-4" />
                        <span className="text-foreground font-medium">{page.title}</span>
                    </div>
                </div>
            </div>

            {/* Title Section */}
            <section className="py-16 md:py-24 bg-gradient-to-b from-secondary/50 to-background overflow-hidden relative">
                <div className="container-custom relative z-10">
                    <ScrollReveal>
                        <div className="max-w-3xl">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-bold mb-6"
                            >
                                <Icon className="h-4 w-4" />
                                {page.slug === 'privacy-policy' ? 'Public Document' : page.slug === 'refund-policy' ? 'Policy' : 'Legal Agreement'}
                            </motion.div>
                            <h1 className="heading-xl mb-6">
                                {page.title}
                            </h1>
                            <div className="flex items-center gap-4 text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-primary" />
                                    <span>Last Updated: {new Date(page.lastUpdated).toLocaleDateString('en-US', {
                                        month: 'long',
                                        day: 'numeric',
                                        year: 'numeric'
                                    })}</span>
                                </div>
                            </div>
                        </div>
                    </ScrollReveal>
                </div>

                {/* Background Decoration */}
                <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl opacity-50" />
            </section>

            {/* Content Section */}
            <section className="container-custom mt-[-60px] relative z-20">
                <ScrollReveal>
                    <div className="bg-background border border-border rounded-3xl p-8 md:p-16 shadow-xl shadow-primary/5">
                        <article className="prose prose-lg max-w-none">
                            <div
                                className="legal-content text-foreground/80 leading-relaxed 
                                    [&>h2]:text-foreground [&>h2]:heading-md [&>h2]:mt-12 [&>h2]:mb-6 
                                    [&>h3]:text-foreground [&>h3]:heading-sm [&>h3]:mt-8 [&>h3]:mb-4
                                    [&>p]:mb-6 [&>ul]:mb-8 [&>ul]:list-disc [&>ul]:pl-6
                                    [&>ol]:mb-8 [&>ol]:list-decimal [&>ol]:pl-6
                                    [&>li]:mb-2"
                                dangerouslySetInnerHTML={{ __html: page.content }}
                            />
                        </article>

                        {/* Footer Note */}
                        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-6">
                            <p className="text-sm text-muted-foreground italic">
                                If you have any questions about this {page.title.toLowerCase()}, please contact us at <a href="mailto:info@fakhriit.com" className="text-primary font-bold hover:underline">info@fakhriit.com</a>
                            </p>
                            <Link href="/contact" className="btn-primary whitespace-nowrap">
                                Contact Legal Team
                            </Link>
                        </div>
                    </div>
                </ScrollReveal>
            </section>
        </div>
    );
}
