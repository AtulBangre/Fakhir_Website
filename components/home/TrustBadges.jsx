'use client';

import { StaggerContainer, StaggerItem } from '@/components/animations/ScrollReveal';

export default function TrustBadges({ company }) {
    const badges = company?.badges || [
        { title: "500+", subtitle: "Sellers Trusted" },
        { title: "8+", subtitle: "Years Experience" },
        { title: "25+", subtitle: "Expert Team" },
        { title: "No.1", subtitle: "Amazon Growth Partner" }
    ];

    return (
        <section className="py-12 bg-secondary/50">
            <div className="container-custom">
                <StaggerContainer className="flex flex-wrap justify-center gap-8 md:gap-16">
                    {badges.map((badge, index) => (
                        <StaggerItem key={index}>
                            <div className="text-center">
                                <p className="text-2xl md:text-3xl font-poppins font-bold text-primary">
                                    {badge.title}
                                </p>
                                <p className="text-sm text-muted-foreground">{badge.subtitle}</p>
                            </div>
                        </StaggerItem>
                    ))}
                </StaggerContainer>
            </div>
        </section>
    );
}
