import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  School,
  Search,
  Eye,
  Edit,
  Camera,
  Upload,
  ChevronDown,
  ChevronRight,
  User as UserIcon,
  ThumbsUp,
  XCircle,
  Download as DownloadIcon,
} from "lucide-react";
import { useEffect, useMemo, useState, useRef } from "react";
import { toast } from "sonner";
import { jsPDF } from "jspdf";
import { adminSidebar } from "@/lib/nav";
import { ConfirmActionDialog } from "@/components/ConfirmActionDialog";
import {
  getStatusBadgeClass,
  getStatusLabel,
  normalizeStudentStatus,
  type StudentWorkflowStatus,
} from "@/lib/student-status";
import { isValidIndianMobile } from "@/lib/utils";
import { getStudents, patchStudentStatus } from "@/service/admin";

export const Route = createFileRoute("/admin/students")({
  component: AdminStudents,
});

type Student = {
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
  school: string;
  uploadedBy: string;
  status: StudentWorkflowStatus;
};

type ConfirmState = {
  title: string;
  description: string;
  onConfirm: () => Promise<void>;
  destructive?: boolean;
};

const getImageFormatFromDataUrl = (dataUrl: string) => {
  const mimeMatch = dataUrl.match(/^data:(image\/[^;]+);/);
  if (!mimeMatch) return "JPEG";
  const mime = mimeMatch[1].toLowerCase();
  if (mime.includes("png")) return "PNG";
  if (mime.includes("jpeg") || mime.includes("jpg")) return "JPEG";
  if (mime.includes("webp")) return "WEBP";
  return "JPEG";
};

const fetchImageAsDataUrl = async (imageSrc: string) => {
  if (imageSrc.startsWith("data:")) {
    return imageSrc;
  }

  // const loadViaFetch = async () => {
  // const response = await fetch(imageSrc, { mode: "cors", cache: "no-store" }); // ← add cache: "no-store"
  // if (!response.ok) {
  //   throw new Error(Failed to fetch image: ${response.status} ${response.statusText});
  // }

  const loadViaFetch = async () => {
    const response = await fetch(imageSrc, { mode: "cors", cache: "no-store" });
    if (!response.ok) {
      throw new Error(
        `Failed to fetch image: ${response.status} ${response.statusText}`,
      );
    }
    const blob = await response.blob();
    return await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          resolve(reader.result);
        } else {
          reject(new Error("Unable to convert image to data URL"));
        }
      };
      reader.onerror = () =>
        reject(
          reader.error ?? new Error("FileReader error while converting image"),
        );
      reader.readAsDataURL(blob);
    });
  };

  const loadViaImage = async () => {
    return await new Promise<string>((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Failed to create canvas context"));
          return;
        }
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL("image/png"));
      };
      img.onerror = (err) =>
        reject(new Error("Failed to load image for PDF conversion"));
      img.src = imageSrc;
    });
  };

  try {
    return await loadViaFetch();
  } catch (fetchError) {
    console.warn(
      "Fetch failed for image URL, retrying with image loader:",
      fetchError,
    );
    return await loadViaImage();
  }
};

const mapStudent = (s: any): Student => {
  const parentName =
    s.parent_name ||
    s.guardian_name ||
    [s.father_name, s.mother_name].filter(Boolean).join(" / ") ||
    s.parent_detail?.first_name ||
    "";
  const schoolName = s.school_detail?.name || s.school_name || s.school || "";
  const admissionNo =
    s.admission_no || s.roll_no || s.admissionNo || s.id?.toString() || "";
  const address =
    s.address || [s.city, s.state, s.pincode].filter(Boolean).join(", ") || "";
  const uploadedBy =
    s.uploaded_by || s.teacher_name || s.created_by_detail?.first_name || "—";

  return {
    id: s.id,
    name:
      s.full_name ||
      `${s.first_name || ""} ${s.last_name || ""}`.trim() ||
      s.name ||
      "",
    admissionNo,
    class: s.class_name || s.class || "",
    division: s.division || s.div || "",
    dob: s.date_of_birth || s.dob || "",
    bloodGroup: s.blood_group || s.bloodGroup || "",
    gender: s.gender || "",
    parentName,
    parentMobile:
      s.guardian_phone || s.parent_mobile || s.parent_detail?.phone || "",
    address,
    emergencyContact: s.emergency_contact || s.emergencyContact || "",
    photo: s.photo || null,
    school: schoolName,
    uploadedBy,
    status: normalizeStudentStatus(s.status),
  };
};

