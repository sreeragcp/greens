import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Download } from "lucide-react";
import { parentSidebar } from "@/lib/nav";

export const Route = createFileRoute("/parent/downloads")({
  component: ParentDownloads,
});

function ParentDownloads() {
  return (
    <DashboardLayout title="Downloads" role="Parent" items={parentSidebar}>
      <div className="glass-card rounded-xl p-8 text-center">
        <Download size={48} className="mx-auto text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold mb-2">Downloads</h2>
        <p className="text-muted-foreground">Download approved ID cards as print-ready PDFs.</p>
      </div>
    </DashboardLayout>
  );
}
