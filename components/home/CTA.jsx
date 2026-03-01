'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ScrollReveal } from '@/components/animations/ScrollReveal';
import { ContactDialog } from '@/components/dialogs/ContactDialog';

export default function CTA({ company }) {
    const sellersCount = company?.stats?.[0]?.value || "500+";

    return (
        <section className="section-padding">
            <div className="container-custom">
                <ScrollReveal>
                    <div className="relative bg-gradient-to-br from-primary to-brand-red-light rounded-3xl p-12 md:p-16 text-primary-foreground overflow-hidden">
                        {/* Background Pattern */}
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute top-0 right-0 w-64 h-64 border border-primary-foreground/30 rounded-full" />
                            <div className="absolute bottom-0 left-1/4 w-48 h-48 border border-primary-foreground/30 rounded-full" />
                        </div>

                        <div className="relative z-10 max-w-3xl mx-auto text-center">
                            <h2 className="heading-lg mb-6">
                                Ready to Accelerate Your Amazon Growth?
                            </h2>
                            <p className="text-primary-foreground/90 text-lg mb-8 max-w-2xl mx-auto">
                                Join {sellersCount} successful sellers who trust Fakhri IT Services
                                for their Amazon success. Get started with a free consultation today.
                            </p>
                            <div className="flex flex-wrap justify-center gap-4">
                                <ContactDialog
                                    trigger={
                                        <button
                                            suppressHydrationWarning
                                            className="inline-flex items-center justify-center px-8 py-4 bg-background text-primary font-poppins font-semibold rounded-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5"
                                        >
                                            Get Free Consultation
                                            <ArrowRight className="ml-2 w-5 h-5" />
                                        </button>
                                    }
                                />
                                <Link
                                    href="/pricing"
                                    className="inline-flex items-center justify-center px-8 py-4 border-2 border-primary-foreground/30 text-primary-foreground font-poppins font-semibold rounded-lg transition-all duration-300 hover:bg-primary-foreground/10"
                                >
                                    View Pricing
                                </Link>
                            </div>
                        </div>
                    </div>
                </ScrollReveal>
            </div>
        </section>
    );
}
