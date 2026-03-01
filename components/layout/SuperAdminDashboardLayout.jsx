"use client";
import { useState } from "react";
import { Outlet, useLocation } from "next/link";
import Link from "next/link";
import { LayoutDashboard, Users, UsersRound, UserCog, CheckSquare, DollarSign, FileBarChart, Settings, Menu, X, LogOut, Bell, Shield } from "lucide-react";
import Logo from "@/components/ui/Logo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
const navigation = [
    { name: "Dashboard", href: "/super-admin/dashboard", icon: LayoutDashboard },
    { name: "Clients", href: "/super-admin/clients", icon: Users },
    { name: "Teams", href: "/super-admin/teams", icon: UsersRound },
    { name: "Admin Users", href: "/super-admin/admins", icon: UserCog },
    { name: "Tasks", href: "/super-admin/tasks", icon: CheckSquare },
    { name: "Sales & Revenue", href: "/super-admin/sales", icon: DollarSign },
    { name: "Reports", href: "/super-admin/reports", icon: FileBarChart },
    { name: "Settings", href: "/super-admin/settings", icon: Settings },
];
const SuperAdminDashboardLayout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const pathname = usePathname();
    return (<div className="min-h-screen flex bg-accent/30">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (<div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)}/>)}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-brand-dark text-white transform transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Logo variant="white"/>
              <Badge className="bg-primary text-primary-foreground text-xs">
                <Shield className="h-3 w-3 mr-1"/>
                Super Admin
              </Badge>
            </div>
            <button className="lg:hidden text-white" onClick={() => setSidebarOpen(false)}>
              <X className="h-5 w-5"/>
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => (<Link key={item.name} href={item.href} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${pathname === item.href
                ? "bg-primary text-primary-foreground"
                : "text-gray-300 hover:bg-white/10 hover:text-white"}`}>
                <item.icon className="h-5 w-5 flex-shrink-0"/>
                <span>{item.name}</span>
              </Link>))}
          </nav>

          {/* User Section */}
          <div className="p-4 border-t border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center font-medium">
                AD
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">Admin User</p>
                <p className="text-xs text-gray-400 truncate">Super Administrator</p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="w-full border-white/20 text-white hover:bg-white/10" asChild>
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
              <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full"/>
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
export default SuperAdminDashboardLayout;
