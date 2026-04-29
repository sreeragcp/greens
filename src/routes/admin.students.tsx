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
  School, Search, Eye, Edit, Camera, Upload, ChevronDown, ChevronRight,
  User as UserIcon,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { adminSidebar } from "@/lib/nav";

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
  status: "Sent to Parent" | "Parent Confirmed" | "Teacher Approved";
};

const dummyStudents: Student[] = [
  { id: 1, name: "Rahul Verma", admissionNo: "ADM-001", class: "8", division: "A", dob: "2012-03-15", bloodGroup: "B+", gender: "Male", parentName: "Suresh Verma", parentMobile: "+91 98765 43210", address: "B-45, Sector 62, Noida", emergencyContact: "+91 98765 43211", photo: null, school: "DPS Noida", uploadedBy: "Mrs. Anjali Sharma", status: "Teacher Approved" },
  { id: 2, name: "Sneha Patel", admissionNo: "ADM-002", class: "6", division: "B", dob: "2014-07-22", bloodGroup: "A+", gender: "Female", parentName: "Ramesh Patel", parentMobile: "+91 87654 32109", address: "C-12, Vasant Kunj, Delhi", emergencyContact: "+91 87654 32110", photo: null, school: "DPS Noida", uploadedBy: "Mr. Rajeev Khanna", status: "Teacher Approved" },
  { id: 3, name: "Amit Kumar", admissionNo: "ADM-003", class: "10", division: "A", dob: "2010-11-05", bloodGroup: "O+", gender: "Male", parentName: "Manoj Kumar", parentMobile: "+91 76543 21098", address: "D-8, Dwarka, Delhi", emergencyContact: "+91 76543 21099", photo: null, school: "Green Valley School", uploadedBy: "Mrs. Sunita Rao", status: "Teacher Approved" },
  { id: 4, name: "Priya Singh", admissionNo: "ADM-004", class: "9", division: "C", dob: "2011-05-19", bloodGroup: "AB+", gender: "Female", parentName: "Rakesh Singh", parentMobile: "+91 99887 76655", address: "A-22, Indirapuram, Ghaziabad", emergencyContact: "+91 99887 76656", photo: null, school: "DPS Noida", uploadedBy: "Mrs. Anjali Sharma", status: "Teacher Approved" },
  { id: 5, name: "Karan Mehta", admissionNo: "ADM-005", class: "7", division: "A", dob: "2013-09-12", bloodGroup: "B-", gender: "Male", parentName: "Vinod Mehta", parentMobile: "+91 91234 56789", address: "Plot 14, Sector 18, Gurugram", emergencyContact: "+91 91234 56790", photo: null, school: "Green Valley School", uploadedBy: "Mr. Devesh Iyer", status: "Teacher Approved" },
  { id: 6, name: "Ananya Iyer", admissionNo: "ADM-006", class: "5", division: "B", dob: "2015-02-08", bloodGroup: "O-", gender: "Female", parentName: "Suresh Iyer", parentMobile: "+91 90909 80808", address: "Flat 302, Powai, Mumbai", emergencyContact: "+91 90909 80809", photo: null, school: "St. Xavier's International", uploadedBy: "Mrs. Maria D'Souza", status: "Teacher Approved" },
];

