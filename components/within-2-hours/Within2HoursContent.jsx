'use client';

import { useState, useMemo } from 'react';
import { ScrollReveal, StaggerContainer, StaggerItem } from '@/components/animations/ScrollReveal';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
    Clock,
    Shield,
    Lock,
    MessageCircle,
    AlertTriangle,
    ArrowRight,
    Phone,
    Check,
    Loader2
} from 'lucide-react';
import Within2HoursPricingList from './Within2HoursPricingList';
import { ContactDialog } from '@/components/dialogs/ContactDialog';

const iconMap = {
    Clock,
    Shield,
    Lock,
    MessageCircle,
};

// Layout content - keeping these local as they define the page structure/identity
const within2HoursPageInfo = {
    badge: "Priority Services",
    title: "Urgent Amazon Support",
    description: "Critical issues need immediate attention. Our priority team is standing by to resolve your most pressing Amazon seller challenges within hours, not days."
};

const within2HoursPageData = {
    title: "Priority Service",
    subtitle: "Resolution Within 2 Hours",
    description: "Don't let account issues or technical glitches stall your business. Get immediate access to our senior specialists for rapid problem resolution.",
    scenarios: [
        "Account Deactivation / Suspension",
        "Listing Suppression / Removal",
        "Critical Inventory Issues",
        "Buy Box Disappearance",
        "Urgent PPC Adjustments",
        "Amazon Policy Violations"
    ],
    features: [
        {
            title: "Rapid Resource Allocation",
            description: "Instant assignment of our most senior account specialists to your case.",
            icon: "Clock"
        },
        {
            title: "Direct Amazon Liaison",
            description: "Priority handling through our established partner channels.",
            icon: "Shield"
        },
        {
            title: "Expert Resolution",
            description: "Deep technical insight applied to complex policy and technical hurdles.",
            icon: "Lock"
        }
    ],
    serviceInfo: {
        title: "How It Works",
        description: "Once requested, our priority team triggers an immediate response protocol. We analyze the issue, identify the root cause, and begin the resolution process or direct communication with Amazon support within the 2-hour window.",
        buttonText: "Join Our WhatsApp",
        buttonLink: "#",
        benefits: [
            "Guaranteed response within 120 minutes",
            "Direct access to senior account managers",
            "Focused resolution on one critical priority",
            "Pre-analysis of account health & status"
        ],
        disclaimer: "Total resolution time may vary based on Amazon's support response speed, but our work begins immediately."
    },
    cta: {
        title: "Ready to Fix it Now?",
        description: "Your business shouldn't wait. Contact our emergency response team right now via WhatsApp or use our priority form.",
        whatsappText: "WhatsApp Emergency"
    }
};

