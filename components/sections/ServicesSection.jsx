"use client";

import Link from "next/link";
import { ShoppingCart, TrendingUp, FileText, Shield, BarChart3, Headphones, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
const services = [
    {
        icon: ShoppingCart,
        title: "Account Management",
        description: "Complete end-to-end management of your Amazon seller account with expert oversight.",
        features: ["Daily monitoring", "Issue resolution", "Performance optimization"],
    },
    {
        icon: Shield,
        title: "Brand Registry",
        description: "Protect your brand identity and unlock premium selling features on Amazon.",
        features: ["Trademark filing", "Brand protection", "Enhanced content access"],
    },
    {
        icon: FileText,
        title: "A+ Content",
        description: "Premium enhanced brand content that converts browsers into buyers.",
        features: ["Custom design", "Mobile optimized", "Conversion focused"],
    },
    {
        icon: TrendingUp,
        title: "PPC Management",
        description: "Data-driven advertising campaigns that maximize ROI and reduce ACOS.",
        features: ["Campaign optimization", "Keyword research", "Bid management"],
    },
    {
        icon: BarChart3,
        title: "Catalog Management",
        description: "Optimize product listings for maximum visibility and conversion rates.",
        features: ["SEO optimization", "Image enhancement", "Bullet points"],
    },
    {
        icon: Headphones,
        title: "24/7 Support",
        description: "Round-the-clock support for urgent issues with our Within 2 Hours service.",
        features: ["Instant response", "Expert guidance", "Issue escalation"],
    },
];
const ServicesSection = () => {
    return (<section className="py-20 lg:py-32 bg-background">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-primary font-medium text-sm uppercase tracking-wider">
            Our Services
          </span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold mt-4 mb-6">
            Comprehensive Amazon Seller Solutions
          </h2>
          <p className="text-muted-foreground text-lg">
            From account setup to scaling your business, we provide everything 
            you need to succeed on Amazon's marketplace.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (<div key={service.title} className="group relative p-6 rounded-xl bg-card border hover:border-primary/30 hover:shadow-lg transition-all duration-300" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <service.icon className="h-6 w-6 text-primary group-hover:text-primary-foreground"/>
              </div>

              <h3 className="font-heading font-semibold text-lg mb-2">
                {service.title}
              </h3>

              <p className="text-muted-foreground text-sm mb-4">
                {service.description}
              </p>

              <ul className="space-y-2 mb-6">
                {service.features.map((feature) => (<li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary"/>
                    {feature}
                  </li>))}
              </ul>

              <Link href="/services" className="inline-flex items-center text-sm font-medium text-primary hover:gap-2 transition-all">
                Learn more <ArrowRight className="ml-1 h-4 w-4"/>
              </Link>
            </div>))}
        </div>

        <div className="text-center mt-12">
          <Button size="lg" asChild>
            <Link href="/services">
              View All Services
              <ArrowRight className="ml-2 h-4 w-4"/>
            </Link>
          </Button>
        </div>
      </div>
    </section>);
};
export default ServicesSection;
