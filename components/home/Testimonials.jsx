'use client';

import { ScrollReveal } from '@/components/animations/ScrollReveal';
import SocialTestimonialCard from '@/components/ui/SocialTestimonialCard';
import Marquee from 'react-fast-marquee';

export default function Testimonials({ testimonials }) {
    // Filter testimonials directly from the collection
    const socialData = (testimonials || [])
        .filter(t => t.type === 'social')
        .map(t => ({
            name: t.author.name,
            company: t.author.company,
            image: t.author.image,
            quote: t.content,
            rating: t.rating
        }));

    if (socialData.length === 0) return null;

    return (
        <section className="section-padding bg-background relative" id="testimonials">
            {/* Semicircular Fade Overlays */}
            <div
                className="absolute left-0 top-0 bottom-0 w-48 md:w-64 lg:w-96 pointer-events-none z-10"
                style={{
                    background: 'radial-gradient(ellipse 80% 100% at left center, hsl(var(--background)) 0%, transparent 70%)'
                }}
            />
            <div
                className="absolute right-0 top-0 bottom-0 w-48 md:w-64 lg:w-96 pointer-events-none z-10"
                style={{
                    background: 'radial-gradient(ellipse 80% 100% at right center, hsl(var(--background)) 0%, transparent 70%)'
                }}
            />

            <div className="container-custom">
                {/* Section Header */}
                <ScrollReveal>
                    <div className="text-center mb-16">
                        <span className="badge-primary mb-4">Testimonials</span>
                        <h2 className="heading-lg mb-4">
                            Loved by Amazon Sellers
                        </h2>
                        <p className="body-md max-w-2xl mx-auto">
                            See how our Amazon services are helping businesses grow their sales and dominate their niches.
                        </p>
                    </div>
                </ScrollReveal>

                {/* First Marquee - Left to Right */}
                <div className=" overflow-hidden hide-scrollbar">
                    <Marquee
                        gradient={true}
                        speed={40}
                    >
                        <div className="flex items-center py-5">
                            {socialData.map((testimonial, index) => (
                                <SocialTestimonialCard
                                    key={`row1-${index}`}
                                    index={index}
                                    testimonial={testimonial}
                                />
                            ))}
                        </div>
                    </Marquee>
                </div>

                {/* Second Marquee - Right to Left */}
                <div className="overflow-hidden hide-scrollbar">
                    <Marquee
                        gradient={true}
                        speed={40}
                        direction="right"
                    >
                        <div className="flex items-center py-5">
                            {socialData.map((testimonial, index) => (
                                <SocialTestimonialCard
                                    key={`row2-${index}`}
                                    index={index}
                                    testimonial={testimonial}
                                />
                            ))}
                        </div>
                    </Marquee>
                </div>
            </div>

            <style jsx>{`
                .hide-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </section>
    );
}

