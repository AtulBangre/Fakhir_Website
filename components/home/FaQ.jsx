'use client';

import { ScrollReveal } from '@/components/animations/ScrollReveal';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

export default function FaQ({ data = [] }) {
    if (!data || data.length === 0) return null;

    return (
        <section id="faq" className="section-padding bg-secondary/30">
            <div className="container-custom">
                <ScrollReveal>
                    <div className="text-center mb-12">
                        <span className="badge-primary mb-4">FAQs</span>
                        <h2 className="heading-lg mb-4">Frequently Asked Questions</h2>
                        <p className="body-md max-w-2xl mx-auto">
                            Have questions? We've got answers.
                        </p>
                    </div>
                </ScrollReveal>

                <ScrollReveal>
                    <div className="max-w-3xl mx-auto">
                        <Accordion type="single" collapsible className="space-y-4" suppressHydrationWarning>
                            {data.map((faq, index) => (
                                <AccordionItem
                                    key={index}
                                    value={`item-${index}`}
                                    className="bg-card rounded-xl border border-border px-6"
                                >
                                    <AccordionTrigger className="text-left font-poppins font-semibold hover:text-primary">
                                        {faq.question}
                                    </AccordionTrigger>
                                    <AccordionContent className="text-muted-foreground">
                                        {faq.answer}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                </ScrollReveal>
            </div>
        </section>
    );
}
