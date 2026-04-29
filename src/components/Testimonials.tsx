import { Star, Quote } from "lucide-react";
import avatarPrincipal from "@/assets/avatar-principal.jpg";
import avatarParent from "@/assets/avatar-parent.jpg";
import avatarAdmin from "@/assets/avatar-admin.jpg";

const testimonials = [
  {
    name: "Priya Sharma",
    role: "Principal, DPS Noida",
    text: "Greens has revolutionized our ID card process. What used to take weeks now takes days with perfect accuracy.",
    avatar: avatarPrincipal,
  },
  {
    name: "Rajesh Kumar",
    role: "Parent, Class VII",
    text: "So easy to use! I verified my child's details in minutes and got the ID card delivered within a week. Amazing experience.",
    avatar: avatarParent,
  },
  {
    name: "Anita Desai",
    role: "Admin, St. Mary's School",
    text: "The teacher verification workflow ensures no errors. We've processed 2,000+ cards with zero issues this year.",
    avatar: avatarAdmin,
  },
];

export function Testimonials() {
  return (
    <section className="py-20 sm:py-24 bg-gradient-section">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14 sm:mb-16">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">Testimonials</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
            Trusted by <span className="gradient-text">educators everywhere</span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Real stories from principals, teachers, and parents using Greens every day.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="relative glass-card rounded-2xl p-6 hover:bg-surface-hover transition-all duration-300 hover:-translate-y-1 hover:glow-brand-sm"
            >
              <Quote size={28} className="absolute top-5 right-5 text-primary/20" />
              <div className="flex gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14} className="fill-accent text-accent" />
                ))}
              </div>
              <p className="text-sm text-foreground/90 leading-relaxed mb-6">"{t.text}"</p>
              <div className="flex items-center gap-3 pt-4 border-t border-border/60">
                <img
                  src={t.avatar}
                  alt={`Portrait of ${t.name}`}
                  loading="lazy"
                  width={48}
                  height={48}
                  className="h-12 w-12 rounded-full object-cover ring-2 ring-primary/30"
                />
                <div>
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
