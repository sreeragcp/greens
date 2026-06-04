import { Link } from "@tanstack/react-router";
import { Mail, Phone, MapPin, GraduationCap } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/60 py-12 sm:py-16 bg-gradient-section">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <img src="/logo.png" alt="Mark One logo" className="h-9 w-auto object-contain" />
              <span className="sr-only">Mark One</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Smart school ID card management platform trusted by 500+ schools across India.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-4">Product</h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li><Link to="/features" className="hover:text-primary transition-colors">Features</Link></li>
              <li><Link to="/templates" className="hover:text-primary transition-colors">Templates</Link></li>
              <li><Link to="/login" className="hover:text-primary transition-colors">Login</Link></li>
              <li><Link to="/teacher-register" className="hover:text-primary transition-colors">Teacher Register</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-4">Company</h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li><Link to="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
              <li><a href="mailto:contact@markone.in" className="hover:text-primary transition-colors">About Us</a></li>
              <li><a href="mailto:contact@markone.in" className="hover:text-primary transition-colors">Privacy Policy</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-4">Get in Touch</h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li className="flex items-center gap-2"><Mail size={14} className="text-primary" /> advertising@markone.website</li>
              <li className="flex items-center gap-2"><Phone size={14} className="text-primary" /> +91 8589949006</li>
              <li className="flex items-center gap-2"><MapPin size={14} className="text-primary" /> Kuthuparamba, Kerala</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Mark One. All rights reserved.</p>
          <p className="text-xs">Crafted with care for Indian schools.</p>
        </div>
      </div>
    </footer>
  );
}
