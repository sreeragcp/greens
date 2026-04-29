import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Shield, Users, GraduationCap, Sparkles } from "lucide-react";
import heroStudents from "@/assets/hero-students.jpg";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center bg-gradient-hero overflow-hidden pt-20">
      {/* Glow orbs */}
      <div className="absolute top-1/4 -left-20 w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-primary/15 blur-3xl animate-glow-pulse pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-accent/15 blur-3xl animate-glow-pulse pointer-events-none" style={{ animationDelay: "1.5s" }} />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24 w-full">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* LEFT - copy */}
          <div className="text-center lg:text-left max-w-2xl mx-auto lg:mx-0">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary mb-6 animate-fade-up">
              <Shield size={14} />
              Trusted by 500+ Schools Across India
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight animate-fade-up-delay leading-[1.05]">
              Smart School{" "}
              <span className="gradient-text">ID Card</span>{" "}
              Management Portal
            </h1>

            <p className="mt-5 sm:mt-6 text-base sm:text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 animate-fade-up-delay-2">
              From student registration to printed cards — empower teachers,
              parents, and administrators with one secure, beautifully simple platform.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3 animate-fade-up-delay-2">
              <Button variant="hero" size="xl" asChild>
                <Link to="/teacher-register">
                  <GraduationCap size={18} />
                  Register as Teacher
                </Link>
              </Button>
              <Button variant="heroOutline" size="xl" asChild>
                <Link to="/login">
                  <Users size={18} />
                  User Login
                </Link>
              </Button>
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-3 text-xs sm:text-sm text-muted-foreground animate-fade-up-delay-2">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-primary animate-glow-pulse" />
                Secure OTP Login
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-accent animate-glow-pulse" style={{ animationDelay: "1s" }} />
                PDF Downloads
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-primary animate-glow-pulse" style={{ animationDelay: "2s" }} />
                Teacher Verified
              </div>
            </div>
          </div>

          {/* RIGHT - image + floating ID card */}
          <div className="relative animate-fade-up-delay-2">
            <div className="relative rounded-3xl overflow-hidden glass-card glow-brand">
              <img
                src={heroStudents}
                alt="Smiling Indian school students wearing ID cards on a school campus"
                width={1536}
                height={1024}
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-background/10 to-transparent" />
            </div>

            {/* Floating ID card */}
            <div className="absolute -bottom-6 -left-4 sm:-left-8 w-56 sm:w-64 animate-float">
              <div className="glass-card rounded-2xl p-4 glow-brand-sm border-primary/30">
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-7 w-7 rounded-lg bg-primary/25 flex items-center justify-center">
                    <span className="text-xs font-bold text-primary">G</span>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-primary tracking-wide">GREENS</p>
                    <p className="text-[9px] text-muted-foreground">Student ID Card</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="h-16 w-12 rounded-md bg-gradient-to-br from-primary/20 to-accent/20" />
                  <div className="flex-1 space-y-1.5 pt-1">
                    <div className="h-2 w-3/4 rounded bg-foreground/20" />
                    <div className="h-1.5 w-1/2 rounded bg-foreground/15" />
                    <div className="h-1.5 w-2/3 rounded bg-foreground/15" />
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <p className="text-[9px] text-muted-foreground">Class IX-A</p>
                  <p className="text-[9px] text-primary font-semibold">GRN-2026</p>
                </div>
              </div>
            </div>

            {/* Floating stat chip */}
            <div className="absolute -top-3 right-2 sm:-top-4 sm:-right-6 glass-card rounded-2xl px-3 py-2 sm:px-4 sm:py-3 glow-brand-sm animate-float" style={{ animationDelay: "1s" }}>
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-accent" />
                <div>
                  <p className="text-sm font-bold leading-none">50k+</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Cards issued</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
