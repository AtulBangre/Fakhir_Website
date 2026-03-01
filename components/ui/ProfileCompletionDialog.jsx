"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateUser } from "@/lib/actions/user";
import { Loader2 } from "lucide-react";
import { toast } from "sonner"; // Assuming sonner is used for toasts based on file list

export default function ProfileCompletionDialog({ user, open, onComplete }) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        company: "",
        location: "",
        gstNo: ""
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || "",
                email: user.email || "",
                phone: user.phone || "",
                company: user.company || "",
                location: user.location || "",
                gstNo: user.gstNo || ""
            });
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation based on role
        const isAdmin = user?.role === 'admin';
        const requiredFields = isAdmin
            ? ["name", "email", "phone"]
            : ["name", "email", "phone", "company", "location", "gstNo"];

        const missing = requiredFields.filter(field => !formData[field]?.trim());

        if (missing.length > 0) {
            toast.error(`Please fill in all fields: ${missing.join(", ")}`);
            return;
        }

        // GST Validation
        const gst = (formData.gstNo || "").trim().toUpperCase();
        if (gst && gst !== "NA" && gst.length !== 15) {
            toast.error("GST Number must be exactly 15 characters, or 'NA'");
            return;
        }

        const finalFormData = {
            ...formData,
            gstNo: gst || "NA"
        };

        setLoading(true);
        try {
            const updatedUser = await updateUser(user._id, finalFormData);
            if (updatedUser) {
                toast.success("Profile updated successfully!");
                onComplete(updatedUser);
            } else {
                toast.error("Failed to update profile. Please try again.");
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const isAdmin = user?.role === 'admin';

    return (
        <Dialog open={open} onOpenChange={() => { }}>
            <DialogContent className="sm:max-w-[425px] [&>button]:hidden interactive-none" onPointerDownOutside={(e) => e.preventDefault()} onEscapeKeyDown={(e) => e.preventDefault()}>
                <DialogHeader>
                    <DialogTitle>Complete Your Profile</DialogTitle>
                    <DialogDescription>
                        {isAdmin
                            ? "Please provide your basic contact details to continue."
                            : "Please provide your details to continue to the dashboard. All fields are required."
                        }
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="John Doe"
                            required
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="john@example.com"
                            required
                            disabled
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="+1234567890"
                            required
                        />
                    </div>

                    {!isAdmin && (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="company">Company</Label>
                                <Input
                                    id="company"
                                    name="company"
                                    value={formData.company}
                                    onChange={handleChange}
                                    placeholder="Acme Inc."
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="location">Location</Label>
                                <Input
                                    id="location"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    placeholder="New York, NY"
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="gstNo">GST Number</Label>
                                <Input
                                    id="gstNo"
                                    name="gstNo"
                                    value={formData.gstNo}
                                    onChange={(e) => {
                                        const val = e.target.value.toUpperCase();
                                        if (val.length <= 15) {
                                            setFormData(prev => ({ ...prev, gstNo: val }));
                                        }
                                    }}
                                    placeholder="22AAAAA0000A1Z5 or NA"
                                    required
                                />
                                <p className="text-[10px] text-muted-foreground italic">Size 15 for GST, or "NA" for not available.</p>
                            </div>
                        </>
                    )}

                    <DialogFooter>
                        <Button type="submit" disabled={loading} className="w-full">
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {loading ? "Updating..." : "Save & Continue"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
