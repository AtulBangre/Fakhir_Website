"use client";
import { useState } from "react";
import { Outlet, useLocation } from "next/link";
import Link from "next/link";
import { LayoutDashboard, CreditCard, CheckSquare, FileText, Receipt, User, Menu, X, LogOut, Bell } from "lucide-react";
import Logo from "@/components/ui/Logo";
import DashboardNavLink from "@/components/dashboard/DashboardNavLink";
import { Button } from "@/components/ui/button";
const navigation = [
    { name: "Dashboard", href: "/client/dashboard", icon: LayoutDashboard },
    { name: "My Plan", href: "/client/plan", icon: CreditCard },
    { name: "Tasks", href: "/client/tasks", icon: CheckSquare },
    { name: "Files", href: "/client/files", icon: FileText },
    { name: "Billing", href: "/client/billing", icon: Receipt },
    { name: "Profile", href: "/client/profile", icon: User },
];
const ClientDashboardLayout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const pathname = usePathname();
    return (<div className="min-h-screen flex bg-accent/30">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (<div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)}/>)}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-card border-r transform transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-16 flex items-center justify-between px-4 border-b">
            <Logo />
            <button className="lg:hidden" onClick={() => setSidebarOpen(false)}>
              <X className="h-5 w-5"/>
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => (<DashboardNavLink key={item.name} to={item.href} icon={item.icon}>
                {item.name}
              </DashboardNavLink>))}
          </nav>

          {/* User Section */}
          <div className="p-4 border-t">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                JD
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">John Doe</p>
                <p className="text-xs text-muted-foreground truncate">Premium Plan</p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="w-full" asChild>
              <Link href="/">
                <LogOut className="mr-2 h-4 w-4"/>
                Sign Out
              </Link>
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="h-16 bg-card border-b flex items-center justify-between px-4 lg:px-6">
          <button className="lg:hidden p-2" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-5 w-5"/>
          </button>

          <div className="hidden lg:block">
            <h1 className="text-lg font-heading font-semibold">
              {navigation.find(n => n.href === pathname)?.name || "Dashboard"}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button className="p-2 rounded-lg hover:bg-accent relative">
              <Bell className="h-5 w-5"/>
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"/>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>);
};
export default ClientDashboardLayout;