function AdminStudents() {
  const [students, setStudents] = useState<Student[]>(dummyStudents);
  const [search, setSearch] = useState("");
  const [schoolFilter, setSchoolFilter] = useState("");
  const [selected, setSelected] = useState<Student | null>(null);
  const [editing, setEditing] = useState(false);
  const [openSchools, setOpenSchools] = useState<Record<string, boolean>>({});

  const schools = useMemo(() => Array.from(new Set(students.map(s => s.school))), [students]);

  const grouped = useMemo(() => {
    const filtered = students.filter(s => {
      const matchesSearch = !search ||
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.admissionNo.toLowerCase().includes(search.toLowerCase());
      const matchesSchool = !schoolFilter || s.school === schoolFilter;
      return matchesSearch && matchesSchool;
    });
    return filtered.reduce<Record<string, Student[]>>((acc, s) => {
      (acc[s.school] ||= []).push(s);
      return acc;
    }, {});
  }, [students, search, schoolFilter]);

  const handleSave = (updated: Student) => {
    setStudents(students.map(s => s.id === updated.id ? updated : s));
    setSelected(updated);
    setEditing(false);
    toast.success("Student updated", { description: `${updated.name}'s record was saved.` });
  };

  const closeDialog = () => { setSelected(null); setEditing(false); };

  return (
    <DashboardLayout title="Students" role="Admin" items={adminSidebar}>
      <div className="space-y-6">
        <div className="rounded-xl bg-primary/10 border border-primary/20 p-4">
          <p className="text-sm text-primary">
            🔒 Showing teacher-approved students grouped by school. Click any student to view full details and edit.
          </p>
        </div>

        {/* Filters */}
        <div className="glass-card rounded-xl p-4 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
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
            {schools.map(s => (
              <option key={s} value={s}>{s} ({students.filter(st => st.school === s).length})</option>
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
              <div key={schoolName} className="glass-card rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenSchools({ ...openSchools, [schoolName]: !isOpen })}
                  className="w-full flex items-center justify-between p-4 hover:bg-surface-hover transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                      <School size={16} className="text-primary" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-sm">{schoolName}</p>
                      <p className="text-xs text-muted-foreground">{list.length} approved student{list.length !== 1 ? "s" : ""}</p>
                    </div>
                  </div>
                  {isOpen ? <ChevronDown size={18} className="text-muted-foreground" /> : <ChevronRight size={18} className="text-muted-foreground" />}
                </button>

                {isOpen && (
                  <div className="border-t border-border divide-y divide-border">
                    {list.map((student) => (
                      <button
                        key={student.id}
                        onClick={() => { setSelected(student); setEditing(false); }}
                        className="w-full flex items-center justify-between p-4 hover:bg-surface-hover transition-colors text-left"
                      >
                        <div className="flex items-center gap-4 min-w-0">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden shrink-0">
                            {student.photo ? (
                              <img src={student.photo} alt={student.name} className="h-full w-full object-cover" />
                            ) : (
                              <span className="text-sm font-bold text-primary">{student.name[0]}</span>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-sm truncate">{student.name}</p>
                            <p className="text-xs text-muted-foreground truncate">
                              {student.admissionNo} • Class {student.class}-{student.division}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="hidden sm:inline rounded-full px-3 py-1 text-xs font-medium bg-emerald-500/10 text-emerald-400">
                            Approved
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
        <Dialog open={!!selected} onOpenChange={(o) => { if (!o) closeDialog(); }}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-background border-border">
            {selected && !editing && (
              <>
                <DialogHeader>
                  <DialogTitle>{selected.name}</DialogTitle>
                  <DialogDescription>
                    {selected.school} • Class {selected.class}-{selected.division}
                  </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
                  <div className="h-32 w-32 rounded-xl bg-surface border border-border overflow-hidden flex items-center justify-center shrink-0">
                    {selected.photo ? (
                      <img src={selected.photo} alt={selected.name} className="h-full w-full object-cover" />
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

                <DialogFooter>
                  <Button variant="outline" onClick={closeDialog}>Close</Button>
                  <Button variant="hero" onClick={() => setEditing(true)}>
                    <Edit size={14} /> Edit Details
                  </Button>
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
      </div>
    </DashboardLayout>
  );
}

function AdminEditForm({ student, onSave, onCancel }: {
  student: Student;
  onSave: (s: Student) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({ ...student });

  return (
    <>
      <DialogHeader>
        <DialogTitle>Edit Student — {student.name}</DialogTitle>
        <DialogDescription>Update student details. Changes save immediately.</DialogDescription>
      </DialogHeader>

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
          <Label>Admission No</Label>
          <Input value={form.admissionNo} onChange={(e) => setForm({ ...form, admissionNo: e.target.value })} className="bg-surface border-border" />
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
          <Label>Parent Mobile</Label>
          <Input type="tel" value={form.parentMobile} onChange={(e) => setForm({ ...form, parentMobile: e.target.value })} className="bg-surface border-border" />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label>Address</Label>
          <Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="bg-surface border-border" />
        </div>
        <div className="space-y-2">
          <Label>Emergency Contact</Label>
          <Input type="tel" value={form.emergencyContact} onChange={(e) => setForm({ ...form, emergencyContact: e.target.value })} className="bg-surface border-border" />
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button variant="hero" onClick={() => onSave(form)}>Save Changes</Button>
      </DialogFooter>
    </>
  );
}
