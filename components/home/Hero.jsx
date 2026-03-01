'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, Shield, Award, Check, Clock } from 'lucide-react';
import { ContactDialog } from '@/components/dialogs/ContactDialog';

const sellerImages = [
    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=60",
];

export default function Hero({ company }) {
    const stats = company?.stats || [
        { value: "500+", label: "Sellers Trusted" },
        { value: "8+", label: "Years Experience" },
        { value: "25+", label: "Expert Team" },
        { value: "$50M+", label: "Client Revenue" }
    ];

    return (
        <section className="relative min-h-[75vh] flex items-center overflow-hidden bg-background">
            {/* Background Elements */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
            <div className="absolute inset-0 bg-gradient-to-b from-secondary/30 via-transparent to-background" />

            {/* Animated Blobs */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3],
                }}
                transition={{ duration: 8, repeat: Infinity }}
                className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl"
            />
            <motion.div
                animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.3, 0.4, 0.3],
                }}
                transition={{ duration: 6, repeat: Infinity, delay: 1 }}
                className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl"
            />

            <div className="container-custom relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Content */}
                    <div>
                        {/* Badges */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="flex flex-wrap gap-3 mb-6"
                        >
                            <Link href="https://sellercentral.amazon.in/gspn/provider-details/Account%20Management/a385509a-38a1-4f6e-91e8-bfe4eb3f85ed?ref_=sc_gspn_blst_bdt-a385509a&localeSelection=en_US&sellFrom=IN&sellIn=IN" target="_blank">
                                <span className="badge-primary flex items-center gap-1.5 border border-primary/20 bg-primary/5 backdrop-blur-sm hover:bg-primary/10 transition-colors cursor-pointer group/badge">
                                    <Shield className="w-3.5 h-3.5 text-primary group-hover/badge:text-amber-500 transition-colors" />
                                    Amazon
                                    <span className="bg-gradient-to-br from-amber-600 via-yellow-500 to-amber-600 bg-clip-text text-transparent font-extrabold tracking-wide drop-shadow-sm bg-primary">
                                        GOLD
                                    </span>
                                    Partner
                                </span>
                            </Link>

                            <span className="badge-outline">Since {company?.established || '2016'}</span>
                        </motion.div>

                        {/* Headline */}
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="heading-xl mb-6"
                        >
                            Your <span className="text-primary">No.1 Growth Partner</span> for Amazon Success
                        </motion.h1>

                        {/* Description */}
                        <motion.p
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="body-lg mb-8 max-w-xl"
                        >
                            {company?.description || 'Your trusted Amazon seller services partner since 2016. Expert account management, FBA operations, PPC advertising, and growth strategies for Amazon sellers.'}
                        </motion.p>

                        {/* CTAs */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="flex flex-wrap gap-4"
                        >
                            <ContactDialog
                                trigger={
                                    <button suppressHydrationWarning className="btn-primary group inline-flex items-center">
                                        Start Your Journey
                                        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                }
                            />
                            <Link href="/services" className="btn-outline">
                                Explore Services
                            </Link>
                        </motion.div>


                    </div>

                    {/* Visual */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative hidden lg:block"
                    >
                        <div className="relative">
                            {/* Main Visual Card */}
                            <div className="relative bg-gradient-to-br from-primary to-brand-red-light rounded-3xl p-10 text-primary-foreground overflow-hidden">
                                <div className="absolute inset-0 opacity-10">
                                    <div className="absolute top-4 right-4 w-32 h-32 border border-primary-foreground/20 rounded-full" />
                                    <div className="absolute bottom-8 left-8 w-24 h-24 border border-primary-foreground/20 rounded-full" />
                                </div>

                                <div className="relative z-10">
                                    <Award className="w-16 h-16 mb-6" />
                                    <h3 className="text-2xl font-poppins font-bold mb-3">
                                        Trusted by {stats[0].value} Sellers
                                    </h3>
                                    <p className="text-primary-foreground/80 mb-6">
                                        We&apos;ve helped generate over {stats[3]?.value || '$50M+'} in revenue for our clients across multiple Amazon marketplaces.
                                    </p>
                                    <div className="flex -space-x-2">
                                        {sellerImages.map((src, i) => (
                                            <Link
                                                href="#testimonials"
                                                key={i}
                                                className="w-10 h-10 rounded-full bg-background border-2 border-primary flex items-center justify-center overflow-hidden relative hover:z-10 hover:scale-110 transition-all duration-300"
                                            >
                                                <Image
                                                    src={src}
                                                    alt={`Seller ${i + 1}`}
                                                    fill
                                                    className="object-cover"
                                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                />
                                            </Link>
                                        ))}
                                        <div className="w-10 h-10 rounded-full bg-primary-foreground text-primary border-2 border-primary flex items-center justify-center">
                                            <span className="text-xs font-semibold">+</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Floating Cards */}
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute left-1/2 -top-[30px] bg-card rounded-xl p-4 shadow-lg border border-border"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                                        <Check className="w-5 h-5 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-sm">Sales Increased</p>
                                        <p className="text-green-600 text-xs font-medium">+127% this month</p>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                animate={{ y: [0, 10, 0] }}
                                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute -right-4 bottom-[30px] bg-card rounded-xl p-4 shadow-lg border border-border"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                        <Clock className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-sm">Response Time</p>
                                        <p className="text-primary text-xs font-medium">&lt; 2 hours</p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
