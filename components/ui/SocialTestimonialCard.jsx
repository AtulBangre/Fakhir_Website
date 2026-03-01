'use client';

import { motion } from 'framer-motion';

export default function SocialTestimonialCard({ testimonial, index }) {
    return (
        <motion.div
            className="p-6 rounded-xl mx-3 w-80 shrink-0 bg-card border border-border transition-all duration-300 hover:border-primary/50"
            whileHover={{ y: -5 }}
            transition={{ duration: 0.3 }}
        >
            <div className="flex gap-3 mb-4">
                <img
                    className="size-12 rounded-full object-cover ring-2 ring-primary/10"
                    src={testimonial.image}
                    alt={testimonial.name}
                    height={48}
                    width={48}
                />
                <div className="flex flex-col flex-1">
                    <p className="font-poppins font-semibold text-sm">{testimonial.name}</p>
                    <span className="text-xs text-muted-foreground">{testimonial.company}</span>
                </div>
            </div>
            <div className="flex text-yellow-500 text-xs mb-3">
                {[...Array(testimonial.rating || 5)].map((_, i) => (
                    <span key={i}>★</span>
                ))}
            </div>
            <p className="text-sm leading-relaxed text-foreground/80 line-clamp-3">
                &ldquo;{testimonial.quote}&rdquo;
            </p>
        </motion.div >
    );
}
