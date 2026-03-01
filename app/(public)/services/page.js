import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ScrollReveal } from '@/components/animations/ScrollReveal';
import ServiceCard from '@/components/ui/ServiceCard';
import { getServices } from '@/lib/actions/content';
import { ContactDialog } from '@/components/dialogs/ContactDialog';


export const metadata = {
    title: "Our Services | Fakhri IT Services - Amazon Seller Solutions",
    description: "Comprehensive Amazon seller services including account setup, product listing optimization, FBA operations, advertising management, and strategic growth consulting.",
    keywords: ["Amazon services", "product listing", "FBA operations", "Amazon advertising", "A+ content", "account management"],
    openGraph: {
        title: "Our Services | Fakhri IT Services",
        description: "Expert Amazon seller solutions to grow your business.",
        url: 'https://www.fakhriitservices.com/services',
        siteName: 'Fakhri IT Services',
        locale: 'en_US',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: "Our Services | Fakhri IT Services",
        description: "Expert Amazon seller solutions to grow your business.",
    }
};

export default async function ServicesPage() {
    const services = await getServices();

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: 'Amazon Seller Services',
        provider: {
            '@type': 'Organization',
            name: 'Fakhri IT Services',
            url: 'https://www.fakhriitservices.com'
        },
        hasOfferCatalog: {
            '@type': 'OfferCatalog',
            name: 'Amazon Seller Solutions',
            itemListElement: services.map((service, index) => ({
                '@type': 'Offer',
                itemOffered: {
                    '@type': 'Service',
                    name: service.title,
                    description: service.shortDescription
                },
                position: index + 1
            }))
        }
    };

    // Derive categories from service data
    const serviceCategories = services.reduce((acc, service) => {
        const existingCategory = acc.find(c => c.name === service.category);
        if (existingCategory) {
            existingCategory.services.push(service._id);
        } else {
            acc.push({ name: service.category, services: [service._id] });
        }
        return acc;
    }, []);

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            {/* Hero Section */}
            <section className="relative section-padding overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-linear-to-b from-primary/5 to-transparent -z-10" />
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10 animate-pulse" />
                <div className="absolute top-1/2 -left-24 w-72 h-72 bg-primary/5 rounded-full blur-3xl -z-10" />

                <div className="container-custom relative">
                    <ScrollReveal>
                        <div className="text-center max-w-4xl mx-auto">
                            <span className="badge-primary mb-6 animate-fade-in">Expert Marketplace Solutions</span>
                            <h1 className="heading-xl mb-8 tracking-tight">
                                Scale Your <span className="text-primary">Amazon Brand</span> <br />
                                with Precision & Strategy
                            </h1>
                            <p className="body-lg max-w-2xl mx-auto mb-10 text-balance">
                                We don&apos;t just manage accounts; we engineer growth. Our data-driven approach
                                ensures your brand dominates the most competitive marketplace in the world.
                            </p>
                            <div className="flex flex-wrap justify-center gap-4">
                                <ContactDialog
                                    trigger={
                                        <button className="btn-primary group shadow-red">
                                            Scale My Business Now
                                            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                        </button>
                                    }
                                />
                            </div>
                        </div>
                    </ScrollReveal>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-12 border-y border-border bg-card/50 backdrop-blur-sm">
                <div className="container-custom">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { label: "Active Brands", value: "50+" },
                            { label: "Sales Generated", value: "$10M+" },
                            { label: "Marketplaces", value: "12+" },
                            { label: "Success Rate", value: "98%" }
                        ].map((stat, i) => (
                            <div key={i} className="text-center group">
                                <div className="text-3xl md:text-4xl font-bold text-primary mb-1 group-hover:scale-110 transition-transform duration-300">{stat.value}</div>
                                <div className="text-xs md:text-sm font-semibold uppercase tracking-widest text-muted-foreground">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Service Categories Navigation */}
            {serviceCategories.length > 0 && (
                <section className="sticky top-[72px] z-30 bg-background/80 backdrop-blur-xl border-b border-border py-4">
                    <div className="container-custom">
                        <div className="flex flex-wrap justify-center gap-4">
                            {serviceCategories.map((category) => (
                                <a
                                    key={category.name}
                                    href={`#${category.services[0]}`}
                                    className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-primary transition-all relative group"
                                >
                                    {category.name}
                                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
                                </a>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* All Services */}
            <section className="section-padding bg-linear-to-b from-transparent via-secondary/20 to-transparent">
                <div className="container-custom">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                        <div className="max-w-2xl">
                            <h2 className="heading-lg mb-4">Our Service Catalog</h2>
                            <p className="body-md">Choose from our range of specialized services designed to target every growth lever of your Amazon business.</p>
                        </div>
                        <div className="text-sm font-medium text-muted-foreground italic border-l-2 border-primary pl-4 py-2">
                            * Click on any card to view detailed methodology and features.
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {services.map((service, index) => (
                            <ServiceCard key={service._id} service={service} index={index} variant="grid" />
                        ))}
                    </div>
                </div>
            </section>

            {/* Process Section */}
            <section className="section-padding overflow-hidden bg-secondary/30 text-foreground">
                <div className="container-custom relative">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[120px] -z-0" />

                    <div className="relative z-10">
                        <div className="text-center max-w-3xl mx-auto mb-16">
                            <span className="badge-primary mb-4 block w-fit mx-auto">Proven Framework</span>
                            <h2 className="heading-lg mb-6">How We Deliver Results</h2>
                            <p className="body-md text-lg">Our systematic approach ensures consistency, quality, and measurable growth for every brand we partner with.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                { step: "01", title: "Audit & Strategy", desc: "We perform a deep-dive audit of your account and competitors to identify immediate growth opportunities." },
                                { step: "02", title: "Implementation", desc: "Our specialists execute the strategy, optimizing listings, campaigns, and operations for peak performance." },
                                { step: "03", title: "Scale & Optimize", desc: "Constant monitoring and A/B testing allow us to push boundaries and find new heights for your brand." }
                            ].map((item, i) => (
                                <div key={i} className="card-premium border border-border group">
                                    <div className="text-5xl font-poppins font-bold text-muted-foreground/20 mb-6 group-hover:text-primary transition-colors duration-500">{item.step}</div>
                                    <h4 className="text-xl font-bold mb-4">{item.title}</h4>
                                    <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="section-padding bg-primary text-primary-foreground relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--brand-white)_1px,_transparent_1px)] bg-[size:40px_40px]" />
                </div>

                <div className="container-custom relative text-center">
                    <ScrollReveal>
                        <div className="max-w-3xl mx-auto">
                            <h2 className="heading-lg mb-6 text-white">
                                Ready to Dominate Your Category?
                            </h2>
                            <p className="text-white/80 text-lg mb-10">
                                Join dozens of successful brands that have scaled their Amazon business with our expert guidance. Let&apos;s build your empire together.
                            </p>
                            <div className="flex flex-wrap justify-center gap-4">
                                <ContactDialog
                                    trigger={
                                        <button className="px-10 py-4 bg-white text-primary font-bold rounded-xl hover:shadow-2xl transition-all hover:-translate-y-1">
                                            Book A Strategy Call
                                        </button>
                                    }
                                />
                                <Link href="/about" className="px-10 py-4 bg-primary-dark/20 border border-white/30 text-white font-bold rounded-xl hover:bg-white/10 transition-all">
                                    Learn About Us
                                </Link>
                            </div>
                        </div>
                    </ScrollReveal>
                </div>
            </section>
        </>
    );
}
