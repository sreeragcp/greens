import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/DashboardLayout";
import { FileText } from "lucide-react";
import { adminSidebar } from "@/lib/nav";

export const Route = createFileRoute("/admin/reports")({
  component: AdminReports,
});

function AdminReports() {
  return (
    <DashboardLayout title="Reports" role="Admin" items={adminSidebar}>
      <div className="glass-card rounded-xl p-8 text-center">
        <FileText size={48} className="mx-auto text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold mb-2">Reports & Analytics</h2>
        <p className="text-muted-foreground">Generate reports and export data for all schools.</p>
      </div>
    </DashboardLayout>
  );
}
