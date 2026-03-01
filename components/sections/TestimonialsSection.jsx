"use client";

import { useState, useEffect } from "react";
import { Star, Quote, Loader2 } from "lucide-react";
import { getTestimonials } from "@/lib/actions/content";

const TestimonialsSection = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await getTestimonials();
        // Filter detailed testimonials and map to the format expected by the UI
        const detailed = data
          .filter(t => t.type === 'detailed' || !t.type)
          .map(t => ({
            name: t.author?.name || t.name,
            role: t.author?.role || t.role,
            company: t.author?.company || t.company,
            content: t.content,
            rating: t.rating || 5
          }));
        setTestimonials(detailed);
      } catch (error) {
        console.error("Error loading testimonials section:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <section className="py-20 lg:py-32 bg-accent/30 flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="h-10 w-10 animate-spin text-primary/50 mb-4" />
        <p className="text-muted-foreground animate-pulse">Loading testimonials...</p>
      </section>
    );
  }

  return (<section className="py-20 lg:py-32 bg-accent/30">
    <div className="container">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-primary font-medium text-sm uppercase tracking-wider">
          Testimonials
        </span>
        <h2 className="font-heading text-3xl md:text-4xl font-bold mt-4 mb-6">
          Trusted by 500+ Amazon Sellers
        </h2>
        <p className="text-muted-foreground text-lg">
          See what our clients have to say about their experience working with us.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {testimonials.length > 0 ? testimonials.slice(0, 3).map((testimonial, index) => (<div key={testimonial.name + index} className="relative p-6 rounded-xl bg-card border hover:shadow-lg transition-shadow">
          <Quote className="absolute top-6 right-6 h-8 w-8 text-primary/10" />

          <div className="flex gap-1 mb-4">
            {[...Array(testimonial.rating)].map((_, i) => (<Star key={i} className="h-4 w-4 fill-primary text-primary" />))}
          </div>

          <p className="text-muted-foreground mb-6">
            "{testimonial.content}"
          </p>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-white font-medium">
              {testimonial.name?.charAt(0) || "U"}
            </div>
            <div>
              <div className="font-medium text-sm">{testimonial.name}</div>
              <div className="text-xs text-muted-foreground">{testimonial.role}, {testimonial.company}</div>
            </div>
          </div>
        </div>)) : (
          <div className="col-span-full py-10 text-center text-muted-foreground">
            No testimonials found.
          </div>
        )}
      </div>
    </div>
  </section>);
};
export default TestimonialsSection;

