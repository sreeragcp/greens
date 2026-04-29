import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Settings } from "lucide-react";
import { adminSidebar } from "@/lib/nav";

export const Route = createFileRoute("/admin/settings")({
  component: AdminSettings,
});

function AdminSettings() {
  return (
    <DashboardLayout title="Settings" role="Admin" items={adminSidebar}>
      <div className="glass-card rounded-xl p-8 text-center">
        <Settings size={48} className="mx-auto text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold mb-2">Admin Settings</h2>
        <p className="text-muted-foreground">Configure platform settings, notifications, and preferences.</p>
      </div>
    </DashboardLayout>
  );
}
