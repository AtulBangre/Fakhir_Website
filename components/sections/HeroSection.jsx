"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Star, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCompanyData } from "@/lib/actions/content";

const HeroSection = () => {
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await getCompanyData();
        setCompany(data);
      } catch (error) {
        console.error("Error loading company data for Hero:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <section className="relative overflow-hidden bg-gradient-hero min-h-[600px] flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary/50" />
      </section>
    );
  }

  const stats = [
    { value: company?.stats?.[0]?.value || "500+", label: company?.stats?.[0]?.label || "Sellers Trusted" },
    { value: company?.stats?.[3]?.value || "$50M+", label: company?.stats?.[3]?.label || "Client Revenue" },
    { value: company?.stats?.[1]?.value || "8+", label: company?.stats?.[1]?.label || "Years Experience" },
    { value: "98%", label: "Client Retention" },
  ];

  return (<section className="relative overflow-hidden bg-gradient-hero">
    {/* Background Pattern */}
    <div className="absolute inset-0 opacity-[0.03]" style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23880808' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
    }} />

    <div className="container relative py-20 lg:py-32">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        {/* Content */}
        <div className="space-y-8 animate-slide-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
            <Star className="h-4 w-4 fill-current" />
            Amazon SPN & Affiliate Partner
          </div>

          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-foreground">
            No.1 Growth Partner for{" "}
            <span className="text-primary">Amazon Sellers</span>
          </h1>

          <p className="text-lg text-muted-foreground max-w-lg">
            {company?.description || "Transform your Amazon business with expert account management, strategic PPC campaigns, and premium brand services. Trusted by 500+ sellers since 2016."}
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" asChild className="shadow-brand">
              <Link href="/contact">
                Get Free Consultation
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/services">Explore Services</Link>
            </Button>
          </div>

          <div className="flex flex-wrap gap-4 pt-4">
            {["Brand Registry", "A+ Content", "PPC Management", "24/7 Support"].map((item) => (<div key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              {item}
            </div>))}
          </div>
        </div>

        {/* Stats Card */}
        <div className="relative">
          <div className="bg-card rounded-2xl shadow-xl border p-8 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat, index) => (<div key={stat.label} className="text-center p-4 rounded-lg bg-accent/50" style={{ animationDelay: `${0.3 + index * 0.1}s` }}>
                <div className="text-3xl lg:text-4xl font-heading font-bold text-primary">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {stat.label}
                </div>
              </div>))}
            </div>

            <div className="mt-8 p-4 rounded-lg bg-primary/5 border border-primary/10">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (<div key={i} className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-white text-xs font-medium ring-2 ring-white">
                    {String.fromCharCode(64 + i)}
                  </div>))}
                </div>
                <div className="text-sm">
                  <span className="font-semibold">{company?.stats?.[2]?.value || "25+"}+ expert account managers</span>
                  <p className="text-muted-foreground">Ready to scale your business</p>
                </div>
              </div>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl" />
          <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
        </div>
      </div>
    </div>
  </section>);
};
export default HeroSection;

