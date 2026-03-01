'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Clock, Briefcase, ArrowRight, Search, Globe, BookOpen, IndianRupee, Heart, Users, Calendar, Filter } from 'lucide-react';
import { ScrollReveal, StaggerContainer, StaggerItem } from '@/components/animations/ScrollReveal';
import { JobApplicationDialog } from '@/components/dialogs/JobApplicationDialog';
import { Button } from '@/components/ui/button';

// Static Benefits Content
const careerBenefits = [
    {
        title: "Remote-First Culture",
        description: "Work from anywhere in the world with flexible hours",
        icon: Globe,
    },
    {
        title: "Learning & Growth",
        description: "Continuous training and professional development opportunities",
        icon: BookOpen,
    },
    {
        title: "Competitive Compensation",
        description: "Industry-leading salaries with performance bonuses",
        icon: IndianRupee,
    },
    {
        title: "Health & Wellness",
        description: "Comprehensive health insurance and wellness programs",
        icon: Heart,
    },
    {
        title: "Team Events",
        description: "Regular virtual and in-person team building activities",
        icon: Users,
    },
    {
        title: "Paid Time Off",
        description: "Generous vacation policy and paid holidays",
        icon: Calendar,
    },
];

export default function CareerContent({ jobs = [] }) {
    const [activeDept, setActiveDept] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");


    const departments = useMemo(() => {
        const depts = ["All", ...new Set(jobs.map(j => j.department))];
        return depts.filter(Boolean);
    }, [jobs]);

    const filteredJobs = useMemo(() => {
        let filtered = jobs;

        if (activeDept !== "All") {
            filtered = filtered.filter(job => job.department === activeDept);
        }

        if (searchQuery) {
            filtered = filtered.filter(job =>
                job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                job.department.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        return filtered.sort((a, b) => (a.order || 99) - (b.order || 99));
    }, [activeDept, searchQuery, jobs]);

    return (
        <>
            {/* Hero Section */}
            <section className="section-padding pt-32 md:pt-40 bg-gradient-to-b from-primary/5 to-background overflow-hidden relative">
                <div className="container-custom relative z-10">
                    <ScrollReveal>
                        <div className="text-center max-w-4xl mx-auto">
                            <span className="badge-primary mb-4">Careers</span>
                            <h1 className="heading-xl mb-6">
                                Join Our <span className="text-gradient">Growing Team</span>
                            </h1>
                            <p className="body-lg mb-8">
                                Be part of a dynamic team helping Amazon sellers achieve success.
                                Explore exciting career opportunities and grow with us.
                            </p>
                        </div>
                    </ScrollReveal>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="section-padding">
                <div className="container-custom">
                    <ScrollReveal>
                        <div className="text-center max-w-3xl mx-auto mb-16">
                            <h2 className="heading-lg mb-4">Why Work With Us?</h2>
                            <p className="body-md text-muted-foreground">
                                We've built an environment where talent thrives and innovation is celebrated.
                            </p>
                        </div>
                    </ScrollReveal>

                    <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {careerBenefits.map((benefit, index) => {
                            const Icon = benefit.icon;
                            return (
                                <StaggerItem key={index}>
                                    <div className="card-premium h-full group hover:border-primary/20 transition-all duration-300">
                                        <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary transition-colors duration-300">
                                            <Icon className="w-7 h-7 text-primary group-hover:text-white transition-colors duration-300" />
                                        </div>
                                        <h3 className="heading-sm mb-3">{benefit.title}</h3>
                                        <p className="text-muted-foreground text-sm leading-relaxed">{benefit.description}</p>
                                    </div>
                                </StaggerItem>
                            );
                        })}
                    </StaggerContainer>
                </div>
            </section>

            {/* Job Openings Section with Filtering */}
            <section className="section-padding bg-secondary/30">
                <div className="container-custom">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <ScrollReveal>
                            <h2 className="heading-lg mb-4">Open Positions</h2>
                            <p className="body-md text-muted-foreground">
                                We're looking for passionate individuals who want to redefine e-commerce success.
                            </p>
                        </ScrollReveal>
                    </div>

                    {/* Job Filter Controls */}
                    <div className="mb-12 space-y-6">
                        <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3">
                            {departments.map((dept) => (
                                <button
                                    key={dept}
                                    onClick={() => setActiveDept(dept)}
                                    className={`px-5 py-2 rounded-full text-xs md:text-sm font-bold transition-all duration-300 border ${activeDept === dept
                                        ? "bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-105"
                                        : "bg-background text-muted-foreground border-border hover:border-primary/50 hover:text-primary"
                                        }`}
                                >
                                    {dept}
                                </button>
                            ))}
                        </div>

                        <div className="max-w-md mx-auto relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <input
                                type="text"
                                placeholder="Search roles..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-11 pr-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm shadow-sm"
                            />
                        </div>
                    </div>

                    {/* Jobs List with Animation */}
                    <div className="max-w-5xl mx-auto min-h-[200px]">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeDept + searchQuery}
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.02 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-6"
                            >
                                {filteredJobs.length > 0 ? (
                                    filteredJobs.map((job) => (
                                        <div
                                            key={job._id}
                                            className="bg-card rounded-2xl p-6 md:p-8 border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 group"
                                        >
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                                <div className="flex-1">
                                                    <div className="flex flex-wrap items-center gap-3 mb-4">
                                                        <h3 className="text-xl md:text-2xl font-bold font-poppins group-hover:text-primary transition-colors">{job.title}</h3>
                                                        <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] md:text-xs font-bold rounded-full uppercase tracking-wider">
                                                            {job.department}
                                                        </span>
                                                    </div>

                                                    <p className="text-muted-foreground mb-6 line-clamp-2">{job.description}</p>

                                                    <div className="flex flex-wrap gap-6 text-sm">
                                                        <div className="flex items-center gap-2 text-foreground/70">
                                                            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                                                                <MapPin className="w-4 h-4 text-primary" />
                                                            </div>
                                                            <span className="font-medium">{job.location}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-foreground/70">
                                                            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                                                                <Clock className="w-4 h-4 text-primary" />
                                                            </div>
                                                            <span className="font-medium">{job.type}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-foreground/70">
                                                            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                                                                <Briefcase className="w-4 h-4 text-primary" />
                                                            </div>
                                                            <span className="font-medium">{job.experience}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row items-stretch gap-4">
                                                    <JobApplicationDialog
                                                        job={job}
                                                        trigger={
                                                            <Button className="btn bg-primary text-white hover:bg-primary/90 px-8 py-6 rounded-xl font-bold flex items-center justify-center gap-2 transition-all hover:scale-105 shadow-lg shadow-primary/20 group/btn">
                                                                Apply Now
                                                                <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                                                            </Button>
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="py-20 text-center">
                                        <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                                            <Filter className="w-10 h-10 text-muted-foreground" />
                                        </div>
                                        <h3 className="text-2xl font-bold mb-3">No matching positions</h3>
                                        <p className="text-muted-foreground mb-8">We couldn't find any job openings matching your search criteria.</p>
                                        <Button
                                            variant="outline"
                                            onClick={() => { setActiveDept("All"); setSearchQuery(""); }}
                                            className="rounded-full px-8"
                                        >
                                            Reset Filters
                                        </Button>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                </div>
            </section >
        </>
    );
}
