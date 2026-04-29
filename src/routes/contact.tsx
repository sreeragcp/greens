import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin } from "lucide-react";
import { useRef } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
});

function ContactPage() {
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast.success("Message sent!", {
      description: "We'll get back to you within 24 hours.",
    });
    formRef.current?.reset();
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-24 sm:pt-32 pb-16 sm:pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-16">
            <h1 className="text-3xl sm:text-4xl font-bold">Get in <span className="gradient-text">Touch</span></h1>
            <p className="mt-4 text-muted-foreground">We'd love to hear from you. Reach out for demos, support, or partnerships.</p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            <div className="space-y-6">
              {[
                { icon: Mail, label: "Email", value: "contact@greens.in" },
                { icon: Phone, label: "Phone", value: "+91 98765 43210" },
                { icon: MapPin, label: "Address", value: "New Delhi, India" },
              ].map((item) => (
                <div key={item.label} className="glass-card rounded-xl p-5 flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <item.icon size={22} />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{item.label}</p>
                    <p className="font-medium">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="glass-card rounded-2xl p-5 sm:p-6">
              <form ref={formRef} className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Name</Label>
                    <Input placeholder="Your name" className="bg-surface border-border" />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input type="email" placeholder="you@example.com" className="bg-surface border-border" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Subject</Label>
                  <Input placeholder="How can we help?" className="bg-surface border-border" />
                </div>
                <div className="space-y-2">
                  <Label>Message</Label>
                  <textarea
                    rows={4}
                    placeholder="Tell us more..."
                    className="flex w-full rounded-md border border-border bg-surface px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
                  />
                </div>
                <Button type="submit" variant="hero" size="lg" className="w-full">Send Message</Button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
