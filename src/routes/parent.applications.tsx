import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/DashboardLayout";
import { FileText } from "lucide-react";
import { parentSidebar } from "@/lib/nav";

export const Route = createFileRoute("/parent/applications")({
  component: ParentApplications,
});

function ParentApplications() {
  return (
    <DashboardLayout title="Applications" role="Parent" items={parentSidebar}>
      <div className="glass-card rounded-xl p-8 text-center">
        <FileText size={48} className="mx-auto text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold mb-2">Your Applications</h2>
        <p className="text-muted-foreground">Track the status of all your children's ID card applications.</p>
      </div>
    </DashboardLayout>
  );
}
