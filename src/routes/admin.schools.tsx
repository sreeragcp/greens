import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/DashboardLayout";
import { School } from "lucide-react";
import { adminSidebar } from "@/lib/nav";

export const Route = createFileRoute("/admin/schools")({
  component: AdminSchools,
});

function AdminSchools() {
  return (
    <DashboardLayout title="Schools" role="Admin" items={adminSidebar}>
      <div className="glass-card rounded-xl p-8 text-center">
        <School size={48} className="mx-auto text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold mb-2">Manage Schools</h2>
        <p className="text-muted-foreground">View, add, and manage all registered schools.</p>
      </div>
    </DashboardLayout>
  );
}
