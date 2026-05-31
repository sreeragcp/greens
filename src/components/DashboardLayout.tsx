import { Link, useLocation } from "@tanstack/react-router";
import { type ReactNode } from "react";
import { type LucideIcon, Menu, X, LogOut } from "lucide-react";
import { useState } from "react";

interface SidebarItem {
  label: string;
  to: string;
  icon: LucideIcon;
}

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
  role: string;
  items: SidebarItem[];
}

export function DashboardLayout({ children, title, role, items }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar - desktop */}
      <aside className="hidden lg:flex lg:w-64 flex-col border-r border-border bg-surface fixed inset-y-0 left-0 z-30">
        <div className="flex h-16 items-center gap-2 px-6 border-b border-border">
          <img src="/logo.png" alt="Mark One logo" className="h-8 w-auto object-contain" />
          <div>
            <span className="text-sm font-bold gradient-text sr-only">Mark One</span>
            <p className="text-[10px] text-muted-foreground">{role} Portal</p>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {items.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
                location.pathname === item.to
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-3 border-t border-border">
          <Link
            to="/login"
            className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            <LogOut size={18} />
            Sign Out
          </Link>
        </div>
      </aside>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <aside className="relative w-72 h-full bg-surface border-r border-border flex flex-col animate-slide-in-left">
            <div className="flex h-16 items-center justify-between px-6 border-b border-border">
              <div className="flex items-center gap-2">
              <img src="/logo.png" alt="Mark One logo" className="h-8 w-auto object-contain" />
              <span className="text-sm font-bold gradient-text sr-only">Mark One</span>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X size={20} />
              </button>
            </div>
            <nav className="flex-1 p-3 space-y-1">
              {items.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
                    location.pathname === item.to
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  }`}
                >
                  <item.icon size={18} />
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="p-3 border-t border-border">
              <Link
                to="/login"
                onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              >
                <LogOut size={18} />
                Sign Out
              </Link>
            </div>
          </aside>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 lg:ml-64">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border bg-surface/80 backdrop-blur-md px-4 sm:px-6">
          <button className="lg:hidden text-muted-foreground hover:text-foreground" onClick={() => setSidebarOpen(true)}>
            <Menu size={20} />
          </button>
          <h1 className="text-base sm:text-lg font-semibold truncate">{title}</h1>
        </header>
        <div className="p-4 sm:p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
