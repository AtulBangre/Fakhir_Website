"use client";

import Link from "next/link";
import { ArrowRight, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
const CTASection = () => {
    return (<section className="py-20 lg:py-32 bg-gradient-dark text-white">
      <div className="container">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Ready to Scale Your Amazon Business?
          </h2>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Join 500+ successful Amazon sellers who trust Fakhri IT Services 
            to manage and grow their businesses. Get your free consultation today.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="bg-white text-primary hover:bg-gray-100 shadow-lg" asChild>
              <Link href="/contact">
                Get Free Consultation
                <ArrowRight className="ml-2 h-4 w-4"/>
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild>
              <Link href="/pricing">View Pricing</Link>
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center text-sm text-gray-400">
            <div className="flex items-center gap-2 justify-center">
              <Phone className="h-4 w-4"/>
              <span>+1 (555) 123-4567</span>
            </div>
            <div className="flex items-center gap-2 justify-center">
              <Mail className="h-4 w-4"/>
              <span>hello@fakhriitservices.com</span>
            </div>
          </div>
        </div>
      </div>
    </section>);
};
export default CTASection;
