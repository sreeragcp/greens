import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/DashboardLayout";
import { CreditCard } from "lucide-react";
import { adminSidebar } from "@/lib/nav";

export const Route = createFileRoute("/admin/card-templates")({
  component: AdminTemplates,
});

function AdminTemplates() {
  return (
    <DashboardLayout title="ID Card Templates" role="Admin" items={adminSidebar}>
      <div className="glass-card rounded-xl p-8 text-center">
        <CreditCard size={48} className="mx-auto text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold mb-2">Manage Templates</h2>
        <p className="text-muted-foreground">Create and manage ID card templates for schools.</p>
      </div>
    </DashboardLayout>
  );
}
