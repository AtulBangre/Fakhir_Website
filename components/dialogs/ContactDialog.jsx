"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const contactSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    email: z.string().email({ message: "Invalid email address." }),
    phone: z.string().optional(),
    company: z.string().optional(),
    service: z.string().optional(),
    message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

import { ScrollableContainer } from "@/components/ui/scrollable-container";

export function ContactDialog({ trigger, defaultService }) {
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(contactSchema),
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            company: "",
            service: defaultService || "",
            message: "",
        },
    });

    const onSubmit = (data) => {
        // Mock API call
        console.log("Submitting contact form:", data);

        // Simulate network request
        setTimeout(() => {
            toast.success("Message sent successfully!", {
                description: "We'll get back to you within 24 hours.",
            });
            reset();
        }, 1000);
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                {trigger || <Button suppressHydrationWarning>Contact Us</Button>}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] max-h-[85vh] flex flex-col p-0 gap-0">
                <DialogHeader className="p-6 pb-2">
                    <DialogTitle>Get in Touch</DialogTitle>
                    <DialogDescription>
                        Fill out the form below and we'll get back to you as soon as possible.
                    </DialogDescription>
                </DialogHeader>
                <ScrollableContainer className="flex-1 p-6 pt-2">
                    <form id="contact-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input id="name" {...register("name")} placeholder="Your Name" />
                            {errors.name && <p className="text-destructive text-xs">{errors.name.message}</p>}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" {...register("email")} placeholder="you@example.com" />
                                {errors.email && <p className="text-destructive text-xs">{errors.email.message}</p>}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="phone">Phone (Optional)</Label>
                                <Input id="phone" type="tel" {...register("phone")} placeholder="+1 (555) 000-0000" />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="company">Company (Optional)</Label>
                            <Input id="company" {...register("company")} placeholder="Your Company" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="service">Interested Service</Label>
                            <Select onValueChange={(val) => setValue("service", val)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a service" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="account-management">Account Management</SelectItem>
                                    <SelectItem value="ppc">PPC Advertising</SelectItem>
                                    <SelectItem value="listing">Listing Optimization</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="message">Message</Label>
                            <Textarea id="message" {...register("message")} placeholder="How can we help you?" />
                            {errors.message && <p className="text-destructive text-xs">{errors.message.message}</p>}
                        </div>
                    </form>
                </ScrollableContainer>
                <DialogFooter className="flex-shrink-0 p-6 pt-2">
                    <Button type="submit" form="contact-form" disabled={isSubmitting}>
                        {isSubmitting ? "Sending..." : "Send Message"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
