"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { submitJobApplication } from "@/lib/actions/responses";
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
import { ScrollableContainer } from "@/components/ui/scrollable-container";

const jobApplicationSchema = z.object({
    fullName: z.string().min(2, { message: "Name must be at least 2 characters." }),
    email: z.string().email({ message: "Invalid email address." }),
    phone: z.string().min(10, { message: "Phone number too short." }),
    resume: z.string().url({ message: "Please provide a valid URL" }),
    coverLetter: z.string().optional(),
});

export function JobApplicationDialog({ job, trigger }) {
    const [open, setOpen] = useState(false);
    const form = useForm({
        resolver: zodResolver(jobApplicationSchema),
        defaultValues: {
            fullName: "",
            email: "",
            phone: "",
            coverLetter: "",
            resume: ""
        },
    });

    const onSubmit = async (data) => {
        try {
            const formData = {
                fullName: data.fullName,
                email: data.email,
                phone: data.phone,
                coverLetter: data.coverLetter,
                jobTitle: job?.title || "General Application",
                jobId: job?._id ? job._id.toString() : null,
                resume: data.resume || "No resume link provided"
            };

            const result = await submitJobApplication(formData);

            if (result.success) {
                toast.success(`Application submitted!`, {
                    description: "We'll be in touch soon."
                });
                form.reset();
                setOpen(false); // Auto close
            } else {
                toast.error("Failed: " + result.error);
            }
        } catch (error) {
            console.error("Application error:", error);
            toast.error("An error occurred. Please try again.");
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || <Button>Apply Now</Button>}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] max-h-[85vh] flex flex-col">
                <DialogHeader className="flex-shrink-0">
                    <DialogTitle>Apply for {job?.title || "Position"}</DialogTitle>
                    <DialogDescription>
                        Send us your details and resume. We'll get back to you shortly.
                    </DialogDescription>
                </DialogHeader>
                <ScrollableContainer className="flex-1 pr-2">
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4" id="application-form">
                        <div className="grid gap-2">
                            <Label htmlFor="fullName">Full Name</Label>
                            <Input id="fullName" {...form.register("fullName")} placeholder="John Doe" />
                            {form.formState.errors.fullName && (
                                <p className="text-destructive text-xs">{form.formState.errors.fullName.message}</p>
                            )}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" {...form.register("email")} placeholder="john@example.com" />
                                {form.formState.errors.email && (
                                    <p className="text-destructive text-xs">{form.formState.errors.email.message}</p>
                                )}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="phone">Phone</Label>
                                <Input id="phone" type="tel" {...form.register("phone")} placeholder="+1 (555) 000-0000" />
                                {form.formState.errors.phone && (
                                    <p className="text-destructive text-xs">{form.formState.errors.phone.message}</p>
                                )}
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="resume">Resume Link (Google Drive, Dropbox, etc.)</Label>
                            <Input
                                id="resume"
                                type="url"
                                placeholder="https://..."
                                {...form.register("resume")}
                            />
                            {form.formState.errors.resume && (
                                <p className="text-destructive text-xs">{form.formState.errors.resume.message}</p>
                            )}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="coverLetter">Cover Letter (Optional)</Label>
                            <Textarea id="coverLetter" {...form.register("coverLetter")} placeholder="Tell us why you're a good fit..." />
                        </div>
                    </form>
                </ScrollableContainer>
                <DialogFooter className="flex-shrink-0 pt-2">
                    <Button type="submit" form="application-form" disabled={form.formState.isSubmitting}>
                        {form.formState.isSubmitting ? "Submitting..." : "Submit Application"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
