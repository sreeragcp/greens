import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, Edit, Check, X, Camera, Upload } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ConfirmActionDialog } from "@/components/ConfirmActionDialog";
import { parentSidebar } from "@/lib/nav";
import {
  getStatusBadgeClass,
  getStatusLabel,
  normalizeStudentStatus,
  type StudentWorkflowStatus,
} from "@/lib/student-status";
import { isValidIndianMobile } from "@/lib/utils";
import { getParentStudents, patchParentStudent } from "@/service/parent";

export const Route = createFileRoute("/parent")({
  component: ParentDashboard,
});

type StudentData = {
  id: number;
  name: string;
  admissionNo: string;
  class: string;
  division: string;
  dob: string;
  bloodGroup: string;
  gender: string;
  parentName: string;
  parentMobile: string;
  address: string;
  emergencyContact: string;
  photo: string | null;
  schoolName: string;
  status: StudentWorkflowStatus;
  createdAt?: string;
};

type ConfirmState = {
  title: string;
  description: string;
  onConfirm: () => Promise<void>;
};

function ParentDashboard() {
  const [students, setStudents] = useState<StudentData[]>([]);
  const [editingStudent, setEditingStudent] = useState<StudentData | null>(null);
  const [viewingStudent, setViewingStudent] = useState<StudentData | null>(null);
  const [confirmState, setConfirmState] = useState<ConfirmState | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const isWithinEditWindow = (student: StudentData) => {
    if (!student.createdAt) return true;
    const createdAt = new Date(student.createdAt);
    if (Number.isNaN(createdAt.getTime())) return true;
    const diffMs = Date.now() - createdAt.getTime();
    return diffMs <= 7 * 24 * 60 * 60 * 1000;
  };

  const canEdit = (s: StudentData) => s.status === "PENDING_PARENT" && isWithinEditWindow(s);
  const canSendToTeacher = (s: StudentData) => s.status === "PENDING_PARENT";

  const showConfirm = (title: string, description: string, onConfirm: () => Promise<void>) => {
    setConfirmState({ title, description, onConfirm });
    setConfirmOpen(true);
  };

  const handleConfirmAction = async () => {
    if (!confirmState) return;
    try {
      await confirmState.onConfirm();
    } catch (error: any) {
      console.error("Action failed:", error);
      toast.error("Unable to complete this action. Please try again.");
    } finally {
      setConfirmOpen(false);
      setConfirmState(null);
    }
  };

  const handleSendToTeacher = (id: number) => {
    const child = students.find((s) => s.id === id);
    if (!child) return;

    showConfirm(
      "Send to teacher",
      `Confirm ${child.name}'s details and send to the teacher for approval?`,
      async () => {
        await patchParentStudent(id, { status: "PENDING_TEACHER" });
        setStudents(students.map(s => s.id === id ? { ...s, status: "PENDING_TEACHER" as const } : s));
        if (viewingStudent?.id === id) {
          setViewingStudent({ ...child, status: "PENDING_TEACHER" });
        }
        toast.success(`Sent ${child.name} to teacher`, {
          description: "Verification is completed on your side.",
        });
      }
    );
  };

  useEffect(() => {
    let mounted = true;
    const loadStudents = async () => {
      try {
        const res = await getParentStudents();
        const items = Array.isArray(res)
          ? res
          : Array.isArray(res?.results)
            ? res.results
            : Array.isArray(res?.data?.results)
              ? res.data.results
              : res?.data || [];

        const mapped: StudentData[] = items.map((s: any) => ({
          id: s.id,
          name: s.full_name || `${s.first_name || ""} ${s.last_name || ""}`.trim() || s.name || "",
          admissionNo: s.admission_no || s.admissionNo || "",
          class: s.class_name || s.class || s.className || "",
          division: s.division || s.div || "",
          dob: s.date_of_birth || s.dob || "",
          bloodGroup: s.blood_group || s.bloodGroup || "",
          gender: s.gender || "",
          parentName: s.parent_name || s.guardian_name || s.parentName || "",
          parentMobile: s.guardian_phone || s.parent_mobile || s.parentMobile || "",
          address: s.address || "",
          emergencyContact: s.emergency_contact || s.emergencyContact || "",
          photo: s.photo || null,
          schoolName: s.school_name || s.schoolName || "",
          status: normalizeStudentStatus(s.status),
          createdAt: s.created_at || s.createdAt || undefined,
        }));

        if (mounted) setStudents(mapped);
      } catch (err: any) {
        console.error("Failed to load parent students:", err);
        toast.error("Unable to load student list");
      }
    };

    loadStudents();
    return () => { mounted = false; };
  }, []);

  const handleSaveEdit = async (updated: StudentData) => {
    try {
      const apiResponse = await patchParentStudent(updated.id, {
        full_name: updated.name,
        date_of_birth: updated.dob,
        blood_group: updated.bloodGroup,
        gender: updated.gender,
        parent_name: updated.parentName,
        guardian_phone: updated.parentMobile,
        address: updated.address,
        emergency_contact: updated.emergencyContact,
        photo: updated.photo,
      });

      const merged = {
        ...updated,
        ...apiResponse,
      };

      setStudents(students.map(s => s.id === updated.id ? merged : s));
      setEditingStudent(null);
      toast.success("Changes saved", { description: `Updated ${updated.name}'s details.` });
    } catch (error: any) {
      console.error("Failed to save parent edits:", error);
      toast.error("Unable to update student details. Please try again.");
    }
  };

  return (
    <DashboardLayout title="My Children" role="Parent" items={parentSidebar}>
      <div className="space-y-6">
        {/* Info Banner */}
        <div className="rounded-xl bg-primary/10 border border-primary/20 p-4">
          <p className="text-sm text-primary">
            👋 Welcome! Review your child's details entered by the school. When ready, send to the teacher for approval.
          </p>
        </div>

        {/* Edit Form */}
        {editingStudent && (
          <ParentEditForm
            student={editingStudent}
            onSave={handleSaveEdit}
            onCancel={() => setEditingStudent(null)}
          />
        )}

        {/* View Detail */}
        {viewingStudent && !editingStudent && (
          <div className="glass-card rounded-2xl p-4 sm:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">{viewingStudent.name}</h2>
              <div className="flex items-center gap-2">
                {canEdit(viewingStudent) ? (
                  <Button variant="heroOutline" size="sm" onClick={() => { setEditingStudent(viewingStudent); }}>
                    <Edit size={14} /> Edit
                  </Button>
                ) : (!isWithinEditWindow(viewingStudent) ? (
                  <span className="rounded-full bg-surface px-3 py-1 text-xs text-muted-foreground">
                    Editable only within 7 days of creation
                  </span>
                ) : null)}
                <button onClick={() => setViewingStudent(null)} className="text-muted-foreground hover:text-foreground"><X size={20} /></button>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 text-sm">
              {[
                ["School", viewingStudent.schoolName],
                ["Admission No", viewingStudent.admissionNo],
                ["Class", `${viewingStudent.class}-${viewingStudent.division}`],
                ["Date of Birth", viewingStudent.dob],
                ["Blood Group", viewingStudent.bloodGroup],
                ["Gender", viewingStudent.gender],
                ["Parent Name", viewingStudent.parentName],
                ["Mobile", viewingStudent.parentMobile],
                ["Address", viewingStudent.address],
                ["Emergency Contact", viewingStudent.emergencyContact],
              ].map(([label, value]) => (
                <div key={label} className="rounded-lg bg-surface p-3">
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <p className="font-medium">{value || "—"}</p>
                </div>
              ))}
            </div>

            {canSendToTeacher(viewingStudent) && (
              <div className="flex justify-end gap-3">
                <Button variant="heroOutline" size="sm" onClick={() => setEditingStudent(viewingStudent)}>
                  <Edit size={14} /> Edit Details
                </Button>
                <Button variant="hero" size="sm" onClick={() => handleSendToTeacher(viewingStudent.id)}>
                  <Check size={14} /> Send to Teacher
                </Button>
              </div>
            )}
            {viewingStudent.status === "PENDING_TEACHER" && (
              <p className="text-sm text-emerald-400 text-right">Verification is completed.</p>
            )}
          </div>
        )}

        {/* Student Cards */}
        <div className="space-y-3">
          {students.map((student) => (
            <div key={student.id} className="glass-card rounded-xl p-4 sm:p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                  <div className="h-12 w-12 shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-lg font-bold text-primary">
                    {student.name[0]}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold truncate">{student.name}</p>
                    <p className="text-xs sm:text-sm text-muted-foreground truncate">
                      {student.schoolName} • Class {student.class}-{student.division}
                    </p>
                  </div>
                </div>
                {canEdit(student) ? (
                  <Button variant="heroOutline" size="sm" onClick={() => setEditingStudent(student)}>
                    <Edit size={14} /> Edit
                  </Button>
                ) : (
                  <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${getStatusBadgeClass(student.status)}`}>
                    {student.status === "PENDING_TEACHER"
                      ? "Verification completed"
                      : getStatusLabel(student.status)}
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-2 mt-4">
                <Button variant="outline" size="sm" onClick={() => setViewingStudent(student)}>
                  <Eye size={14} /> View Details
                </Button>
                {student.status === "PENDING_PARENT" && !isWithinEditWindow(student) && (
                  <span className="text-xs text-muted-foreground">Edit window expired after 7 days</span>
                )}
                {canSendToTeacher(student) && (
                  <Button variant="hero" size="sm" onClick={() => handleSendToTeacher(student.id)}>
                    <Check size={14} /> Send to Teacher
                  </Button>
                )}
                {student.status === "PENDING_TEACHER" && (
                  <span className="text-xs text-emerald-400">Verification is completed</span>
                )}
              </div>
            </div>
          ))}
        </div>

        <ConfirmActionDialog
          open={confirmOpen}
          onOpenChange={(open) => {
            setConfirmOpen(open);
            if (!open) setConfirmState(null);
          }}
          title={confirmState?.title || "Confirm action"}
          description={confirmState?.description || "Are you sure you want to proceed?"}
          onConfirm={handleConfirmAction}
        />
      </div>
    </DashboardLayout>
  );
}

function ParentEditForm({ student, onSave, onCancel }: {
  student: StudentData;
  onSave: (s: StudentData) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({ ...student });
  const [errors, setErrors] = useState<{ emergencyContact?: string }>({});

  const validateForm = () => {
    const nextErrors: typeof errors = {};
    if (form.emergencyContact.trim() && !isValidIndianMobile(form.emergencyContact)) {
      nextErrors.emergencyContact =
        "Emergency contact should follow Indian mobile number standards.";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      toast.error("Please correct the contact number before saving.");
      return;
    }
    onSave(form);
  };

  return (
    <div className="glass-card rounded-2xl p-4 sm:p-6 glow-green-sm space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Edit Details — {student.name}</h2>
        <button onClick={onCancel} className="text-muted-foreground hover:text-foreground"><X size={20} /></button>
      </div>

      {/* Photo */}
      <div className="flex justify-center">
        <div className="relative">
          <div className="h-24 w-24 rounded-full border-2 border-dashed border-border bg-surface flex items-center justify-center overflow-hidden">
            {form.photo ? (
              <img src={form.photo} alt="Student" className="h-full w-full object-cover" />
            ) : (
              <Camera size={28} className="text-muted-foreground" />
            )}
          </div>
          <label className="absolute bottom-0 right-0 h-7 w-7 rounded-full bg-primary flex items-center justify-center cursor-pointer hover:bg-primary/80 transition-colors">
            <Upload size={12} className="text-primary-foreground" />
            <input type="file" accept="image/*" className="hidden" onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = (ev) => setForm({ ...form, photo: ev.target?.result as string });
                reader.readAsDataURL(file);
              }
            }} />
          </label>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Student Name</Label>
          <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="bg-surface border-border" />
        </div>
        <div className="space-y-2">
          <Label>Date of Birth</Label>
          <Input type="date" value={form.dob} onChange={(e) => setForm({ ...form, dob: e.target.value })} className="bg-surface border-border" />
        </div>
        <div className="space-y-2">
          <Label>Blood Group</Label>
          <select value={form.bloodGroup} onChange={(e) => setForm({ ...form, bloodGroup: e.target.value })} className="flex h-9 w-full rounded-md border border-border bg-surface px-3 py-1 text-sm text-foreground">
            {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(bg => <option key={bg} value={bg}>{bg}</option>)}
          </select>
        </div>
        <div className="space-y-2">
          <Label>Gender</Label>
          <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })} className="flex h-9 w-full rounded-md border border-border bg-surface px-3 py-1 text-sm text-foreground">
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label>Parent Name</Label>
          <Input value={form.parentName} onChange={(e) => setForm({ ...form, parentName: e.target.value })} className="bg-surface border-border" />
        </div>
        <div className="space-y-2">
          <Label>Address</Label>
          <Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="bg-surface border-border" />
        </div>
        <div className="space-y-2">
          <Label>Emergency Contact</Label>
          <Input type="tel" value={form.emergencyContact} onChange={(e) => setForm({ ...form, emergencyContact: e.target.value })} className="bg-surface border-border" />
          {errors.emergencyContact && <p className="text-xs text-destructive">{errors.emergencyContact}</p>}
        </div>
      </div>

      <div className="flex gap-3 justify-end">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button variant="hero" onClick={handleSave}>Save Changes</Button>
      </div>
    </div>
  );
}
