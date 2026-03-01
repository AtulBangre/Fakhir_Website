'use client';
import { ScrollReveal } from '@/components/animations/ScrollReveal';
import { PricingCard } from '@/components/ui/PricingCard';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from "framer-motion";
import { ArrowRight, Check, HelpCircle } from 'lucide-react';
import FaQ from '../home/FaQ';
import Within2HoursPricingList from '../within-2-hours/Within2HoursPricingList';
import { ContactDialog } from '@/components/dialogs/ContactDialog';

export default function PricingContent({ plans = [], faqs = [], services = [] }) {




    return (
        <>
            {/* Hero Section */}
            <section className="section-padding bg-gradient-to-b from-secondary/50 to-background">
                <div className="container-custom">
                    <ScrollReveal>
                        <div className="text-center max-w-3xl mx-auto">
                            <span className="badge-primary mb-4">Pricing</span>
                            <h1 className="heading-xl mb-6">
                                Transparent <span className="text-primary">Pricing</span> for Every Stage
                            </h1>
                            <p className="body-lg mb-8">
                                Choose the plan that fits your business needs. Scale up as you grow
                                with our flexible pricing options.
                            </p>
                        </div>
                    </ScrollReveal>
                </div>
            </section>

            {/* Pricing Cards */}
            <section className="section-padding pt-8">
                <div className="container-custom">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {plans.map((plan, index) => (
                            <PricingCard
                                key={plan._id}
                                plan={plan}
                                index={index}
                            />
                        ))}
                    </div>

                    {/* Disclaimer */}
                    <ScrollReveal>
                        <div className="mt-12 p-6 bg-secondary/50 rounded-xl max-w-4xl mx-auto">
                            <div className="flex items-start gap-3">
                                <HelpCircle className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-muted-foreground">
                                    <strong>Important:</strong> Pricing is based on project complexity and scope. Custom quotes available for unique requirements.
                                </p>
                            </div>
                        </div>
                    </ScrollReveal>
                </div>
            </section>

            {/* Feature Comparison */}
            {plans.length > 0 && (
                <section id="compare-plans" className="section-padding scroll-mt-20">
                    <div className="container-custom">
                        <ScrollReveal>
                            <div className="text-center mb-12">
                                <h2 className="heading-lg mb-4">Compare Plans</h2>
                                <p className="body-md max-w-2xl mx-auto">
                                    See a detailed breakdown of what's included in each plan
                                </p>
                            </div>
                        </ScrollReveal>

                        <ScrollReveal>
                            <div className="overflow-x-auto">
                                <table className="w-full max-w-5xl mx-auto">
                                    <thead>
                                        <tr className="border-b border-border">
                                            <th className="text-left py-4 px-4 font-poppins font-semibold">Feature</th>
                                            {plans.map((plan) => (
                                                <th
                                                    key={plan._id}
                                                    className={`text-center py-4 px-4 font-poppins font-semibold ${plan.highlighted ? 'text-primary' : ''
                                                        }`}
                                                >
                                                    {plan.name}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {plans[0].features.map((feature, idx) => (
                                            <motion.tr
                                                key={idx}
                                                className="border-b border-border/50"
                                                initial={{ opacity: 0, x: -20 }}
                                                whileInView={{ opacity: 1, x: 0 }}
                                                transition={{ delay: idx * 0.05 }}
                                                viewport={{ once: true }}
                                            >
                                                <td className="py-4 px-4 text-sm">{feature.text}</td>
                                                {plans.map((plan) => (
                                                    <td key={plan._id} className="text-center py-4 px-4">
                                                        {typeof plan.features[idx].value === 'string' && plan.features[idx].value !== 'true' && plan.features[idx].value !== 'false' ? (
                                                            <span className="text-sm font-medium text-foreground">{plan.features[idx].value}</span>
                                                        ) : plan.features[idx].included || plan.features[idx].value === 'true' ? (
                                                            <Check className="w-5 h-5 text-primary mx-auto" />
                                                        ) : (
                                                            <span className="text-muted-foreground/30">—</span>
                                                        )}
                                                    </td>
                                                ))}
                                            </motion.tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </ScrollReveal>
                    </div>
                </section>
            )}

            {/* Scenarios Section */}
            <section className="section-padding bg-secondary/30">
                <div className="container-custom">
                    <div className="max-w-6xl mx-auto bg-card rounded-3xl p-8 md:p-12 shadow-lg border border-border">
                        <div className="grid lg:grid-cols-2 gap-12 items-start relative">
                            <div className="order-1 lg:order-2">
                                <ScrollReveal direction="right">
                                    <div className="relative lg:pl-8">
                                        <div style={{ position: "relative", width: "100%", height: "300px" }}>
                                            <Image
                                                src="https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&q=80&w=800"
                                                alt="Service Image"
                                                fill
                                                className="object-contain"
                                            />
                                        </div>
                                    </div>
                                </ScrollReveal>
                            </div>

                            <div className="order-2 lg:order-1">
                                <ScrollReveal direction="left">
                                    <div>
                                        <h2 className="heading-lg mb-6">
                                            Need something more specific?
                                        </h2>
                                        <p className="text-muted-foreground leading-relaxed mb-8">
                                            We offer specialized services within 2 hours for urgent requirements. From quick listing fixes to PPC troubleshooting, our experts are ready to assist.
                                        </p>
                                        <Link
                                            href="/within-2-hours"
                                            className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground font-poppins font-semibold rounded-lg transition-all duration-300 hover:shadow-lg group"
                                        >
                                            View Quick Services
                                            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </Link>
                                    </div>
                                </ScrollReveal>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Service Pricing List */}
            {services.length > 0 && (
                <Within2HoursPricingList
                    services={services}
                    pageInfo={{
                        badge: "A-la-carte",
                        title: "Add-on Services",
                        description: "Enhance your plan with specialized services"
                    }}
                    noticeContent={
                        <>
                            <span className="font-semibold text-primary">💡 Pro Tip:</span> Combine add-on services with your subscription plan for maximum impact and better ROI.
                            <span className="text-foreground ml-1">Custom packages available on request</span>
                        </>
                    }
                />
            )}

            {/* FAQ Section */}
            {faqs.length > 0 && <FaQ data={faqs} />}

            {/* CTA Section */}
            <section className="section-padding">
                <div className="container-custom">
                    <ScrollReveal>
                        <div className="text-center max-w-3xl mx-auto">
                            <h2 className="heading-lg mb-6">
                                Ready to Get Started?
                            </h2>
                            <p className="body-md mb-8">
                                Contact us for a free consultation and let's discuss which plan
                                works best for your business.
                            </p>
                            <ContactDialog
                                trigger={
                                    <button className="btn-primary" suppressHydrationWarning>
                                        Schedule a Call
                                    </button>
                                }
                            />
                        </div>
                    </ScrollReveal>
                </div>
            </section>
        </>
    );
}
