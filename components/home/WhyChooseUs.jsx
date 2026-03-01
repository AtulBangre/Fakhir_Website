'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { ScrollReveal } from '@/components/animations/ScrollReveal';

export default function WhyChooseUs({ company }) {
    const stats = company?.stats || [
        { value: "500+", label: "Sellers Trusted" },
        { value: "8+", label: "Years Experience" },
        { value: "25+", label: "Expert Team" }
    ];

    return (
        <section className="section-padding bg-secondary/30">
            <div className="container-custom">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <ScrollReveal direction="left">
                        <div>
                            <span className="badge-primary mb-4">Why Choose Us</span>
                            <h2 className="heading-lg mb-6">
                                We&apos;re Not Just Service Providers, We&apos;re Your <span className="text-primary">Growth Partners</span>
                            </h2>
                            <p className="body-md mb-8">
                                With over {stats[1].value} of experience and a team of {stats[2].value} Amazon experts,
                                we understand what it takes to succeed on Amazon. We treat your business
                                as our own and work relentlessly to achieve your goals.
                            </p>

                            <ul className="space-y-4">
                                {[
                                    "Certified Amazon SPN Partner with proven track record",
                                    "Dedicated account managers for personalized support",
                                    "Transparent reporting and clear communication",
                                    "Results-driven strategies tailored to your brand",
                                ].map((item, index) => (
                                    <li key={index} className="flex items-start gap-3">
                                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <Check className="w-3.5 h-3.5 text-primary" />
                                        </div>
                                        <span className="text-foreground">{item}</span>
                                    </li>
                                ))}
                            </ul>

                            <div className="mt-8">
                                <Link href="/contact" className="btn-primary">
                                    Get Free Consultation
                                </Link>
                            </div>
                        </div>
                    </ScrollReveal>

                    <ScrollReveal direction="right">
                        <div className="relative h-[400px] lg:h-[500px] rounded-3xl overflow-hidden shadow-2xl group">
                            <Image
                                src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop"
                                alt="Fakhri IT Services Team"
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                            <div className="absolute bottom-6 left-6 right-6 text-white bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20">
                                <p className="font-poppins font-semibold text-lg mb-1">Trusted by {stats[0].value} Sellers</p>
                                <p className="text-white/80 text-sm">Join the network of successful Amazon brands.</p>
                            </div>
                        </div>
                    </ScrollReveal>
                </div>
            </div>
        </section>
    );
}
