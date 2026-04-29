import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Features as FeaturesSection } from "@/components/Features";

export const Route = createFileRoute("/features")({
  component: FeaturesPage,
});

function FeaturesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-16">
        <FeaturesSection />
      </div>
      <Footer />
    </div>
  );
}
