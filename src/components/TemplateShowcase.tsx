import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import schoolCampus from "@/assets/school-campus.jpg";

const templates = [
  { name: "Classic Indigo", school: "Delhi Public School", color: "from-primary/30 to-brand-glow/25", initial: "D" },
  { name: "Royal Blue", school: "St. Xavier's High School", color: "from-blue-500/25 to-cyan-500/20", initial: "X" },
  { name: "Premium Gold", school: "National Academy", color: "from-yellow-500/25 to-orange-500/20", initial: "N" },
  { name: "Modern Coral", school: "Sunrise International", color: "from-accent/30 to-pink-500/20", initial: "S" },
];

export function TemplateShowcase() {
  return (
    <section className="py-20 sm:py-24 relative overflow-hidden">
      {/* Subtle background image */}
      <div className="absolute inset-0 -z-10 opacity-10">
        <img
          src={schoolCampus}
          alt=""
          aria-hidden="true"
          loading="lazy"
          width={1280}
          height={768}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14 sm:mb-16">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">Templates</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
            Beautiful <span className="gradient-text">ID card templates</span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Choose from professionally designed templates or customize your own to match your school's identity.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {templates.map((template) => (
            <div key={template.name} className="group">
              <div className={`glass-card rounded-2xl p-5 transition-all duration-300 hover:scale-[1.04] hover:glow-brand-sm bg-gradient-to-br ${template.color} aspect-[5/7] flex flex-col`}>
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-7 w-7 rounded-md bg-background/40 backdrop-blur flex items-center justify-center">
                    <span className="text-xs font-bold text-foreground">{template.initial}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold truncate">{template.school}</p>
                    <p className="text-[8px] text-muted-foreground">Student Identity Card</p>
                  </div>
                </div>
                <div className="flex gap-3 flex-1">
                  <div className="h-20 w-16 rounded bg-background/40 backdrop-blur flex items-center justify-center text-[8px] text-muted-foreground">
                    Photo
                  </div>
                  <div className="flex-1 space-y-1.5 pt-1">
                    <div className="h-2 w-full rounded bg-background/40" />
                    <div className="h-1.5 w-2/3 rounded bg-background/40" />
                    <div className="h-1.5 w-3/4 rounded bg-background/40" />
                    <div className="h-1.5 w-1/2 rounded bg-background/40" />
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-foreground/10 pt-2">
                  <p className="text-[8px] text-muted-foreground">Class IX-A</p>
                  <p className="text-[8px] font-medium">2025-26</p>
                </div>
              </div>
              <p className="text-center text-sm font-medium mt-3 text-muted-foreground group-hover:text-foreground transition-colors">{template.name}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button variant="heroOutline" size="lg" asChild>
            <Link to="/templates">Browse all templates <ArrowRight size={16} /></Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
