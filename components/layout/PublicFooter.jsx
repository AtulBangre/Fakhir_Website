"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Mail, Phone, MapPin, Linkedin, Twitter, Facebook, Instagram, Send, Loader2 } from "lucide-react";
import Logo from "@/components/ui/Logo";
import { getCompanyData } from "@/lib/actions/content";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const footerLinks = {
  services: [
    { label: "Account Management", href: "/services#account-management" },
    { label: "Product Listing", href: "/services#product-listing" },
    { label: "FBA Operations", href: "/services#fba-operations" },
    { label: "Ads Management", href: "/services#ads-management" },
    { label: "A+ Content", href: "/services#a-plus-content" },
  ],
  company: [
    { label: "About Us", href: "/about" },
    { label: "Career", href: "/career" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ],
  support: [
    { label: "Within 2 Hours", href: "/within-2-hours" },
    { label: "Pricing", href: "/pricing" },
    { label: "FAQs", href: "/pricing#faq" },
  ],
};

const PublicFooter = () => {
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await getCompanyData();
        setCompany(data);
      } catch (error) {
        console.error("Error loading company data for footer:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const onSubscribe = (data) => {
    console.log("Subscribing email:", data.email);
    setTimeout(() => {
      toast.success("Subscribed to newsletter!");
      reset();
    }, 1000);
  };

  if (loading) {
    return (
      <footer className="bg-brand-dark text-white pt-16 pb-8 border-t border-white/5">
        <div className="container-custom flex items-center justify-center p-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary/50" />
        </div>
      </footer>
    );
  }

  const companyName = company?.name || "Fakhri IT Services";
  const companyDescription = company?.description || "Empowering Amazon Sellers with strategic growth and expert account management.";
  const contact = company?.contact || {
    email: { general: "info@fakhriitservices.com" },
    phone: { primary: "+91 8982675004" },
    social: { linkedin: "#", twitter: "#", facebook: "#", instagram: "#" }
  };

  return (
    <footer className="bg-brand-dark text-white pt-16 pb-8">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-16">
          {/* Brand Column */}
          <div className="lg:col-span-4">
            <Logo variant="white" size="lg" />
            <p className="mt-4 text-gray-400 max-w-sm">
              {companyDescription}
            </p>
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-3 text-sm text-gray-400 group">
                <div className="p-2 rounded-lg bg-white/5 group-hover:bg-primary/20 transition-colors">
                  <Mail className="h-4 w-4 group-hover:text-primary transition-colors" />
                </div>
                <span>{contact.email?.general}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-400 group">
                <div className="p-2 rounded-lg bg-white/5 group-hover:bg-primary/20 transition-colors">
                  <Phone className="h-4 w-4 group-hover:text-primary transition-colors" />
                </div>
                <span>{contact.phone?.primary}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-400 group">
                <div className="p-2 rounded-lg bg-white/5 group-hover:bg-primary/20 transition-colors">
                  <MapPin className="h-4 w-4 group-hover:text-primary transition-colors" />
                </div>
                <span>Global Remote Team</span>
              </div>
            </div>
          </div>

          {/* Links Columns */}
          <div className="lg:col-span-2">
            <h4 className="font-heading font-semibold mb-6 text-lg">Services</h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-primary transition-colors block py-1">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="font-heading font-semibold mb-6 text-lg">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-primary transition-colors block py-1">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-4">
            <h4 className="font-heading font-semibold mb-6 text-lg">Stay Updated</h4>
            <p className="text-sm text-gray-400 mb-4">
              Subscribe to our newsletter for the latest Amazon insights and tips.
            </p>
            <form onSubmit={handleSubmit(onSubscribe)} className="space-y-3">
              <div className="relative">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  {...register("email", { required: true })}
                  className="h-12 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-primary/50 pr-12"
                />
                <Button
                  type="submit"
                  size="icon"
                  className="absolute right-1 top-1 h-10 w-10 bg-primary hover:bg-primary/90 text-white"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-gray-500">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </form>

            <div className="mt-8">
              <h5 className="text-sm font-semibold mb-4 text-gray-300">Follow Us</h5>
              <div className="flex gap-3">
                <a href={contact.social?.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white/5 text-gray-400 hover:bg-primary hover:text-white transition-all hover:-translate-y-1">
                  <Linkedin className="h-5 w-5" />
                </a>
                <a href={contact.social?.twitter} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white/5 text-gray-400 hover:bg-primary hover:text-white transition-all hover:-translate-y-1">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href={contact.social?.facebook} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white/5 text-gray-400 hover:bg-primary hover:text-white transition-all hover:-translate-y-1">
                  <Facebook className="h-5 w-5" />
                </a>
                <a href={contact.social?.instagram} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white/5 text-gray-400 hover:bg-primary hover:text-white transition-all hover:-translate-y-1">
                  <Instagram className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} {companyName}. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs text-gray-400 font-medium">Amazon SPN Partner</span>
              </div>
              <div className="hidden md:block w-px h-4 bg-gray-800" />
              <div className="flex gap-6">
                <Link href="/privacy-policy" className="text-xs text-gray-500 hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
                <Link href="/terms-conditions" className="text-xs text-gray-500 hover:text-primary transition-colors">
                  Terms & Conditions
                </Link>
                <Link href="/refund-policy" className="text-xs text-gray-500 hover:text-primary transition-colors">
                  Refund Policy
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default PublicFooter;

