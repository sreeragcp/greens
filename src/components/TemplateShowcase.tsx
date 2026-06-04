import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { getTemplates } from "@/service/admin";
import schoolCampus from "@/assets/school-campus.jpg";

type ShowcaseTemplate = {
  id: string;
  name: string;
  school: string;
  color: string;
  initial: string;
  imageUrl?: string;
};

const placeholderTemplates: ShowcaseTemplate[] = [
  { id: "placeholder-1", name: "Classic Indigo", school: "Delhi Public School", color: "from-primary/30 to-brand-glow/25", initial: "D" },
  { id: "placeholder-2", name: "Royal Blue", school: "St. Xavier's High School", color: "from-blue-500/25 to-cyan-500/20", initial: "X" },
  { id: "placeholder-3", name: "Premium Gold", school: "National Academy", color: "from-yellow-500/25 to-orange-500/20", initial: "N" },
  { id: "placeholder-4", name: "Modern Coral", school: "Sunrise International", color: "from-accent/30 to-pink-500/20", initial: "S" },
];

const normalizeTemplate = (template: any): ShowcaseTemplate => {
  const name = template.name || template.template_name || template.file_name?.replace(/\.[^.]+$/, "") || "Untitled Template";
  const school = template.school_name || template.school || "Unknown School";
  const initial = name.charAt(0).toUpperCase() || "T";
  const imageUrl =
    template.file_url ||
    template.file ||
    template.url ||
    template.image ||
    template.image_url ||
    template.template_url ||
    undefined;

  return {
    id: String(template.id ?? template.template_id ?? template.pk ?? template.uuid ?? name),
    name,
    school,
    color: template.color || "from-primary/30 to-brand-glow/25",
    initial,
    imageUrl,
  };
};

export function TemplateShowcase() {
  const [templates, setTemplates] = useState<ShowcaseTemplate[]>(placeholderTemplates);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTemplates = async () => {
      try {
        const data = await getTemplates();
        const items = Array.isArray(data)
          ? data
          : Array.isArray(data?.results)
          ? data.results
          : Array.isArray(data?.data?.results)
          ? data.data.results
          : Array.isArray(data?.data)
          ? data.data
          : [];

        if (items.length > 0) {
          setTemplates(items.map(normalizeTemplate));
        }
      } catch (error) {
        console.error("Error loading templates:", error);
        toast.error("Unable to load templates");
      } finally {
        setLoading(false);
      }
    };

    loadTemplates();
  }, []);

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
        <div className="absolute inset-0 bg-linear-to-b from-background via-background/80 to-background" />
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
            <div key={template.id} className="group">
              <div className={`glass-card overflow-hidden rounded-3xl border border-border bg-surface shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${template.color}`}>
                <div className="relative h-64 overflow-hidden bg-slate-950/10">
                  {template.imageUrl ? (
                    <img
                      src={template.imageUrl}
                      alt={template.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
                      Preview unavailable
                    </div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent px-4 py-4">
                    <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground truncate">{template.school}</p>
                    <h3 className="mt-1 text-sm font-semibold leading-tight text-foreground truncate">{template.name}</h3>
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Class IX-A</span>
                    <span>2025-26</span>
                  </div>
                </div>
              </div>
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
