import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Bell } from "lucide-react";
import { parentSidebar } from "@/lib/nav";

export const Route = createFileRoute("/parent/notifications")({
  component: ParentNotifications,
});

function ParentNotifications() {
  return (
    <DashboardLayout title="Notifications" role="Parent" items={parentSidebar}>
      <div className="glass-card rounded-xl p-8 text-center">
        <Bell size={48} className="mx-auto text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold mb-2">Notifications</h2>
        <p className="text-muted-foreground">Stay updated on your application status and approvals.</p>
      </div>
    </DashboardLayout>
  );
}
