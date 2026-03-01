'use client';

import React, { useState, useMemo, useRef } from 'react';
import { ScrollReveal, StaggerContainer, StaggerItem } from '@/components/animations/ScrollReveal';
import CompanyTimeline from './CompanyTimeline';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Target, Zap, BarChart, Shield, Trophy, ArrowRight, Quote, Search, Filter } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { ContactDialog } from '@/components/dialogs/ContactDialog';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from "@/lib/utils";

const iconMap = {
    Users,
    Target,
    Zap,
    BarChart,
    Shield,
    Trophy
};

const whyChooseUs = [
    {
        title: "Amazon SPN & Affiliate Partner",
        description: "Officially recognized by Amazon for our expertise and service quality.",
        icon: "Shield"
    },
    {
        title: "Dedicated Account Managers",
        description: "Personalized attention with a single point of contact for your business.",
        icon: "Users"
    },
    {
        title: "Creative A+ & EBC Experts",
        description: "Award-winning design team that transforms listings into brand experiences.",
        icon: "Zap"
    },
    {
        title: "Performance-Driven Ads",
        description: "ROI-focused PPC campaigns that minimize ACOS and maximize sales.",
        icon: "Target"
    },
    {
        title: "Transparent Reporting",
        description: "Clear, actionable insights delivered weekly so you always know your standing.",
        icon: "BarChart"
    },
    {
        title: "Long-Term Growth Focus",
        description: "We don't just chase quick wins; we build sustainable brands.",
        icon: "Trophy"
    }
];

