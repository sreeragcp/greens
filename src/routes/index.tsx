import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { VideoCarousel } from "@/components/VideoCarousel";
import { TemplateShowcase } from "@/components/TemplateShowcase";
import { Testimonials } from "@/components/Testimonials";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <Features />
      {/* <VideoCarousel /> */}
      <TemplateShowcase />
      {/* <Testimonials /> */}
      <Footer />
    </div>
  );
}
