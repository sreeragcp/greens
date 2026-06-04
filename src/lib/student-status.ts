export type StudentWorkflowStatus =
  | "DRAFT"
  | "PENDING_PARENT"
  | "PENDING_TEACHER"
  | "PENDING_ADMIN"
  | "APPROVED";

export const STUDENT_STATUS_LABELS: Record<StudentWorkflowStatus, string> = {
  DRAFT: "Draft",
  PENDING_PARENT: "Pending Parent",
  PENDING_TEACHER: "Pending Teacher",
  PENDING_ADMIN: "Pending Admin",
  APPROVED: "Approved",
};

const LEGACY_STATUS_MAP: Record<string, StudentWorkflowStatus> = {
  Draft: "DRAFT",
  DRAFT: "DRAFT",
  DRFT: "DRAFT",
  "Sent to Parent": "PENDING_PARENT",
  PENDING_PARENT: "PENDING_PARENT",
  "Parent Confirmed": "PENDING_TEACHER",
  PENDING_TEACHER: "PENDING_TEACHER",
  "Teacher Approved": "PENDING_ADMIN",
  PENDING_ADMIN: "PENDING_ADMIN",
  APPROVED: "APPROVED",
  Approved: "APPROVED",
};

export function normalizeStudentStatus(raw: string | undefined | null): StudentWorkflowStatus {
  if (!raw) return "DRAFT";
  return LEGACY_STATUS_MAP[raw] || (raw as StudentWorkflowStatus);
}

export function getStatusLabel(status: StudentWorkflowStatus): string {
  return STUDENT_STATUS_LABELS[status] || status;
}

export function getStatusBadgeClass(status: StudentWorkflowStatus): string {
  switch (status) {
    case "DRAFT":
      return "bg-muted text-muted-foreground";
    case "PENDING_PARENT":
      return "bg-yellow-500/10 text-yellow-400";
    case "PENDING_TEACHER":
      return "bg-blue-500/10 text-blue-400";
    case "PENDING_ADMIN":
      return "bg-orange-500/10 text-orange-400";
    case "APPROVED":
      return "bg-emerald-500/10 text-emerald-400";
    default:
      return "bg-muted text-muted-foreground";
  }
}