export default function AboutContent({ team = [], company = null, initialMilestones = [] }) {
    const teamCategories = useMemo(() => {
        const categories = [...new Set(team.map(m => m.category))];
        return categories.filter(Boolean);
    }, [team]);



    return (
        <>
            {/* Hero Section */}
            <section className="section-padding pt-32 md:pt-40 bg-gradient-to-b from-primary/5 to-background overflow-hidden relative">
                <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-primary/5 blur-3xl rounded-full -translate-x-1/2 translate-y-1/2" />

                <div className="container-custom relative z-10">
                    <ScrollReveal>
                        <div className="text-center max-w-4xl mx-auto">
                            <span className="badge-primary mb-4">About Fakhri IT Services</span>
                            <h1 className="heading-xl mb-6">
                                {company?.tagline || "We Are Your Growth Partners in the Amazon Marketplace"}
                            </h1>
                            <p className="body-lg mb-12">
                                {company?.description || "From account credentials to bestseller badges, we handle every aspect of your Amazon journey with precision and passion."}
                            </p>
                        </div>
                    </ScrollReveal>

                    <ScrollReveal delay={0.2}>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                            {company?.stats?.slice(0, 3).map((stat, index) => (
                                <div key={index} className="card-premium text-center p-8 border border-border">
                                    <p className="text-4xl md:text-5xl font-bold text-primary mb-2 font-poppins">
                                        {stat.value}
                                    </p>
                                    <p className="text-muted-foreground font-medium">
                                        {stat.label}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </ScrollReveal>
                </div>
            </section>

            {/* Company Overview */}
            <section className="section-padding">
                <div className="container-custom">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <ScrollReveal direction="left">
                            <div className="relative rounded-3xl overflow-hidden aspect-[4/3] shadow-2xl">
                                <Image
                                    src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop"
                                    alt="Office Culture"
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                                    <div className="text-white">
                                        <Quote className="w-8 h-8 mb-4 text-white/80" />
                                        <p className="text-lg font-medium italic">
                                            &ldquo;Our mission is to empower Amazon sellers with expert services that drive sustainable growth.&rdquo;
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </ScrollReveal>

                        <ScrollReveal direction="right">
                            <div>
                                <h2 className="heading-lg mb-6">Amazon-First Approach to Digital Commerce</h2>
                                <p className="body-md mb-8">
                                    {company?.story?.content || "Your trusted partner for Amazon success. We provide end-to-end Amazon seller services that help brands scale from startup to marketplace dominance. Our methodology combines data-driven insights with creative excellence to deliver measurable results."}
                                </p>
                                <ul className="space-y-4">
                                    {[
                                        "Specialized Amazon Account Management",
                                        "Data-Backed Advertising Strategies",
                                        "Creative Design & Brand Storytelling",
                                        "Technical SEO & Listing Optimization"
                                    ].map((point, index) => (
                                        <li key={index} className="flex items-center gap-3">
                                            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                                <div className="w-2 h-2 rounded-full bg-primary" />
                                            </div>
                                            <span className="text-foreground font-medium">{point}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </ScrollReveal>
                    </div>
                </div>
            </section>

            {/* Company Timeline Section */}
            <CompanyTimeline milestones={initialMilestones} />

            {/* Team & Leadership Sections */}
            <section className="section-padding bg-secondary/30 overflow-hidden">
                <div className="container-custom">
                    {/* 1. Leadership Section */}
                    <div className="mb-24">
                        <div className="text-center max-w-3xl mx-auto mb-12">
                            <ScrollReveal>
                                <h2 className="heading-lg mb-4">Meet Our Leadership</h2>
                                <p className="body-md">
                                    The visionaries driving excellence and innovation at Fakhri IT Services.
                                </p>
                            </ScrollReveal>
                        </div>

                        {/* Leadership: Grid on Desktop, Carousel on Mobile */}
                        <div className="hidden md:grid grid-cols-3 gap-8">
                            {team.filter(m => m.category === 'Leadership Team' || m.category === 'Core Leadership').slice(0, 3).map((member) => (
                                <TeamCard key={member._id} member={member} size="lg" />
                            ))}
                        </div>
                        <div className="md:hidden">
                            <TeamCarousel
                                members={team.filter(m => m.category === 'Leadership Team' || m.category === 'Core Leadership')}
                                mobileVisible={1}
                                desktopVisible={3}
                                autoplay={true}
                                size="lg"
                            />
                        </div>
                    </div>

                    {/* 2. Senior Management Section */}
                    <div className="mb-24">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl md:text-3xl font-bold font-poppins">Senior Management</h2>
                            <div className="hidden md:flex gap-2">
                                {/* Navigation will be handled by Carousel buttons */}
                            </div>
                        </div>

                        <TeamCarousel
                            members={team.filter(m => m.category === 'Senior Management')}
                            mobileVisible={2}
                            desktopVisible={5}
                            autoplay={true}
                            size="md"
                        />
                    </div>

                    {/* 3. Our Rising Stars Section */}
                    <div>
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl md:text-3xl font-bold font-poppins">Our Rising Stars</h2>
                        </div>

                        <TeamCarousel
                            members={team.filter(m => m.category === 'Rising Stars')}
                            mobileVisible={3}
                            desktopVisible={6}
                            autoplay={true}
                            size="sm"
                        />
                    </div>
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="section-padding">
                <div className="container-custom">
                    <ScrollReveal>
                        <div className="text-center max-w-3xl mx-auto mb-16">
                            <h2 className="heading-lg mb-4">Why Brands Choose Us?</h2>
                            <p className="body-md">
                                Extensive experience, technical expertise, and a relentless focus on your growth.
                            </p>
                        </div>
                    </ScrollReveal>

                    <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {whyChooseUs.map((item, index) => {
                            const Icon = iconMap[item.icon] || Shield;
                            return (
                                <StaggerItem key={index}>
                                    <div className="card-premium h-full border border-border hover:border-primary/20">
                                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                                            <Icon className="w-6 h-6 text-primary" />
                                        </div>
                                        <h3 className="heading-sm mb-3">{item.title}</h3>
                                        <p className="text-muted-foreground text-sm leading-relaxed">
                                            {item.description}
                                        </p>
                                    </div>
                                </StaggerItem>
                            );
                        })}
                    </StaggerContainer>
                </div>
            </section>

            {/* CTA Section */}
            <section className="section-padding py-24 mb-10">
                <div className="container-custom">
                    <ScrollReveal>
                        <div className="relative bg-gradient-to-br from-primary to-brand-red-light rounded-3xl p-12 md:p-20 text-center overflow-hidden">
                            <div className="relative z-10 max-w-3xl mx-auto">
                                <h2 className="heading-lg text-white mb-6">
                                    Ready to Transform Your Amazon Business?
                                </h2>
                                <p className="text-white/90 text-lg md:text-xl mb-10 leading-relaxed">
                                    Join hundreds of successful brands that have scaled with Fakhri IT Services. Let's write your success story together.
                                </p>
                                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                    <ContactDialog
                                        trigger={
                                            <button suppressHydrationWarning className="btn bg-white text-primary hover:bg-gray-100 min-w-[200px] py-4 rounded-lg font-bold transition-all hover:scale-105">
                                                Get in Touch
                                            </button>
                                        }
                                    />
                                    <Link href="/career" className="btn border-2 border-white/30 text-white hover:bg-white/10 min-w-[200px] py-4 rounded-lg font-bold transition-all hover:scale-105">
                                        View Careers
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </ScrollReveal>
                </div>
            </section>
        </>
    );
}

function TeamCard({ member, size = "md" }) {
    const sizeClasses = {
        lg: {
            container: "rounded-2xl",
            image: "aspect-[4/5]",
            content: "p-6",
            name: "text-xl",
            role: "text-base"
        },
        md: {
            container: "rounded-xl",
            image: "aspect-square",
            content: "p-4",
            name: "text-base",
            role: "text-xs"
        },
        sm: {
            container: "rounded-lg",
            image: "aspect-square",
            content: "p-3",
            name: "text-sm",
            role: "text-[10px]"
        }
    };

    const s = sizeClasses[size];

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className={`group bg-card overflow-hidden border border-border hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 h-full ${s.container}`}
        >
            <div className={`relative overflow-hidden bg-muted ${s.image}`}>
                <Image
                    src={member.image || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400"}
                    alt={member.name}
                    fill
                    unoptimized={member.image?.startsWith('http')}
                    className="object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
                    {member.description && size !== 'sm' && (
                        <p className="text-white/90 text-sm mb-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 line-clamp-3">
                            {member.description}
                        </p>
                    )}
                </div>
            </div>
            <div className={s.content}>
                <h3 className={`font-bold font-poppins mb-1 group-hover:text-primary transition-colors truncate ${s.name}`}>{member.name}</h3>
                <p className={`text-primary/80 font-medium truncate ${s.role}`}>{member.role}</p>
            </div>
        </motion.div>
    );
}

function TeamCarousel({ members, mobileVisible, desktopVisible, autoplay = true, size = "md" }) {
    const plugin = React.useRef(
        Autoplay({ delay: 3000, stopOnInteraction: true })
    );

    const basis = {
        1: { sm: "basis-full", md: "md:basis-full", lg: "lg:basis-full" },
        2: { sm: "basis-1/2", md: "md:basis-1/2", lg: "lg:basis-1/2" },
        3: { sm: "basis-1/3", md: "md:basis-1/3", lg: "lg:basis-1/3" },
        4: { sm: "basis-1/4", md: "md:basis-1/4", lg: "lg:basis-1/4" },
        5: { sm: "basis-1/5", md: "md:basis-1/5", lg: "lg:basis-1/5" },
        6: { sm: "basis-1/6", md: "md:basis-1/6", lg: "lg:basis-1/6" },
    };

    return (
        <div className="relative px-4">
            <Carousel
                opts={{
                    align: "start",
                    loop: true,
                }}
                plugins={autoplay ? [plugin.current] : []}
                className="w-full"
            >
                <CarouselContent className="-ml-4">
                    {members.map((member) => (
                        <CarouselItem
                            key={member._id}
                            className={cn(
                                "pl-4",
                                basis[mobileVisible].sm,
                                desktopVisible > mobileVisible && basis[Math.min(desktopVisible, mobileVisible + 1)].md,
                                basis[desktopVisible].lg
                            )}
                        >
                            <TeamCard member={member} size={size} />
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <div className="hidden md:block absolute -left-4 md:-left-8 top-1/2 -translate-y-1/2 z-10">
                    <CarouselPrevious className="relative left-0 translate-y-0 h-8 w-8 md:h-10 md:w-10 bg-background/80 backdrop-blur shadow-md hover:bg-primary hover:text-white transition-all" />
                </div>
                <div className="hidden md:block absolute -right-4 md:-right-8 top-1/2 -translate-y-1/2 z-10">
                    <CarouselNext className="relative right-0 translate-y-0 h-8 w-8 md:h-10 md:w-10 bg-background/80 backdrop-blur shadow-md hover:bg-primary hover:text-white transition-all" />
                </div>
            </Carousel>
        </div>
    );
}