function AdminStudents() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [schoolFilter, setSchoolFilter] = useState("");
  const [classFilter, setClassFilter] = useState("");
  const [divisionFilter, setDivisionFilter] = useState("");
  const [selected, setSelected] = useState<Student | null>(null);
  const [editing, setEditing] = useState(false);
  const [openSchools, setOpenSchools] = useState<Record<string, boolean>>({});
  const [confirmState, setConfirmState] = useState<ConfirmState | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const pdfContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mounted = true;
    const loadStudents = async () => {
      setLoading(true);
      try {
        const res = await getStudents();
        const items = Array.isArray(res)
          ? res
          : Array.isArray(res?.results)
            ? res.results
            : Array.isArray(res?.data?.results)
              ? res.data.results
              : res?.data || [];
        if (mounted) setStudents(items.map(mapStudent));
      } catch (err) {
        console.error("Failed to load students:", err);
        toast.error("Unable to load students");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    loadStudents();
    return () => {
      mounted = false;
    };
  }, []);

  const showConfirm = (
    title: string,
    description: string,
    onConfirm: () => Promise<void>,
    destructive = false,
  ) => {
    setConfirmState({ title, description, onConfirm, destructive });
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

  const handleApprove = (student: Student) => {
    showConfirm(
      "Approve student",
      `Approve ${student.name} and mark the application as fully approved?`,
      async () => {
        await patchStudentStatus(student.id, "APPROVED");
        const updated = { ...student, status: "APPROVED" as const };
        setStudents(students.map((s) => (s.id === student.id ? updated : s)));
        setSelected(updated);
        toast.success(`${student.name} approved`);
      },
    );
  };

  const handleReject = (student: Student) => {
    showConfirm(
      "Reject student",
      `Reject ${student.name} and send back to the teacher for review?`,
      async () => {
        await patchStudentStatus(student.id, "PENDING_TEACHER");
        const updated = { ...student, status: "PENDING_TEACHER" as const };
        setStudents(students.map((s) => (s.id === student.id ? updated : s)));
        setSelected(updated);
        toast.success(`${student.name} sent back to teacher`);
      },
      true,
    );
  };

  const schools = useMemo(
    () => Array.from(new Set(students.map((s) => s.school))),
    [students],
  );
  const classes = useMemo(
    () =>
      Array.from(new Set(students.map((s) => s.class))).sort((a, b) =>
        a.localeCompare(b, undefined, { numeric: true }),
      ),
    [students],
  );
  const divisions = useMemo(
    () =>
      Array.from(new Set(students.map((s) => s.division))).sort((a, b) =>
        a.localeCompare(b, undefined, { numeric: true }),
      ),
    [students],
  );

  const grouped = useMemo(() => {
    const filtered = students.filter((s) => {
      const matchesSearch =
        !search ||
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.admissionNo.toLowerCase().includes(search.toLowerCase());
      const matchesSchool = !schoolFilter || s.school === schoolFilter;
      const matchesClass = !classFilter || s.class === classFilter;
      const matchesDivision = !divisionFilter || s.division === divisionFilter;
      return matchesSearch && matchesSchool && matchesClass && matchesDivision;
    });
    return filtered.reduce<Record<string, Student[]>>((acc, s) => {
      (acc[s.school] ||= []).push(s);
      return acc;
    }, {});
  }, [students, search, schoolFilter, classFilter, divisionFilter]);

  const handleSave = (updated: Student) => {
    setStudents(students.map((s) => (s.id === updated.id ? updated : s)));
    setSelected(updated);
    setEditing(false);
    toast.success("Student updated", {
      description: `${updated.name}'s record was saved.`,
    });
  };

  const closeDialog = () => {
    setSelected(null);
    setEditing(false);
  };

  const generatePDF = async () => {
    if (students.length === 0) {
      toast.error("No students to download");
      return;
    }

    setDownloadingPdf(true);
    try {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 10;
      const contentWidth = pageWidth - 2 * margin;
      let yPosition = margin;
      const lineHeight = 7;
      const pageBottomMargin = 20;

      // Title
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("Student Details Report", margin, yPosition);
      yPosition += 10;

      // Generated date
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(
        `Generated: ${new Date().toLocaleDateString()}`,
        margin,
        yPosition,
      );
      yPosition += 8;

      // Add each student
      for (let i = 0; i < students.length; i++) {
        const student = students[i];

        // Check if we need a new page
        if (yPosition > pageHeight - pageBottomMargin) {
          doc.addPage();
          yPosition = margin;
        }

        // Student header with background
        doc.setFillColor(220, 220, 220);
        doc.rect(margin, yPosition - 5, contentWidth, 8, "F");
        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.text(
          `${student.name} (ID: ${student.admissionNo})`,
          margin + 2,
          yPosition,
        );
        yPosition += 10;

        // Photo and basic info side by side
        let photoAdded = false;
        if (student.photo) {
          try {
            const photoDataUrl = await fetchImageAsDataUrl(student.photo);
            const format = getImageFormatFromDataUrl(photoDataUrl);
            doc.addImage(photoDataUrl, format, margin, yPosition, 25, 30);
            photoAdded = true;
          } catch (e) {
            console.error("Error adding photo:", e);
          }
        }

        const infoStartX = photoAdded ? margin + 30 : margin;
        const infoWidth = contentWidth - (photoAdded ? 30 : 0);
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");

        const basicInfo = [
          `School: ${student.school}`,
          `Class: ${student.class}-${student.division}`,
          `Admission No: ${student.admissionNo}`,
          `Status: ${getStatusLabel(student.status)}`,
        ];

        basicInfo.forEach((info, idx) => {
          doc.text(info, infoStartX + 2, yPosition + idx * lineHeight);
        });

        const photoHeight = photoAdded ? 32 : basicInfo.length * lineHeight;
        yPosition += photoHeight + 8;

        // Detailed information
        const details = [
          ["Date of Birth", student.dob],
          ["Blood Group", student.bloodGroup],
          ["Gender", student.gender],
          ["Parent Name", student.parentName],
          ["Parent Mobile", student.parentMobile],
          ["Address", student.address],
          ["Emergency Contact", student.emergencyContact],
          ["Uploaded By", student.uploadedBy],
        ];

        doc.setFontSize(8);
        doc.setFont("helvetica", "bold");
        details.forEach(([label, value]) => {
          if (yPosition > pageHeight - pageBottomMargin) {
            doc.addPage();
            yPosition = margin;
          }
          doc.setFont("helvetica", "bold");
          doc.text(`${label}:`, margin + 2, yPosition);
          doc.setFont("helvetica", "normal");
          const wrappedText = doc.splitTextToSize(
            value || "—",
            contentWidth - 40,
          );
          doc.text(wrappedText, margin + 40, yPosition);
          yPosition += Math.max(lineHeight, wrappedText.length * 3.5);
        });

        // Separator
        yPosition += 4;
        doc.setDrawColor(200, 200, 200);
        doc.line(margin, yPosition, margin + contentWidth, yPosition);
        yPosition += 6;
      }

      // Save the PDF
      doc.save(
        `Student_Details_Report_${new Date().toISOString().split("T")[0]}.pdf`,
      );
      toast.success("PDF downloaded successfully");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate PDF");
    } finally {
      setDownloadingPdf(false);
    }
  };

  return (
    <DashboardLayout title="Students" role="Admin" items={adminSidebar}>
      <div className="space-y-6">
        <div className="rounded-xl bg-primary/10 border border-primary/20 p-4 flex items-center justify-between">
          <p className="text-sm text-primary">
            Review student applications grouped by school. Approve or reject
            entries pending admin review.
          </p>
          <Button
            onClick={generatePDF}
            disabled={downloadingPdf || students.length === 0}
            variant="hero"
            size="sm"
            className="whitespace-nowrap"
          >
            <DownloadIcon size={16} />
            {downloadingPdf ? "Generating..." : "Download PDF"}
          </Button>
        </div>

        {loading && (
          <div className="glass-card rounded-xl p-8 text-center text-muted-foreground">
            Loading students...
          </div>
        )}

        {/* Filters */}
        <div className="glass-card rounded-xl p-4 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              placeholder="Search by name or admission no..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-surface border-border pl-10"
            />
          </div>
          <select
            value={schoolFilter}
            onChange={(e) => setSchoolFilter(e.target.value)}
            className="h-9 rounded-md border border-border bg-surface px-3 text-sm text-foreground"
          >
            <option value="">All Schools ({students.length})</option>
            {schools.map((s) => (
              <option key={s} value={s}>
                {s} ({students.filter((st) => st.school === s).length})
              </option>
            ))}
          </select>
          <select
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
            className="h-9 rounded-md border border-border bg-surface px-3 text-sm text-foreground"
          >
            <option value="">All Classes ({students.length})</option>
            {classes.map((c) => (
              <option key={c} value={c}>
                {c} ({students.filter((st) => st.class === c).length})
              </option>
            ))}
          </select>
          <select
            value={divisionFilter}
            onChange={(e) => setDivisionFilter(e.target.value)}
            className="h-9 rounded-md border border-border bg-surface px-3 text-sm text-foreground"
          >
            <option value="">All Divisions ({students.length})</option>
            {divisions.map((d) => (
              <option key={d} value={d}>
                {d} ({students.filter((st) => st.division === d).length})
              </option>
            ))}
          </select>
        </div>

        {/* Schools grouped lists */}
        <div className="space-y-4">
          {Object.keys(grouped).length === 0 && (
            <div className="glass-card rounded-xl p-8 text-center text-muted-foreground">
              No students match your filters.
            </div>
          )}
          {Object.entries(grouped).map(([schoolName, list]) => {
            const isOpen = openSchools[schoolName] !== false; // default open
            return (
              <div
                key={schoolName}
                className="glass-card rounded-xl overflow-hidden"
              >
                <button
                  onClick={() =>
                    setOpenSchools({ ...openSchools, [schoolName]: !isOpen })
                  }
                  className="w-full flex items-center justify-between p-4 hover:bg-surface-hover transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                      <School size={16} className="text-primary" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-sm">{schoolName}</p>
                      <p className="text-xs text-muted-foreground">
                        {list.length} student{list.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                  {isOpen ? (
                    <ChevronDown size={18} className="text-muted-foreground" />
                  ) : (
                    <ChevronRight size={18} className="text-muted-foreground" />
                  )}
                </button>

                {isOpen && (
                  <div className="border-t border-border divide-y divide-border">
                    {list.map((student) => (
                      <button
                        key={student.id}
                        onClick={() => {
                          setSelected(student);
                          setEditing(false);
                        }}
                        className="w-full flex items-center justify-between p-4 hover:bg-surface-hover transition-colors text-left"
                      >
                        <div className="flex items-center gap-4 min-w-0">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden shrink-0">
                            {student.photo ? (
                              <img
                                src={student.photo}
                                alt={student.name}
                                crossOrigin="anonymous"
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <span className="text-sm font-bold text-primary">
                                {student.name[0]}
                              </span>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-sm truncate">
                              {student.name}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {student.admissionNo} • Class {student.class}-
                              {student.division}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span
                            className={`hidden sm:inline rounded-full px-3 py-1 text-xs font-medium ${getStatusBadgeClass(student.status)}`}
                          >
                            {getStatusLabel(student.status)}
                          </span>
                          <Eye size={16} className="text-muted-foreground" />
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Detail / Edit Dialog */}
        <Dialog
          open={!!selected}
          onOpenChange={(o) => {
            if (!o) closeDialog();
          }}
        >
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-background border-border">
            {selected && !editing && (
              <>
                <DialogHeader>
                  <DialogTitle>{selected.name}</DialogTitle>
                  <DialogDescription>
                    {selected.school} • Class {selected.class}-
                    {selected.division}
                  </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
                  <div className="h-32 w-32 rounded-xl bg-surface border border-border overflow-hidden flex items-center justify-center shrink-0">
                    {selected.photo ? (
                      <img
                        src={selected.photo}
                        alt={selected.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <UserIcon size={48} className="text-muted-foreground" />
                    )}
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2 text-sm flex-1 w-full">
                    {[
                      ["Admission No", selected.admissionNo],
                      ["Class", `${selected.class}-${selected.division}`],
                      ["Date of Birth", selected.dob],
                      ["Blood Group", selected.bloodGroup],
                      ["Gender", selected.gender],
                      ["Uploaded By", selected.uploadedBy],
                    ].map(([label, value]) => (
                      <div key={label} className="rounded-lg bg-surface p-3">
                        <p className="text-xs text-muted-foreground">{label}</p>
                        <p className="font-medium">{value || "—"}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 text-sm">
                  {[
                    ["Parent Name", selected.parentName],
                    ["Parent Mobile", selected.parentMobile],
                    ["Address", selected.address],
                    ["Emergency Contact", selected.emergencyContact],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-lg bg-surface p-3">
                      <p className="text-xs text-muted-foreground">{label}</p>
                      <p className="font-medium">{value || "—"}</p>
                    </div>
                  ))}
                </div>

                <DialogFooter className="flex-col sm:flex-row gap-2">
                  <Button variant="outline" onClick={closeDialog}>
                    Close
                  </Button>
                  {selected.status === "PENDING_ADMIN" && (
                    <>
                      <Button
                        variant="outline"
                        className="text-destructive border-destructive/30"
                        onClick={() => handleReject(selected)}
                      >
                        <XCircle size={14} /> Reject
                      </Button>
                      <Button
                        variant="hero"
                        onClick={() => handleApprove(selected)}
                      >
                        <ThumbsUp size={14} /> Approve
                      </Button>
                    </>
                  )}
                  {selected.status === "APPROVED" && (
                    <Button variant="hero" onClick={() => setEditing(true)}>
                      <Edit size={14} /> Edit Details
                    </Button>
                  )}
                </DialogFooter>
              </>
            )}

            {selected && editing && (
              <AdminEditForm
                student={selected}
                onSave={handleSave}
                onCancel={() => setEditing(false)}
              />
            )}
          </DialogContent>
        </Dialog>

        <ConfirmActionDialog
          open={confirmOpen}
          onOpenChange={(open) => {
            setConfirmOpen(open);
            if (!open) setConfirmState(null);
          }}
          title={confirmState?.title || "Confirm action"}
          description={
            confirmState?.description || "Are you sure you want to proceed?"
          }
          confirmLabel="Yes"
          cancelLabel="No"
          destructive={confirmState?.destructive}
          onConfirm={handleConfirmAction}
        />
      </div>
    </DashboardLayout>
  );
}

function AdminEditForm({
  student,
  onSave,
  onCancel,
}: {
  student: Student;
  onSave: (s: Student) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({ ...student });
  const [errors, setErrors] = useState<{
    parentMobile?: string;
    emergencyContact?: string;
  }>({});

  const validateForm = () => {
    const nextErrors: typeof errors = {};
    if (!form.parentMobile.trim() || !isValidIndianMobile(form.parentMobile)) {
      nextErrors.parentMobile =
        "Mobile number should follow Indian standard: 10 digits starting with 6-9.";
    }
    if (
      form.emergencyContact.trim() &&
      !isValidIndianMobile(form.emergencyContact)
    ) {
      nextErrors.emergencyContact =
        "Emergency contact should be a valid Indian mobile number.";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      toast.error("Please fix invalid mobile numbers before saving.");
      return;
    }
    onSave(form);
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>Edit Student — {student.name}</DialogTitle>
        <DialogDescription>
          Update student details. Changes save immediately.
        </DialogDescription>
      </DialogHeader>

      <div className="flex justify-center">
        <div className="relative">
          <div className="h-24 w-24 rounded-full border-2 border-dashed border-border bg-surface flex items-center justify-center overflow-hidden">
            {form.photo ? (
              <img
                src={form.photo}
                alt="Student"
                className="h-full w-full object-cover"
              />
            ) : (
              <Camera size={28} className="text-muted-foreground" />
            )}
          </div>
          <label className="absolute bottom-0 right-0 h-7 w-7 rounded-full bg-primary flex items-center justify-center cursor-pointer hover:bg-primary/80 transition-colors">
            <Upload size={12} className="text-primary-foreground" />
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (ev) =>
                    setForm({ ...form, photo: ev.target?.result as string });
                  reader.readAsDataURL(file);
                }
              }}
            />
          </label>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Student Name</Label>
          <Input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="bg-surface border-border"
          />
        </div>
        <div className="space-y-2">
          <Label>Admission No</Label>
          <Input
            value={form.admissionNo}
            onChange={(e) => setForm({ ...form, admissionNo: e.target.value })}
            className="bg-surface border-border"
          />
        </div>
        <div className="space-y-2">
          <Label>Date of Birth</Label>
          <Input
            type="date"
            value={form.dob}
            onChange={(e) => setForm({ ...form, dob: e.target.value })}
            className="bg-surface border-border"
          />
        </div>
        <div className="space-y-2">
          <Label>Blood Group</Label>
          <select
            value={form.bloodGroup}
            onChange={(e) => setForm({ ...form, bloodGroup: e.target.value })}
            className="flex h-9 w-full rounded-md border border-border bg-surface px-3 py-1 text-sm text-foreground"
          >
            {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
              <option key={bg} value={bg}>
                {bg}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label>Gender</Label>
          <select
            value={form.gender}
            onChange={(e) => setForm({ ...form, gender: e.target.value })}
            className="flex h-9 w-full rounded-md border border-border bg-surface px-3 py-1 text-sm text-foreground"
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label>Parent Name</Label>
          <Input
            value={form.parentName}
            onChange={(e) => setForm({ ...form, parentName: e.target.value })}
            className="bg-surface border-border"
          />
        </div>
        <div className="space-y-2">
          <Label>Parent Mobile</Label>
          <Input
            type="tel"
            value={form.parentMobile}
            onChange={(e) => setForm({ ...form, parentMobile: e.target.value })}
            className="bg-surface border-border"
          />
          {errors.parentMobile && (
            <p className="text-xs text-destructive">{errors.parentMobile}</p>
          )}
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label>Address</Label>
          <Input
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            className="bg-surface border-border"
          />
        </div>
        <div className="space-y-2">
          <Label>Emergency Contact</Label>
          <Input
            type="tel"
            value={form.emergencyContact}
            onChange={(e) =>
              setForm({ ...form, emergencyContact: e.target.value })
            }
            className="bg-surface border-border"
          />
          {errors.emergencyContact && (
            <p className="text-xs text-destructive">
              {errors.emergencyContact}
            </p>
          )}
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="hero" onClick={handleSave}>
          Save Changes
        </Button>
      </DialogFooter>
    </>
  );
}
