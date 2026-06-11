import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { School, Plus, MapPin, Hash, Flag } from "lucide-react";
import { adminSidebar } from "@/lib/nav";
import { getSchools, createSchool } from "@/service/admin";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/schools")({
  component: AdminSchools,
});

const initialForm = {
  name: "",
  code: "",
  city: "",
  state: "",
};

function AdminSchools() {
  const [schools, setSchools] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState(initialForm);

  const loadSchools = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getSchools();
      // Normalize several possible API response shapes:
      // - array
      // - { results: [...] }
      // - { data: [...] }
      // - { data: { results: [...] } }
      // - { status,message,data: { results: [...] } }
      const extractList = (d: any): any[] => {
        if (!d) return [];
        if (Array.isArray(d)) return d;
        if (Array.isArray(d.results)) return d.results;
        if (Array.isArray(d.data)) return d.data;
        if (d.data && Array.isArray(d.data.results)) return d.data.results;
        if (d.data && d.data.data && Array.isArray(d.data.data.results)) return d.data.data.results;
        return [];
      };

      setSchools(extractList(data));
    } catch (err: any) {
      console.error(err);
      setError("Unable to load schools. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadSchools();
  }, []);

  const handleChange = (key: keyof typeof initialForm, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.name || !form.code || !form.city || !form.state) {
      toast.error("Please complete all school fields before submitting.");
      return;
    }

    setSaving(true);
    try {
      await createSchool(form);
      toast.success("School added successfully.");
      setForm(initialForm);
      await loadSchools();
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to add school. Please check the details and try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout title="Schools" role="Admin" items={adminSidebar}>
      <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <section className="glass-card rounded-3xl p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
            <div>
              <p className="text-sm text-muted-foreground">School catalog</p>
              <h1 className="text-2xl font-semibold">Registered schools</h1>
            </div>
            <Button variant="secondary" onClick={loadSchools} disabled={loading}>
              Refresh list
            </Button>
          </div>

          {error && (
            <div className="rounded-2xl bg-destructive/10 border border-destructive/20 p-4 mb-6 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="space-y-4">
            {loading ? (
              <div className="rounded-3xl bg-surface p-6 text-center text-sm text-muted-foreground">
                Loading schools...
              </div>
            ) : schools.length === 0 ? (
              <div className="rounded-3xl bg-surface p-6 text-center text-sm text-muted-foreground">
                No schools found yet. Use the form to add the first school.
              </div>
            ) : (
              <div className="grid gap-4">
                {schools.map((school) => (
                  <div key={school.id || school.code || school.name} className="rounded-3xl border border-border p-5 shadow-sm bg-background">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">{school.code || school.school_code || "Code"}</p>
                        <h2 className="text-lg font-semibold">{school.name || school.school_name}</h2>
                      </div>
                      <div className="rounded-2xl bg-primary/10 px-3 py-2 text-xs font-semibold text-primary">
                        {school.state || school.region || "State"}
                      </div>
                    </div>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <MapPin size={14} /> {school.city || "City"}
                      </p>
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <Flag size={14} /> {school.state || "State"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="glass-card rounded-3xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Plus size={20} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Quick add school</p>
              <h2 className="text-xl font-semibold">New school</h2>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="school-name">Name</Label>
              <Input
                id="school-name"
                value={form.name}
                onChange={(event) => handleChange("name", event.target.value)}
                placeholder="Mambaram HSS"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="school-code">Code</Label>
              <Input
                id="school-code"
                value={form.code}
                onChange={(event) => handleChange("code", event.target.value)}
                placeholder="MAMHSS01"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="school-city">City</Label>
              <Input
                id="school-city"
                value={form.city}
                onChange={(event) => handleChange("city", event.target.value)}
                placeholder="Mambaram"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="school-state">State</Label>
              <Input
                id="school-state"
                value={form.state}
                onChange={(event) => handleChange("state", event.target.value)}
                placeholder="Kerala"
              />
            </div>

            <Button type="submit" disabled={saving}>
              {saving ? "Adding school..." : "Add school"}
            </Button>
          </form>
        </section>
      </div>
    </DashboardLayout>
  );
}
