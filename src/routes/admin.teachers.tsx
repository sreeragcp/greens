import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/DashboardLayout";
import { GraduationCap } from "lucide-react";
import { adminSidebar } from "@/lib/nav";

export const Route = createFileRoute("/admin/teachers")({
  component: AdminTeachers,
});

function AdminTeachers() {
  return (
    <DashboardLayout title="Teachers" role="Admin" items={adminSidebar}>
      <div className="glass-card rounded-xl p-8 text-center">
        <GraduationCap size={48} className="mx-auto text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold mb-2">Manage Teachers</h2>
        <p className="text-muted-foreground">View and manage all registered teachers across schools.</p>
      </div>
    </DashboardLayout>
  );
}
