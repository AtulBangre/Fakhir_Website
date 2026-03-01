'use client';

import { motion } from 'framer-motion';
import { ScrollReveal } from '@/components/animations/ScrollReveal';
import { ServiceDetailsDialog } from '@/components/dialogs/ServiceDetailsDialog';
import {
    Settings,
    FileText,
    Package,
    Target,
    Image,
    DollarSign,
    TrendingUp,
    IndianRupee,
    ChevronRight,
    ArrowRight
} from 'lucide-react';

const iconMap = {
    Settings,
    FileText,
    Package,
    Target,
    Image,
    DollarSign,
    TrendingUp,
    IndianRupee,
};

export default function ServiceCard({ service, index, variant = 'default' }) {
    const Icon = iconMap[service.icon] || Settings;

    if (variant === 'compact') {
        const description = service.shortDescription || service.description;
        return (
            <ScrollReveal delay={index * 0.1} direction="up">
                <ServiceDetailsDialog
                    service={service}
                    Icon={Icon}
                    trigger={
                        <motion.div
                            className="group card-premium cursor-pointer h-full flex flex-col"
                            whileHover={{ y: -5 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                                <Icon className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors" />
                            </div>
                            <h3 className="heading-sm mb-3 group-hover:text-primary transition-colors">
                                {service.title}
                            </h3>
                            <p className="text-muted-foreground text-sm leading-relaxed flex-1">
                                {description}
                            </p>
                        </motion.div>
                    }
                />
            </ScrollReveal>
        );
    }

    if (variant === 'grid') {
        return (
            <ScrollReveal delay={index * 0.1} direction="up">
                <ServiceDetailsDialog
                    service={service}
                    Icon={Icon}
                    trigger={
                        <motion.div
                            id={service.id || service._id}
                            className="group bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/20 transition-all duration-500 h-full flex flex-col shadow-sm hover:shadow-xl cursor-pointer"
                            whileHover={{ y: -8 }}
                        >
                            <div className="p-6 flex-1 flex flex-col">
                                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 border border-primary/5 group-hover:bg-primary group-hover:scale-110 transition-all duration-500">
                                    <Icon className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
                                </div>

                                <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors duration-300">
                                    {service.title}
                                </h3>

                                <p className="text-muted-foreground text-sm mb-6 line-clamp-2 leading-relaxed">
                                    {service.shortDescription}
                                </p>

                                <div className="space-y-3 mb-6 flex-1">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">Key Features</h4>
                                    <ul className="space-y-2">
                                        {service.features.slice(0, 4).map((feature, idx) => (
                                            <li key={idx} className="flex items-start gap-2 text-sm text-foreground/80">
                                                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                                                <span className="line-clamp-1">{feature}</span>
                                            </li>
                                        ))}
                                        {service.features.length > 4 && (
                                            <li className="text-xs text-primary font-medium pl-3.5">+ {service.features.length - 4} more features</li>
                                        )}
                                    </ul>
                                </div>

                                <div className="flex items-center justify-between mt-auto pt-6 border-t border-border/50">
                                    <span className="text-xs font-bold text-primary flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                        VIEW DETAILS <ChevronRight className="w-3 h-3" />
                                    </span>
                                    {service.benefits && service.benefits.length > 0 && (
                                        <div className="flex -space-x-2">
                                            <div className="w-6 h-6 rounded-full bg-primary/10 border-2 border-background flex items-center justify-center text-[8px] font-bold text-primary">ROI</div>
                                            <div className="w-6 h-6 rounded-full bg-secondary border-2 border-background flex items-center justify-center text-[8px] font-bold text-secondary-foreground">24/7</div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    }
                />
            </ScrollReveal>
        );
    }

    return (
        <ScrollReveal delay={index * 0.1} direction="up">
            <ServiceDetailsDialog
                service={service}
                Icon={Icon}
                trigger={
                    <motion.div
                        id={service.id}
                        role="article"
                        aria-labelledby={`service-title-${index}`}
                        className="group bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/20 transition-all duration-500 cursor-pointer"
                        whileHover={{ y: -5 }}
                    >
                        {/* Header */}
                        <div className="p-8 pb-0">
                            <div className="flex items-start gap-5 mb-6">
                                <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary transition-colors duration-300">
                                    <Icon className="w-8 h-8 text-primary group-hover:text-primary-foreground transition-colors" />
                                </div>
                                <div>
                                    <h3 id={`service-title-${index}`} className="heading-sm mb-2 group-hover:text-primary transition-colors">{service.title}</h3>
                                    <p className="text-muted-foreground text-sm">{service.shortDescription}</p>
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-8 pt-4">
                            <p className="text-muted-foreground mb-6 leading-relaxed line-clamp-3">
                                {service.fullDescription || service.shortDescription}
                            </p>

                            <div className="flex items-center gap-2 text-primary text-sm font-bold">
                                EXPLORE SERVICE <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                            </div>
                        </div>
                    </motion.div>
                }
            />
        </ScrollReveal>
    );
}
