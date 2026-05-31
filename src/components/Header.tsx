import { Link, useLocation } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Menu, X, GraduationCap } from "lucide-react";
import { useState } from "react";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Features", to: "/features" },
  { label: "Templates", to: "/templates" },
  { label: "Contact", to: "/contact" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-glass-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <img src="/logo.png" alt="Mark One logo" className="h-9 w-auto object-contain" />
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  location.pathname === link.to
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/login">Login</Link>
            </Button>
            <Button variant="hero" size="sm" asChild>
              <Link to="/teacher-register">Teacher Register</Link>
            </Button>
          </div>

          <button
            className="md:hidden rounded-lg p-2 text-muted-foreground hover:text-foreground hover:bg-accent"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-glass-border md:hidden animate-fade-up">
          <div className="space-y-1 px-4 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="block rounded-lg px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex flex-col gap-2 pt-3 border-t border-border">
              <Button variant="heroOutline" size="lg" asChild>
                <Link to="/login" onClick={() => setMobileOpen(false)}>Login</Link>
              </Button>
              <Button variant="hero" size="lg" asChild>
                <Link to="/teacher-register" onClick={() => setMobileOpen(false)}>Teacher Register</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
