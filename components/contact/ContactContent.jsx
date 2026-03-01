"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { ScrollReveal, StaggerContainer, StaggerItem } from '@/components/animations/ScrollReveal';
import {
    MapPin,
    Phone,
    Mail,
    Clock,
    MessageCircle,
    Send,
    Linkedin,
    Twitter,
    Facebook,
    Instagram
} from 'lucide-react';
import { submitContactForm } from '@/lib/actions/responses';

const contactSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    email: z.string().email({ message: "Invalid email address." }),
    phone: z.string().optional(),
    company: z.string().optional(),
    service: z.string().optional(),
    message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

export default function ContactContent({ company = null }) {

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(contactSchema),
        defaultValues: {
            name: '',
            email: '',
            phone: '',
            company: '',
            service: '',
            message: '',
        },
    });

    const onSubmit = async (data) => {
        try {
            const formData = {
                ...data,
                service: data.service || 'General Inquiry'
            };

            const result = await submitContactForm(formData);

            if (result.success) {
                toast.success("Message sent successfully!", {
                    description: "We'll get back to you soon.",
                });
                reset();
            } else {
                toast.error("Failed to send message: " + (result.error || "Unknown error"));
            }
        } catch (error) {
            console.error("Submission error:", error);
            toast.error("An error occurred while sending the message.");
        }
    };

    const socialIcons = [
        { icon: Linkedin, href: company?.contact?.social?.linkedin || '#', label: 'LinkedIn' },
        { icon: Twitter, href: company?.contact?.social?.twitter || '#', label: 'Twitter' },
        { icon: Facebook, href: company?.contact?.social?.facebook || '#', label: 'Facebook' },
        { icon: Instagram, href: company?.contact?.social?.instagram || '#', label: 'Instagram' },
    ];



    return (
        <>
            {/* Hero Section */}
            <section className="section-padding bg-gradient-to-b from-secondary/50 to-background">
                <div className="container-custom">
                    <ScrollReveal>
                        <div className="text-center max-w-3xl mx-auto">
                            <span className="badge-primary mb-4">Contact Us</span>
                            <h1 className="heading-xl mb-6">
                                Let&apos;s <span className="text-primary">Talk</span> About Your Growth
                            </h1>
                            <p className="body-lg">
                                Ready to take your Amazon business to the next level?
                                Get in touch with our team for a free consultation.
                            </p>
                        </div>
                    </ScrollReveal>
                </div>
            </section>

            {/* Contact Info Cards */}
            <section className="section-padding pt-8">
                <div className="container-custom">
                    <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                        <StaggerItem>
                            <motion.div className="card-premium text-center h-full" whileHover={{ y: -5 }}>
                                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                                    <MapPin className="w-7 h-7 text-primary" />
                                </div>
                                <h3 className="font-poppins font-semibold mb-2">Address</h3>
                                <p className="text-muted-foreground text-sm">
                                    {company?.contact?.address?.full || 'Mumbai, Maharashtra, India'}
                                </p>
                            </motion.div>
                        </StaggerItem>

                        <StaggerItem>
                            <motion.div className="card-premium text-center h-full" whileHover={{ y: -5 }}>
                                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                                    <Phone className="w-7 h-7 text-primary" />
                                </div>
                                <h3 className="font-poppins font-semibold mb-2">Phone</h3>
                                <a
                                    href={`tel:${company?.contact?.phone?.primary || ''}`}
                                    className="text-muted-foreground text-sm hover:text-primary transition-colors"
                                >
                                    {company?.contact?.phone?.primary || '+91 95844 26543'}
                                </a>
                            </motion.div>
                        </StaggerItem>

                        <StaggerItem>
                            <motion.div className="card-premium text-center h-full" whileHover={{ y: -5 }}>
                                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                                    <Mail className="w-7 h-7 text-primary" />
                                </div>
                                <h3 className="font-poppins font-semibold mb-2">Email</h3>
                                <a
                                    href={`mailto:${company?.contact?.email?.info || ''}`}
                                    className="text-muted-foreground text-sm hover:text-primary transition-colors"
                                >
                                    {company?.contact?.email?.info || 'info@fakhriit.com'}
                                </a>
                            </motion.div>
                        </StaggerItem>

                        <StaggerItem>
                            <motion.div className="card-premium text-center h-full" whileHover={{ y: -5 }}>
                                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                                    <Clock className="w-7 h-7 text-primary" />
                                </div>
                                <h3 className="font-poppins font-semibold mb-2">Hours</h3>
                                <p className="text-muted-foreground text-sm">
                                    {company?.contact?.hours?.weekdays || 'Mon - Fri: 10AM - 6PM'}
                                </p>
                            </motion.div>
                        </StaggerItem>
                    </StaggerContainer>
                </div>
            </section>

            {/* Contact Form & Info */}
            <section className="section-padding pt-0">
                <div className="container-custom">
                    <div className="grid lg:grid-cols-5 gap-12">
                        {/* Form */}
                        <ScrollReveal direction="left" className="lg:col-span-3">
                            <div className="bg-card rounded-2xl p-8 md:p-10 border border-border">
                                <h2 className="heading-md mb-6">Send Us a Message</h2>
                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label htmlFor="name" className="block text-sm font-medium mb-2">
                                                Full Name *
                                            </label>
                                            <input
                                                type="text"
                                                id="name"
                                                {...register('name')}
                                                className={`w-full px-4 py-3 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${errors.name ? 'border-destructive' : 'border-border'}`}
                                                placeholder="John Doe"
                                            />
                                            {errors.name && <p className="text-destructive text-xs mt-1">{errors.name.message}</p>}
                                        </div>
                                        <div>
                                            <label htmlFor="email" className="block text-sm font-medium mb-2">
                                                Email *
                                            </label>
                                            <input
                                                type="email"
                                                id="email"
                                                {...register('email')}
                                                className={`w-full px-4 py-3 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${errors.email ? 'border-destructive' : 'border-border'}`}
                                                placeholder="john@company.com"
                                            />
                                            {errors.email && <p className="text-destructive text-xs mt-1">{errors.email.message}</p>}
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label htmlFor="phone" className="block text-sm font-medium mb-2">
                                                Phone Number
                                            </label>
                                            <input
                                                type="tel"
                                                id="phone"
                                                {...register('phone')}
                                                className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                                placeholder="+91 95844 26543"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="company" className="block text-sm font-medium mb-2">
                                                Company Name
                                            </label>
                                            <input
                                                type="text"
                                                id="company"
                                                {...register('company')}
                                                className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                                placeholder="Your Company"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="service" className="block text-sm font-medium mb-2">
                                            Interested Service
                                        </label>
                                        <select
                                            id="service"
                                            {...register('service')}
                                            className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                        >
                                            <option value="">Select a service</option>
                                            <option value="account-management">Account Management</option>
                                            <option value="product-listing">Product Listing & Optimization</option>
                                            <option value="fba-operations">FBA Operations</option>
                                            <option value="ads-management">Amazon Ads Management</option>
                                            <option value="a-plus-content">A+ Content Creation</option>
                                            <option value="reconciliation">Reconciliation & Finance</option>
                                            <option value="growth-strategy">Growth Strategy</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label htmlFor="message" className="block text-sm font-medium mb-2">
                                            Message *
                                        </label>
                                        <textarea
                                            id="message"
                                            {...register('message')}
                                            rows={5}
                                            className={`w-full px-4 py-3 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none ${errors.message ? 'border-destructive' : 'border-border'}`}
                                            placeholder="Tell us about your Amazon business and goals..."
                                        />
                                        {errors.message && <p className="text-destructive text-xs mt-1">{errors.message.message}</p>}
                                    </div>

                                    <motion.button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="btn-primary w-full group disabled:opacity-70 disabled:cursor-not-allowed"
                                        whileHover={!isSubmitting ? { scale: 1.01 } : {}}
                                        whileTap={!isSubmitting ? { scale: 0.99 } : {}}
                                    >
                                        {isSubmitting ? 'Sending...' : 'Send Message'}
                                        {!isSubmitting && <Send className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                                    </motion.button>
                                </form>
                            </div>
                        </ScrollReveal>

                        {/* Sidebar */}
                        <ScrollReveal direction="right" className="lg:col-span-2">
                            <div className="space-y-8">
                                {/* WhatsApp CTA */}
                                <motion.a
                                    href={`https://wa.me/${company?.contact?.phone?.whatsapp || '919584426543'}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-8 text-white"
                                    whileHover={{ y: -5 }}
                                >
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center">
                                            <MessageCircle className="w-7 h-7" />
                                        </div>
                                        <div>
                                            <h3 className="font-poppins font-semibold text-lg">WhatsApp</h3>
                                            <p className="text-white/80 text-sm">Quick Response</p>
                                        </div>
                                    </div>
                                    <p className="text-white/90 mb-4">
                                        Chat with us directly on WhatsApp for quick responses an urgent inquiries.
                                    </p>
                                    <span className="inline-flex items-center font-semibold">
                                        Start Chat
                                        <MessageCircle className="ml-2 w-5 h-5" />
                                    </span>
                                </motion.a>

                                {/* Business Hours */}
                                <div className="bg-card rounded-2xl p-8 border border-border">
                                    <h3 className="font-poppins font-semibold text-lg mb-4">Business Hours</h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Monday - Friday</span>
                                            <span className="font-medium">{company?.contact?.hours?.weekdays || '10:00 AM - 6:00 PM'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Saturday</span>
                                            <span className="font-medium">By Appointment</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Sunday</span>
                                            <span className="font-medium">Closed</span>
                                        </div>
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-4">
                                        All times in IST (Indian Standard Time)
                                    </p>
                                </div>

                                {/* Social Links */}
                                <div className="bg-card rounded-2xl p-8 border border-border">
                                    <h3 className="font-poppins font-semibold text-lg mb-4">Follow Us</h3>
                                    <div className="flex gap-3">
                                        {socialIcons.map(({ icon: Icon, href, label }) => (
                                            <motion.a
                                                key={label}
                                                href={href}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                aria-label={label}
                                                className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                <Icon size={20} />
                                            </motion.a>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </ScrollReveal>
                    </div>
                </div>
            </section>
        </>
    );
}
