import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/DashboardLayout";
import { FileText } from "lucide-react";
import { teacherSidebar } from "@/lib/nav";

export const Route = createFileRoute("/teacher/reports")({
  component: TeacherReports,
});

function TeacherReports() {
  return (
    <DashboardLayout title="Reports" role="Teacher" items={teacherSidebar}>
      <div className="glass-card rounded-xl p-8 text-center">
        <FileText size={48} className="mx-auto text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold mb-2">Reports</h2>
        <p className="text-muted-foreground">Generate and download student reports and analytics.</p>
      </div>
    </DashboardLayout>
  );
}
