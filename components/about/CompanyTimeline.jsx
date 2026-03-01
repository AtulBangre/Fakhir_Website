'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';

export default function CompanyTimeline({ milestones = [] }) {
    if (!milestones || milestones.length === 0) return null;

    if (milestones.length === 0) return null;

    return (
        <section className="section-padding bg-background relative overflow-hidden">
            {/* Background Decorations - Subtle & Lite */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-40">
                <div className="absolute top-1/4 -left-20 w-64 h-64 bg-primary/5 blur-[100px] rounded-full" />
                <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-primary/5 blur-[100px] rounded-full" />
            </div>

            <div className="container-custom relative z-10">
                {/* Header Section */}
                <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24 px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <span className="badge-primary mb-4 uppercase tracking-[0.2em] text-[10px] md:text-xs">
                            The History
                        </span>
                        <h2 className="heading-lg mb-4">
                            Our Company <span className="text-gradient">Milestones</span>
                        </h2>
                        <p className="body-md text-sm md:text-base">
                            A Decade of Excellence: Building the Future of Amazon Commerce One Growth Story at a Time.
                        </p>
                    </motion.div>
                </div>

                {/* Timeline UI */}
                <div className="relative max-w-5xl mx-auto px-4 md:px-0">

                    {/* The Rail (Central Vertical Line) */}
                    <div className="absolute left-6 md:left-1/2 top-4 bottom-4 w-0.5 bg-border -translate-x-1/2" />

                    {/* Timeline List */}
                    <div className="space-y-12 md:space-y-24">
                        {milestones.map((item, index) => (
                            <TimelineItem
                                key={item._id}
                                item={item}
                                index={index}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

function TimelineItem({ item, index }) {
    const isEven = index % 2 === 0;

    return (
        <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">

            {/* Center Node (Always visible) */}
            <div className="absolute left-6 md:left-1/2 top-3 md:top-1/2 w-4 h-4 md:w-5 md:h-5 bg-background border-2 border-primary rounded-full -translate-x-1/2 md:-translate-y-1/2 z-20 shadow-[0_0_0_4px_white,0_0_0_6px_rgba(136,8,8,0.15)]">
                <div className="absolute inset-0 rounded-full animate-pulse bg-primary/10 scale-150" />
            </div>

            {/* Content Side */}
            <div className={`pl-12 md:pl-0 ${isEven ? 'md:order-1 md:text-right md:pr-12' : 'md:order-2 md:text-left md:pl-12'}`}>
                <motion.div
                    initial={{ opacity: 0, x: isEven ? -30 : 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    viewport={{ once: true }}
                    className="group"
                >
                    <span className="text-xs font-bold text-primary mb-2 block uppercase tracking-widest font-poppins">
                        {item.year}
                    </span>
                    <h3 className="heading-sm mb-3 group-hover:text-primary transition-colors duration-300">
                        {item.title}
                    </h3>
                    <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                        {item.description}
                    </p>

                    {/* Mobile Image: Stacks on mobile, hidden on desktop image side */}
                    <div className="md:hidden mt-6 relative aspect-video rounded-2xl overflow-hidden shadow-md border border-border/50">
                        <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            className="object-cover"
                        />
                    </div>
                </motion.div>
            </div>

            {/* Desktop Image Side */}
            <div className={`hidden md:block ${isEven ? 'md:order-2' : 'md:order-1'}`}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="relative aspect-[16/10] rounded-2xl overflow-hidden shadow-lg group border border-border/30"
                >
                    <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

                    {/* Floating Year Detail */}
                    <div className={`absolute bottom-4 ${isEven ? 'left-6' : 'right-6'} opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0`}>
                        <span className="text-white text-2xl font-black opacity-30 select-none">{item.year}</span>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
