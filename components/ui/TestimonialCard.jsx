'use client';

import { motion } from 'framer-motion';
import { ScrollReveal } from '@/components/animations/ScrollReveal';
import { Star, Quote } from 'lucide-react';

export default function TestimonialCard({ testimonial, index }) {
    return (
        <ScrollReveal delay={index * 0.1} direction="up">
            <motion.div
                className="card-premium h-full flex flex-col"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
            >
                {/* Quote Icon */}
                <div className="mb-4">
                    <Quote className="w-10 h-10 text-primary/20" />
                </div>

                {/* Content */}
                <p className="text-foreground/80 leading-relaxed mb-6 flex-1">
                    &quot;{testimonial.content}&quot;
                </p>

                {/* Rating */}
                <div className="flex gap-1 mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                            key={i}
                            className={`w-4 h-4 ${i < testimonial.rating
                                    ? 'text-yellow-500 fill-yellow-500'
                                    : 'text-muted'
                                }`}
                        />
                    ))}
                </div>

                {/* Metric */}
                {testimonial.metric && (
                    <div className="mb-4 p-3 bg-primary/5 rounded-lg inline-flex items-center gap-2">
                        <span className="text-primary font-poppins font-bold text-lg">
                            {testimonial.metric.value}
                        </span>
                        <span className="text-muted-foreground text-sm">
                            {testimonial.metric.label}
                        </span>
                    </div>
                )}

                {/* Author */}
                <div className="flex items-center gap-3 pt-4 border-t border-border">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-primary font-poppins font-semibold text-lg">
                            {testimonial.name.charAt(0)}
                        </span>
                    </div>
                    <div>
                        <p className="font-poppins font-semibold text-sm">{testimonial.name}</p>
                        <p className="text-muted-foreground text-xs">
                            {testimonial.role}, {testimonial.company}
                        </p>
                    </div>
                </div>
            </motion.div>
        </ScrollReveal>
    );
}
