import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { sendContactMessage } from "@/service/contact";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
});

function ContactPage() {
  const formRef = useRef<HTMLFormElement>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error("Please fill in your name, email, and message before sending.");
      return;
    }

    try {
      await sendContactMessage({
        name: name.trim(),
        email: email.trim(),
        subject: subject.trim() || "Test",
        message: message.trim(),
      });

      toast.success("Message sent successfully.", {
        description: "We will contact you soon.",
      });

      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
      formRef.current?.reset();
    } catch (error: any) {
      const message =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        error?.message ||
        "Unable to send your message. Please try again later.";
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-24 sm:pt-32 pb-16 sm:pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-16">
            <h1 className="text-3xl sm:text-4xl font-bold">
              Get in <span className="gradient-text">Touch</span>
            </h1>
            <p className="mt-4 text-muted-foreground">
              We'd love to hear from you. Reach out for demos, supports.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            <div className="space-y-6">
              {[
                {
                  icon: Mail,
                  label: "Email",
                  value: "advertising@markone.website",
                },
                { icon: Phone, label: "Phone", value: "+91 8589949006" },
                {
                  icon: MapPin,
                  label: "Address",
                  value: "Valiyavelicham\nKuthuparamba\nKerala, India",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="glass-card rounded-xl p-5 flex items-center gap-4"
                >
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <item.icon size={22} />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {item.label}
                    </p>
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
                    <Input
                      placeholder="Your name"
                      className="bg-surface border-border"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      className="bg-surface border-border"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Subject</Label>
                  <Input
                    placeholder="How can we help?"
                    className="bg-surface border-border"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Message</Label>
                  <textarea
                    rows={4}
                    placeholder="Tell us more..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="flex w-full rounded-md border border-border bg-surface px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
                  />
                </div>
                <Button
                  type="submit"
                  variant="hero"
                  size="lg"
                  className="w-full"
                >
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
