'use client';

import { motion } from 'framer-motion';
import { Check, X, ChevronDown } from 'lucide-react';
import { ScrollReveal } from '@/components/animations/ScrollReveal';
import Link from 'next/link';
import { ContactDialog } from '@/components/dialogs/ContactDialog';

import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const PricingCard = ({ plan, index }) => {
    const router = useRouter();

    const handleCardClick = (e) => {
        // Don't trigger if clicking the button
        if (e.target.closest('button') || e.target.closest('a')) return;

        // Scroll to compare plans section
        const comparePlansSection = document.getElementById('compare-plans');
        if (comparePlansSection) {
            comparePlansSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const planId = plan.planId || plan._id || plan.id;

    const handlePurchase = (e) => {
        e.stopPropagation(); // Prevent card click event
        router.push(`/login?role=client&callbackUrl=/checkout?plan=${planId}`);
    };

    // Show only first 10 features
    const displayFeatures = plan.features.slice(0, 10);
    const hasMoreFeatures = plan.features.length > 10;

    return (
        <ScrollReveal delay={index * 0.1}>
            <motion.div
                onClick={handleCardClick}
                className={`relative h-full rounded-2xl overflow-hidden cursor-pointer ${plan.highlighted
                    ? 'bg-primary text-primary-foreground shadow-red'
                    : 'bg-card border border-border'
                    }`}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
            >
                {/* Popular Badge */}
                {plan.highlighted && (
                    <div className="absolute top-0 right-0 bg-background text-primary text-xs font-semibold px-4 py-1.5 rounded-bl-lg">
                        Most Popular
                    </div>
                )}

                <div className="p-8">
                    {/* Header */}
                    <div className="mb-6">
                        <p className={`text-sm font-medium mb-1 ${plan.highlighted ? 'text-primary-foreground/70' : 'text-muted-foreground'
                            }`}>
                            {plan.subtitle}
                        </p>
                        <h3 className="heading-md mb-2">{plan.name}</h3>
                        <div className="flex items-baseline gap-1">
                            <span className="text-4xl font-poppins font-bold">{plan.prices.monthly || plan.prices.monthlyUSD || "₹15,000"}</span>
                            {plan.period && (
                                <span className={`text-sm ${plan.highlighted ? 'text-primary-foreground/70' : 'text-muted-foreground'
                                    }`}>
                                    {plan.period}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Description */}
                    <p className={`text-sm mb-8 ${plan.highlighted ? 'text-primary-foreground/80' : 'text-muted-foreground'
                        }`}>
                        {plan.description}
                    </p>

                    {/* Features */}
                    <ul className="space-y-3 mb-6">
                        {displayFeatures.map((feature, idx) => (
                            <li key={idx} className="flex items-start gap-3">
                                {feature.included ? (
                                    <Check className={`w-5 h-5 flex-shrink-0 ${plan.highlighted ? 'text-primary-foreground' : 'text-primary'
                                        }`} />
                                ) : (
                                    <X className={`w-5 h-5 flex-shrink-0 ${plan.highlighted ? 'text-primary-foreground/30' : 'text-muted-foreground/30'
                                        }`} />
                                )}
                                <span className={`text-sm ${feature.included
                                    ? ''
                                    : plan.highlighted
                                        ? 'text-primary-foreground/40'
                                        : 'text-muted-foreground/40'
                                    }`}>
                                    {feature.text}
                                    {feature.value && typeof feature.value === 'string' && (
                                        <span className={`block text-xs font-semibold mt-0.5 ${plan.highlighted ? 'text-primary-foreground/90' : 'text-primary'}`}>
                                            {feature.value}
                                        </span>
                                    )}
                                </span>
                            </li>
                        ))}
                    </ul>

                    {/* See more features hint */}
                    {hasMoreFeatures && (
                        <div className={`flex items-center justify-center gap-1 mb-6 text-xs ${plan.highlighted ? 'text-primary-foreground/60' : 'text-muted-foreground'
                            }`}>
                            <ChevronDown className="w-3 h-3" />
                            <span>Click to see all features</span>
                        </div>
                    )}

                    {/* CTA */}
                    <motion.button
                        suppressHydrationWarning
                        className={`w-full py-4 rounded-lg font-poppins font-semibold transition-all duration-300 ${plan.highlighted
                            ? 'bg-background text-primary hover:bg-background/90'
                            : 'bg-primary text-primary-foreground hover:shadow-red'
                            }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handlePurchase}
                    >
                        {plan.cta || "Get Started"}
                    </motion.button>
                </div>
            </motion.div>
        </ScrollReveal>
    );
};