export default function Within2HoursContent({ initialServices = [], initialCompany = null }) {
    const priorityServices = useMemo(() => {
        return initialServices
            .filter(s => s.pricing && s.pricing.priority && s.pricing.priority.price > 0)
            .map(s => ({
                id: s._id,
                name: s.name,
                category: s.category,
                price: s.pricing.priority.price
            }));
    }, [initialServices]);

    return (
        <>
            {/* Hero Section */}
            <section className="section-padding bg-gradient-to-b from-primary/5 to-background relative overflow-hidden">
                {/* Animated Background Elements */}
                <motion.div
                    animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.15, 0.1] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
                />

                <div className="container-custom relative z-10">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <ScrollReveal direction="left">
                            <div>
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ duration: 0.5, type: "spring" }}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-full mb-6"
                                >
                                    <Clock className="w-5 h-5 animate-pulse" />
                                    <span className="font-semibold">Priority Response</span>
                                </motion.div>

                                <h1 className="heading-xl mb-6">
                                    <span className="text-primary">{within2HoursPageData.title}</span>
                                    <br />
                                    {within2HoursPageData.subtitle}
                                </h1>

                                <p className="body-lg mb-8">
                                    {within2HoursPageData.description}
                                </p>

                                <div className="flex flex-wrap gap-4">
                                    <a
                                        href={`https://wa.me/${initialCompany?.contact?.phone?.whatsapp || '919584426543'}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn-primary group"
                                    >
                                        <MessageCircle className="mr-2 w-5 h-5" />
                                        {within2HoursPageData.cta.whatsappText}
                                    </a>
                                    <a
                                        href={`tel:${initialCompany?.contact?.phone?.primary || ''}`}
                                        className="btn-outline"
                                    >
                                        <Phone className="mr-2 w-5 h-5" />
                                        Call Now
                                    </a>
                                </div>
                            </div>
                        </ScrollReveal>

                        <ScrollReveal direction="right">
                            <div className="relative">
                                {/* Main Card */}
                                <motion.div
                                    className="bg-card rounded-3xl p-8 border border-border shadow-xl"
                                    whileHover={{ y: -5 }}
                                >
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center">
                                            <Clock className="w-8 h-8 text-primary-foreground" />
                                        </div>
                                        <div>
                                            <p className="text-4xl font-poppins font-bold text-primary">2</p>
                                            <p className="text-muted-foreground">Hours Response</p>
                                        </div>
                                    </div>

                                    <p className="text-lg font-semibold mb-4">
                                        Guaranteed rapid response for critical Amazon issues
                                    </p>

                                    <ul className="space-y-3">
                                        {within2HoursPageData.scenarios.slice(0, 4).map((scenario, idx) => (
                                            <li key={idx} className="flex items-start gap-3">
                                                <AlertTriangle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                                                <span className="text-muted-foreground">{scenario}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </motion.div>
                            </div>
                        </ScrollReveal>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="section-padding">
                <div className="container-custom">
                    <ScrollReveal>
                        <div className="text-center max-w-3xl mx-auto mb-16">
                            <h2 className="heading-lg mb-4">
                                What You Get with Priority Support
                            </h2>
                            <p className="body-md">
                                Our dedicated team is ready to tackle your most urgent Amazon challenges
                            </p>
                        </div>
                    </ScrollReveal>

                    <StaggerContainer className="grid md:grid-cols-3 lg:grid-cols-3 gap-6">
                        {within2HoursPageData.features.map((feature, index) => {
                            const Icon = iconMap[feature.icon] || Clock;
                            return (
                                <StaggerItem key={index}>
                                    <motion.div
                                        className="card-premium text-center h-full"
                                        whileHover={{ y: -5 }}
                                    >
                                        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
                                            <Icon className="w-8 h-8 text-primary" />
                                        </div>
                                        <h3 className="font-poppins font-semibold text-lg mb-2">
                                            {feature.title}
                                        </h3>
                                        <p className="text-muted-foreground text-sm">
                                            {feature.description}
                                        </p>
                                    </motion.div>
                                </StaggerItem>
                            );
                        })}
                    </StaggerContainer>
                </div>
            </section>

            {/* Scenarios Section */}
            <section className="section-padding bg-secondary/30">
                <div className="container-custom">
                    <div className="max-w-6xl mx-auto bg-card rounded-3xl p-8 md:p-12 shadow-lg border border-border">
                        <div className="grid lg:grid-cols-2 gap-12 items-start relative">
                            {/* Left Column */}
                            <ScrollReveal direction="left">
                                <div>
                                    <h2 className="heading-lg mb-6">
                                        {within2HoursPageData.serviceInfo.title}
                                    </h2>
                                    <p className="text-muted-foreground leading-relaxed mb-8">
                                        {within2HoursPageData.serviceInfo.description}
                                    </p>
                                    <Link
                                        href={within2HoursPageData.serviceInfo.buttonLink}
                                        className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground font-poppins font-semibold rounded-lg transition-all duration-300 hover:shadow-lg group"
                                    >
                                        {within2HoursPageData.serviceInfo.buttonText}
                                        <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </div>
                            </ScrollReveal>

                            {/* Vertical Divider - Hidden on mobile */}
                            <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-border"></div>

                            {/* Right Column */}
                            <ScrollReveal direction="right">
                                <div className="relative lg:pl-8">
                                    <h3 className="font-poppins font-semibold text-lg mb-6">
                                        This service ensures :
                                    </h3>
                                    <ul className="space-y-4 mb-8">
                                        {within2HoursPageData.serviceInfo.benefits.map((benefit, index) => (
                                            <li key={index} className="flex items-start gap-3">
                                                <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                                                <span className="text-foreground">{benefit}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    {/* Disclaimer Note */}
                                    <div className="bg-muted/50 rounded-lg p-4 border border-border/50">
                                        <div className="flex items-start gap-2">
                                            <AlertTriangle className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                                            <p className="text-sm text-muted-foreground">
                                                {within2HoursPageData.serviceInfo.disclaimer}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </ScrollReveal>
                        </div>
                    </div>
                </div>
            </section>

            {/* Service Pricing List */}
            <Within2HoursPricingList
                services={priorityServices}
                pageInfo={within2HoursPageInfo}
                noticeContent={
                    <>
                        <span className="font-semibold text-primary">⚡ Guaranteed 2-Hour Response:</span> Our expert team will acknowledge and begin working on your issue within 2 hours of order confirmation.
                        <span className="text-foreground ml-1">Dedicated priority support channel</span>
                    </>
                }
            />

            {/* CTA Section */}
            <section className="section-padding">
                <div className="container-custom">
                    <ScrollReveal>
                        <div className="relative bg-gradient-to-br from-primary to-brand-red-light rounded-3xl p-12 md:p-16 text-primary-foreground overflow-hidden">
                            <div className="absolute inset-0 opacity-10">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                    className="absolute -top-20 -right-20 w-80 h-80 border-2 border-primary-foreground/30 rounded-full"
                                />
                            </div>

                            <div className="relative z-10 max-w-2xl mx-auto text-center">
                                <Clock className="w-16 h-16 mx-auto mb-6" />
                                <h2 className="heading-lg mb-6">
                                    {within2HoursPageData.cta.title}
                                </h2>
                                <p className="text-primary-foreground/90 text-lg mb-8">
                                    {within2HoursPageData.cta.description}
                                </p>
                                <div className="flex flex-wrap justify-center gap-4">
                                    <a
                                        href={`https://wa.me/${initialCompany?.contact?.phone?.whatsapp || '919584426543'}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center justify-center px-8 py-4 bg-background text-primary font-poppins font-semibold rounded-lg transition-all duration-300 hover:shadow-xl"
                                    >
                                        <MessageCircle className="mr-2 w-5 h-5" />
                                        {within2HoursPageData.cta.whatsappText}
                                    </a>
                                    <ContactDialog
                                        defaultService="Within 2 Hours Response"
                                        trigger={
                                            <button suppressHydrationWarning className="inline-flex items-center justify-center px-8 py-4 border-2 border-primary-foreground/30 text-primary-foreground font-poppins font-semibold rounded-lg transition-all duration-300 hover:bg-primary-foreground/10">
                                                Contact Form
                                                <ArrowRight className="ml-2 w-5 h-5" />
                                            </button>
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                    </ScrollReveal>
                </div>
            </section>
        </>
    );
};
