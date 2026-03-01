"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollableContainer } from "@/components/ui/scrollable-container";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ContactDialog } from "./ContactDialog";

export function ServiceDetailsDialog({ trigger, service, Icon }) {
    if (!service) return null;

    return (
        <Dialog>
            <DialogTrigger asChild>
                {trigger}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] p-0 flex flex-col overflow-hidden border-none bg-background/95 backdrop-blur-xl shadow-2xl">
                <div className="relative h-32 bg-primary/10 w-full overflow-hidden">
                    <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-48 h-48 bg-primary/20 rounded-full blur-3xl opacity-50" />

                    <div className="absolute inset-0 flex items-center px-8">
                        <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 transform rotate-3">
                            <Icon className="w-9 h-9 text-primary-foreground transform -rotate-3" />
                        </div>
                        <div className="ml-6">
                            <div className="text-primary text-xs font-bold uppercase tracking-widest mb-1 opacity-70">Expert Solution</div>
                            <DialogTitle className="text-2xl md:text-3xl font-bold">{service.title}</DialogTitle>
                        </div>
                    </div>
                </div>

                <ScrollableContainer className="flex-1 p-8 pt-6">
                    <div className="space-y-8">
                        {/* Description Section */}
                        <div className="prose prose-slate max-w-none">
                            <h3 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
                                <span className="w-1 h-6 bg-primary rounded-full" />
                                Overview
                            </h3>
                            <p className="text-muted-foreground leading-relaxed text-lg">
                                {service.fullDescription || service.shortDescription || service.description}
                            </p>
                        </div>

                        {/* Features & Benefits Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Features */}
                            <div className="bg-secondary/30 rounded-2xl p-6 border border-border/50">
                                <h4 className="font-bold text-foreground mb-4 flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                        <CheckCircle2 className="w-5 h-5 text-primary" />
                                    </div>
                                    Key Features
                                </h4>
                                <ul className="space-y-3">
                                    {service.features?.map((feature, idx) => (
                                        <li key={idx} className="flex items-start gap-3 group text-sm md:text-base">
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 transition-transform group-hover:scale-150" />
                                            <span className="text-muted-foreground group-hover:text-foreground transition-colors">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Benefits */}
                            <div className="bg-primary/[0.02] rounded-2xl p-6 border border-primary/10">
                                <h4 className="font-bold text-foreground mb-4 flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                        <ArrowRight className="w-5 h-5 text-primary" />
                                    </div>
                                    The Outcome
                                </h4>
                                <div className="flex flex-col gap-3">
                                    {service.benefits?.map((benefit, idx) => (
                                        <div key={idx} className="px-4 py-2 bg-background border border-border rounded-xl shadow-sm text-sm font-medium text-foreground/80 hover:border-primary/30 transition-all hover:bg-primary/5">
                                            {benefit}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Bottom Info */}
                        <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent border border-primary/5">
                            <h4 className="font-bold mb-2">Why Choose This Service?</h4>
                            <p className="text-sm text-muted-foreground">
                                Our {service.title} is designed by industry experts to ensure maximum ROI and sustainable growth for your Amazon business. We handle the complexities so you can focus on scaling.
                            </p>
                        </div>
                    </div>
                </ScrollableContainer>

                <div className="p-6 border-t border-border flex items-center justify-between bg-secondary/10">
                    <p className="text-xs text-muted-foreground hidden sm:block">Ready to scale your business with us?</p>
                    <div className="flex gap-3 w-full sm:w-auto">
                        <ContactDialog
                            defaultService={service.title}
                            trigger={
                                <Button className="flex-1 sm:flex-none">
                                    Get Started <ArrowRight className="ml-2 w-4 h-4" />
                                </Button>
                            }
                        />
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
