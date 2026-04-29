import { UserPlus, ShieldCheck, Lock, FileDown, School, GraduationCap, ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import teacherClassroom from "@/assets/teacher-classroom.jpg";

const features = [
  {
    icon: UserPlus,
    title: "Easy Student Registration",
    description: "Parents and teachers can add student details with a simple, guided form.",
  },
  {
    icon: ShieldCheck,
    title: "Teacher Verification",
    description: "Teachers review, verify, and approve student submissions before card generation.",
  },
  {
    icon: Lock,
    title: "Secure Admin Management",
    description: "Admins manage all schools, templates, and printing queues from one dashboard.",
  },
  {
    icon: FileDown,
    title: "PDF Download Support",
    description: "Download print-ready ID cards as PDFs. Preview before downloading for accuracy.",
  },
  {
    icon: GraduationCap,
    title: "Class & Division Lock",
    description: "Each teacher manages only their assigned class and division — no mix-ups.",
  },
  {
    icon: School,
    title: "Multi-School Support",
    description: "Manage hundreds of schools with unique templates, classes, and divisions.",
  },
];

export function Features() {
  return (
    <section className="py-20 sm:py-24 bg-gradient-section">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Intro split with image */}
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center mb-16 sm:mb-20">
          <div className="relative rounded-3xl overflow-hidden glass-card glow-brand-sm order-2 lg:order-1">
            <img
              src={teacherClassroom}
              alt="Teacher helping students with their notebooks in a bright classroom"
              loading="lazy"
              width={1280}
              height={1024}
              className="w-full h-auto object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-background/85 via-background/40 to-transparent">
              <p className="text-sm font-semibold">Built for teachers, loved by parents</p>
              <p className="text-xs text-muted-foreground mt-1">A workflow that respects your time and your students' privacy.</p>
            </div>
          </div>

          <div className="order-1 lg:order-2 text-center lg:text-left">
            <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">Why Greens</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
              Everything you need for{" "}
              <span className="gradient-text">school ID management</span>
            </h2>
            <p className="mt-4 text-muted-foreground max-w-xl mx-auto lg:mx-0">
              A complete workflow from student registration to printed ID cards,
              with teacher approval and admin oversight at every step.
            </p>
            <div className="mt-6 flex justify-center lg:justify-start">
              <Button variant="hero" size="lg" asChild>
                <Link to="/features">Explore all features <ArrowRight size={16} /></Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Feature grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="glass-card rounded-2xl p-6 hover:bg-surface-hover transition-all duration-300 hover:glow-brand-sm group hover:-translate-y-1"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/25 to-accent/20 text-primary group-hover:scale-110 transition-transform">
                <feature.icon size={22} />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
