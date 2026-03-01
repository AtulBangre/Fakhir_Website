'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Facebook,
    Twitter,
    Linkedin,
    Instagram,
    Link as LinkIcon,
    MessageCircle,
    Ghost,
    Check,
    Share2,
    X
} from 'lucide-react';

export default function ShareButtons({ title, slug }) {
    const [baseUrl, setBaseUrl] = useState(() => {
        if (typeof window !== 'undefined') {
            return window.location.origin;
        }
        return '';
    });
    const [copied, setCopied] = useState(false);
    const [isOpen, setIsOpen] = useState(false);


    const url = `${baseUrl}/blog/${slug}`;
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);

    const handleCopy = () => {
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleShare = (network) => {
        let shareUrl = '';
        switch (network) {
            case 'whatsapp':
                shareUrl = `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`;
                break;
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
                break;
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
                break;
            case 'linkedin':
                shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
                break;
            case 'snapchat':
                shareUrl = `https://www.snapchat.com/scan?attachmentUrl=${encodedUrl}`;
                break;
            default:
                break;
        }

        if (shareUrl) {
            window.open(shareUrl, '_blank', 'width=600,height=400');
        }
        // Optional: Close modal after click? Maybe keep open.
    };

    const buttons = [
        { id: 'whatsapp', icon: MessageCircle, label: 'WhatsApp', color: 'hover:text-[#25D366] hover:bg-[#25D366]/10' },
        { id: 'instagram', icon: Instagram, label: 'Instagram', color: 'hover:text-[#E4405F] hover:bg-[#E4405F]/10', action: handleCopy },
        { id: 'linkedin', icon: Linkedin, label: 'LinkedIn', color: 'hover:text-[#0A66C2] hover:bg-[#0A66C2]/10' },
        { id: 'twitter', icon: Twitter, label: 'Twitter', color: 'hover:text-[#1DA1F2] hover:bg-[#1DA1F2]/10' },
        { id: 'facebook', icon: Facebook, label: 'Facebook', color: 'hover:text-[#1877F2] hover:bg-[#1877F2]/10' },
        { id: 'snapchat', icon: Ghost, label: 'Snapchat', color: 'hover:text-[#FFFC00] hover:bg-[#FFFC00]/10' },
    ];

    return (
        <>
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="font-poppins font-semibold text-lg mb-1">
                        Found this helpful?
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        Share this article with your network
                    </p>
                </div>
                <button
                    onClick={() => setIsOpen(true)}
                    className="p-3 bg-primary/10 rounded-full hover:bg-primary/20 transition-colors text-primary"
                >
                    <Share2 className="w-5 h-5" />
                </button>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        />

                        {/* Modal */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-sm bg-card rounded-2xl shadow-xl overflow-hidden border border-border"
                        >
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-xl font-bold font-poppins">Share Article</h3>
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="grid grid-cols-4 gap-4 mb-6">
                                    {buttons.map((btn) => {
                                        const Icon = btn.icon;
                                        return (
                                            <div key={btn.id} className="flex flex-col items-center gap-2">
                                                <button
                                                    onClick={() => btn.action ? btn.action() : handleShare(btn.id)}
                                                    className={`w-12 h-12 rounded-xl border border-border bg-background flex items-center justify-center transition-all duration-200 group ${btn.color}`}
                                                    title={`Share on ${btn.label}`}
                                                >
                                                    <Icon className="w-6 h-6 text-muted-foreground group-hover:text-inherit transition-colors" />
                                                </button>
                                                <span className="text-xs text-muted-foreground">{btn.label}</span>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="relative">
                                    <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 border border-border">
                                        <LinkIcon className="w-4 h-4 text-muted-foreground shrink-0" />
                                        <p className="text-sm text-muted-foreground truncate flex-1">
                                            {url}
                                        </p>
                                        <button
                                            onClick={handleCopy}
                                            className="ml-2 p-2 rounded-md hover:bg-background transition-colors text-primary font-medium text-xs flex items-center gap-1"
                                        >
                                            {copied ? (
                                                <>
                                                    <Check className="w-3 h-3" /> Copied
                                                </>
                                            ) : (
                                                "Copy"
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
