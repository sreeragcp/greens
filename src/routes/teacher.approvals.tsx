import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { CheckCircle, ThumbsUp, Eye, Edit } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { teacherSidebar } from "@/lib/nav";

export const Route = createFileRoute("/teacher/approvals")({
  component: TeacherApprovals,
});

const pendingApprovals = [
  { id: 1, name: "Sneha Patel", class: "6-B", parentConfirmedAt: "2025-01-12", status: "Parent Confirmed" },
  { id: 2, name: "Meera Joshi", class: "4-A", parentConfirmedAt: "2025-01-13", status: "Parent Confirmed" },
];

function TeacherApprovals() {
  const navigate = useNavigate();
  const [approvals, setApprovals] = useState(pendingApprovals);

  const handleApprove = (id: number, name: string) => {
    setApprovals(approvals.filter((a) => a.id !== id));
    toast.success(`Approved ${name}`, {
      description: "Sent to admin for final processing.",
    });
  };

  return (
    <DashboardLayout title="Approvals" role="Teacher" items={teacherSidebar}>
      <div className="space-y-6">
        <div className="rounded-xl bg-primary/10 border border-primary/20 p-4">
          <p className="text-sm text-primary">
            ✅ Students confirmed by parents appear here. Approve to send to Admin for final processing.
          </p>
        </div>

        {approvals.length === 0 ? (
          <div className="glass-card rounded-xl p-8 text-center">
            <CheckCircle size={48} className="mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">All Caught Up!</h2>
            <p className="text-muted-foreground">No pending approvals at the moment.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {approvals.map((item) => (
              <div
                key={item.id}
                className="glass-card rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4"
              >
                <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                  <div className="h-10 w-10 shrink-0 rounded-full bg-blue-500/10 flex items-center justify-center text-sm font-bold text-blue-400">
                    {item.name[0]}
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium truncate">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Class {item.class} • Parent confirmed on {item.parentConfirmedAt}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:shrink-0">
                  <span className="rounded-full px-3 py-1 text-xs font-medium bg-blue-500/10 text-blue-400">
                    Parent Confirmed
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    aria-label={`View ${item.name}`}
                    onClick={() => navigate({ to: "/teacher" })}
                  >
                    <Eye size={14} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    aria-label={`Edit ${item.name}`}
                    onClick={() => navigate({ to: "/teacher" })}
                  >
                    <Edit size={14} />
                  </Button>
                  <Button
                    variant="hero"
                    size="sm"
                    className="ml-auto sm:ml-0"
                    onClick={() => handleApprove(item.id, item.name)}
                  >
                    <ThumbsUp size={14} /> Approve
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
