"use client";

import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Image as ImageIcon, Link as LinkIcon, Upload as UploadIcon, X } from "lucide-react";

export function ImagePicker({ name, label, value: initialValue, onChange, className }) {
    const [mode, setMode] = useState("link"); // "link" | "upload"
    const [value, setValue] = useState(initialValue || "");
    const fileInputRef = useRef(null);

    useEffect(() => {
        setValue(initialValue || "");
    }, [initialValue]);

    const handleValueChange = (newValue) => {
        setValue(newValue);
        if (onChange) {
            onChange(newValue);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                handleValueChange(reader.result);
            };
            reader.readAsDataURL(file);
            // In future: Add Vercel Blob upload logic here
        }
    };

    const clearImage = () => {
        handleValueChange("");
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    return (
        <div className={`space-y-3 p-4 border rounded-lg bg-card/50 ${className}`}>
            <div className="flex items-center justify-between">
                <Label className="font-medium flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" />
                    {label || "Image"}
                </Label>
                <Tabs value={mode} onValueChange={setMode} className="w-[180px]">
                    <TabsList className="grid w-full grid-cols-2 h-8">
                        <TabsTrigger value="link" className="text-xs flex gap-1 items-center justify-center">
                            <LinkIcon className="w-3 h-3" /> Link
                        </TabsTrigger>
                        <TabsTrigger value="upload" className="text-xs flex gap-1 items-center justify-center">
                            <UploadIcon className="w-3 h-3" /> Upload
                        </TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>

            {/* Hidden input to ensure FormData picks up the value */}
            <input type="hidden" name={name} value={value} />

            <div className="space-y-3">
                {mode === "link" ? (
                    <Input
                        placeholder="https://example.com/image.jpg"
                        value={value}
                        onChange={(e) => handleValueChange(e.target.value)}
                        className="bg-background"
                    />
                ) : (
                    <div className="flex gap-2">
                        <Input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="bg-background file:text-foreground"
                        />
                    </div>
                )}

                {value && (
                    <div className="relative w-full aspect-video bg-muted rounded-md border overflow-hidden group">
                        <img
                            src={value}
                            alt="Preview"
                            className="w-full h-full object-contain bg-black/5"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "https://placehold.co/600x400?text=Invalid+Image+URL";
                            }}
                        />
                        <button
                            type="button"
                            onClick={clearImage}
                            className="absolute top-2 right-2 p-1.5 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/90"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
