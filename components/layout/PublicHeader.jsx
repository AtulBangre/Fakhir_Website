"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "@/components/ui/Logo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ContactDialog } from "@/components/dialogs/ContactDialog";

const navigationItems = [
  { label: "Home", href: "/" },
  {
    label: "Company",
    href: "#",
    children: [
      { label: "About Us", href: "/about" },
      { label: "Career", href: "/career" },
      { label: "Testimonials", href: "/#testimonials" }
    ]
  },
  { label: "Services", href: "/services" },
  { label: "Within 2 Hours", href: "/within-2-hours" },
  { label: "Pricing", href: "/pricing" },
  {
    label: "Resources",
    href: "#",
    children: [
      { label: "Blog", href: "/blog" },
      { label: "FAQs", href: "/pricing#faq" }
    ]
  },
  { label: "Contact", href: "/contact" },
];

const PublicHeader = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const getDashboardUrl = (role) => {
    switch (role) {
      case 'super-admin': return '/super-admin/dashboard';
      case 'admin': return '/admin/dashboard';
      default: return '/client/dashboard';
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container-custom flex h-16 items-center justify-between">
        <Logo showTagline={false} />

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {navigationItems.map((item) => {
            if (item.children) {
              return (
                <DropdownMenu key={item.label}>
                  <DropdownMenuTrigger asChild>
                    <button className={`px-3 py-2 text-sm font-medium transition-colors rounded-md hover:bg-accent flex items-center gap-1 text-muted-foreground hover:text-foreground`}>
                      {item.label} <ChevronDown className="h-3 w-3" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    {item.children.map((child) => (
                      <DropdownMenuItem key={child.label} asChild>
                        <Link href={child.href}>{child.label}</Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              );
            }
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`px-3 py-2 text-sm font-medium transition-colors rounded-md hover:bg-accent ${isActive(item.href)
                  ? "text-primary font-semibold"
                  : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* CTA Buttons */}
        <div className="hidden lg:flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/login">Login</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/login">Get Started</Link>
          </Button>
        </div>


        {/* Mobile Menu Button */}
        <button
          className="lg:hidden p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden animate-slide-down border-t bg-background absolute w-full left-0 shadow-lg">
          <nav className="container-custom py-4 space-y-1">
            {navigationItems.map((item) => (
              <div key={item.label}>
                {item.children ? (
                  <div className="px-3 py-2">
                    <p className="text-sm font-semibold text-muted-foreground mb-1">{item.label}</p>
                    <div className="pl-2 space-y-1 border-l-2 border-border/50">
                      {item.children.map((child) => (
                        <Link
                          key={child.label}
                          href={child.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className="block px-3 py-2 text-sm text-foreground hover:bg-accent rounded-md"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-3 py-2 text-sm font-medium rounded-md transition-colors ${isActive(item.href)
                      ? "bg-primary/10 text-primary"
                      : "text-foreground hover:bg-accent"
                      }`}
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
            <div className="pt-4 space-y-2 border-t mt-4">
              <Button variant="outline" className="w-full" asChild onClick={() => setMobileMenuOpen(false)}>
                <Link href="/login">Login</Link>
              </Button>
              <Button className="w-full" asChild onClick={() => setMobileMenuOpen(false)}>
                <Link href="/login">Get Started</Link>
              </Button>
            </div>

          </nav>
        </div>
      )}
    </header>
  );
};

export default PublicHeader;
