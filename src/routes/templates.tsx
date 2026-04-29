import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { TemplateShowcase } from "@/components/TemplateShowcase";

export const Route = createFileRoute("/templates")({
  component: TemplatesPage,
});

function TemplatesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-16">
        <TemplateShowcase />
      </div>
      <Footer />
    </div>
  );
}
