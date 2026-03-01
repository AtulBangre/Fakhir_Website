'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Linkedin, Twitter, Facebook, Instagram, Mail, Phone, MapPin } from 'lucide-react';

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

export default function Footer({ initialCompany = null }) {
    const company = initialCompany;
    const currentYear = new Date().getFullYear();

    const socialIcons = [
        { icon: Linkedin, href: company?.contact?.social?.linkedin || '#', label: 'LinkedIn' },
        { icon: Twitter, href: company?.contact?.social?.twitter || '#', label: 'Twitter' },
        { icon: Facebook, href: company?.contact?.social?.facebook || '#', label: 'Facebook' },
        { icon: Instagram, href: company?.contact?.social?.instagram || '#', label: 'Instagram' },
    ];

    return (
        <footer className="bg-foreground text-background">
            {/* Main Footer */}
            <div className="container-custom section-padding pb-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {/* Company Info */}
                    <div className="lg:col-span-1">
                        <Link href="/" className="flex items-center gap-2 mb-6">
                            <img
                                src={'/Fakhri_White.png'}
                                alt="Fakhri IT Services"
                                className="h-8 w-auto brightness-0 invert"
                            />
                        </Link>
                        <p className="text-background/70 mb-6 text-sm leading-relaxed">
                            {company?.tagline || 'Leading Amazon Seller Services Provider'}. Your trusted partner for Amazon success since {company?.established || '2016'}.
                        </p>
                        <div className="flex gap-3">
                            {socialIcons.map(({ icon: Icon, href, label }) => (
                                <motion.a
                                    key={label}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={label}
                                    className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary transition-colors duration-300"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Icon size={18} />
                                </motion.a>
                            ))}
                        </div>
                    </div>

                    {/* Services Links */}
                    <div>
                        <h4 className="font-poppins font-semibold text-lg mb-6">Services</h4>
                        <ul className="space-y-3">
                            {footerLinks.services.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-background/70 hover:text-background transition-colors duration-200 text-sm"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company Links */}
                    <div>
                        <h4 className="font-poppins font-semibold text-lg mb-6">Company</h4>
                        <ul className="space-y-3">
                            {footerLinks.company.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-background/70 hover:text-background transition-colors duration-200 text-sm"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                            {footerLinks.support.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-background/70 hover:text-background transition-colors duration-200 text-sm"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="font-poppins font-semibold text-lg mb-6">Contact</h4>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <MapPin size={18} className="text-primary mt-0.5 flex-shrink-0" />
                                <span className="text-background/70 text-sm">
                                    {company?.contact?.address?.full || 'Mumbai, Maharashtra, India'}
                                </span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone size={18} className="text-primary flex-shrink-0" />
                                <a
                                    href={`tel:${company?.contact?.phone?.primary || ''}`}
                                    className="text-background/70 hover:text-background transition-colors text-sm"
                                >
                                    {company?.contact?.phone?.primary || '+91 95844 26543'}
                                </a>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail size={18} className="text-primary flex-shrink-0" />
                                <a
                                    href={`mailto:${company?.contact?.email?.info || ''}`}
                                    className="text-background/70 hover:text-background transition-colors text-sm"
                                >
                                    {company?.contact?.email?.info || 'info@fakhriit.com'}
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-background/10">
                <div className="container-custom py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-background/60 text-sm">
                            © {currentYear} {company?.name || 'Fakhri IT Services'}. All rights reserved.
                        </p>
                        <div className="flex gap-6">
                            <Link href="/privacy-policy" className="text-background/60 hover:text-background text-sm transition-colors">
                                Privacy Policy
                            </Link>
                            <Link href="/terms-conditions" className="text-background/60 hover:text-background text-sm transition-colors">
                                Terms & Conditions
                            </Link>
                            <Link href="/refund-policy" className="text-background/60 hover:text-background text-sm transition-colors">
                                Refund Policy
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
