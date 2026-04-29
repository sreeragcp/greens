import { createFileRoute, Link } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Search, Eye, Edit, ThumbsUp, UserPlus, Camera, Upload, X, GraduationCap, School, ArrowRight,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { teacherSidebar } from "@/lib/nav";

export const Route = createFileRoute("/teacher")({
  component: TeacherPortal,
});

type TeacherProfile = {
  schoolName: string;
  teacherName: string;
  classGrade: string;
  division: string;
  mobile: string;
  email: string;
};

type StudentEntry = {
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
  status: "Draft" | "Sent to Parent" | "Parent Confirmed" | "Teacher Approved";
};

const dummyStudents: StudentEntry[] = [
  { id: 1, name: "Rahul Verma", admissionNo: "ADM-001", class: "8", division: "A", dob: "2012-03-15", bloodGroup: "B+", gender: "Male", parentName: "Suresh Verma", parentMobile: "+91 98765 43210", address: "B-45, Sector 62, Noida", emergencyContact: "+91 98765 43211", photo: null, status: "Sent to Parent" },
  { id: 2, name: "Sneha Patel", admissionNo: "ADM-002", class: "8", division: "A", dob: "2014-07-22", bloodGroup: "A+", gender: "Female", parentName: "Ramesh Patel", parentMobile: "+91 87654 32109", address: "C-12, Vasant Kunj, Delhi", emergencyContact: "+91 87654 32110", photo: null, status: "Parent Confirmed" },
  { id: 3, name: "Amit Kumar", admissionNo: "ADM-003", class: "8", division: "A", dob: "2010-11-05", bloodGroup: "O+", gender: "Male", parentName: "Manoj Kumar", parentMobile: "+91 76543 21098", address: "D-8, Dwarka, Delhi", emergencyContact: "+91 76543 21099", photo: null, status: "Teacher Approved" },
  { id: 4, name: "Meera Joshi", admissionNo: "ADM-004", class: "8", division: "A", dob: "2016-01-20", bloodGroup: "AB+", gender: "Female", parentName: "Vivek Joshi", parentMobile: "+91 65432 10987", address: "A-23, Greater Noida", emergencyContact: "+91 65432 10988", photo: null, status: "Draft" },
];

function TeacherPortal() {
  const [profile, setProfile] = useState<TeacherProfile | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("greens.teacherProfile");
      if (raw) setProfile(JSON.parse(raw) as TeacherProfile);
    } catch {
      // ignore
    }
    setLoaded(true);
  }, []);

  if (!loaded) return null;
  if (!profile) return <RegistrationRequired />;

  return <TeacherDashboard profile={profile} />;
}

function RegistrationRequired() {
  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center animate-fade-up glass-card rounded-2xl p-8 glow-green-sm">
        <div className="mx-auto h-16 w-16 rounded-full bg-primary/15 flex items-center justify-center mb-4">
          <GraduationCap size={28} className="text-primary" />
        </div>
        <h1 className="text-2xl font-bold">Teacher Registration Required</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Please complete your one-time teacher registration to access the dashboard
          and start adding students of your class.
        </p>
        <div className="mt-6 flex flex-col gap-3">
          <Button variant="hero" size="lg" asChild>
            <Link to="/teacher-register">
              Register as Teacher <ArrowRight size={16} />
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/login">Already registered? Login</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

function TeacherDashboard({ profile }: { profile: TeacherProfile }) {
  const myStudents = dummyStudents.filter(
    (s) => s.class === profile.classGrade && s.division === profile.division
  );
  const [students, setStudents] = useState<StudentEntry[]>(myStudents);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState<StudentEntry | null>(null);
  const [viewingStudent, setViewingStudent] = useState<StudentEntry | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const filtered = students.filter((s) => {
    const q = search.trim().toLowerCase();
    const matchesSearch =
      !q ||
      s.name.toLowerCase().includes(q) ||
      s.admissionNo.toLowerCase().includes(q) ||
      s.parentName.toLowerCase().includes(q);
    const matchesStatus = !statusFilter || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = [
    { label: "My Students", value: String(students.length), color: "text-primary" },
    { label: "Sent to Parents", value: String(students.filter(s => s.status === "Sent to Parent").length), color: "text-yellow-400" },
    { label: "Parent Confirmed", value: String(students.filter(s => s.status === "Parent Confirmed").length), color: "text-blue-400" },
    { label: "Approved", value: String(students.filter(s => s.status === "Teacher Approved").length), color: "text-emerald-400" },
  ];

  const handleSaveStudent = (student: StudentEntry) => {
    const scoped = { ...student, class: profile.classGrade, division: profile.division };
    if (editingStudent) {
      setStudents(students.map(s => s.id === scoped.id ? scoped : s));
      toast.success(`Updated ${scoped.name}`);
    } else {
      setStudents([...students, { ...scoped, id: Date.now() }]);
      toast.success(`Added ${scoped.name}`, {
        description: scoped.status === "Sent to Parent" ? "OTP link sent to parent." : "Saved as draft.",
      });
    }
    setShowAddForm(false);
    setEditingStudent(null);
  };

  const handleApprove = (id: number) => {
    const student = students.find((s) => s.id === id);
    setStudents(students.map(s => s.id === id ? { ...s, status: "Teacher Approved" as const } : s));
    if (student) toast.success(`Approved ${student.name}`);
  };

  const canEdit = (student: StudentEntry) => student.status !== "Teacher Approved";

  return (
    <DashboardLayout title="Dashboard" role="Teacher" items={teacherSidebar}>
      <div className="space-y-6">
        {/* Teacher context banner */}
        <div className="glass-card rounded-2xl p-5 sm:p-6 glow-green-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-primary/15 flex items-center justify-center">
                <GraduationCap size={22} className="text-primary" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">Welcome back</p>
                <h2 className="text-lg font-semibold">{profile.teacherName}</h2>
                <p className="text-xs text-muted-foreground inline-flex items-center gap-1.5 mt-0.5">
                  <School size={12} className="text-primary" /> {profile.schoolName}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded-lg bg-primary/10 border border-primary/20 px-3 py-1.5 text-xs font-semibold text-primary">
                Class {profile.classGrade}
              </span>
              <span className="rounded-lg bg-primary/10 border border-primary/20 px-3 py-1.5 text-xs font-semibold text-primary">
                Division {profile.division}
              </span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="glass-card rounded-xl p-5">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className={`text-3xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Header + Add */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <h2 className="text-base sm:text-lg font-semibold">
            Students of Class {profile.classGrade}-{profile.division}
          </h2>
          <Button variant="hero" className="w-full sm:w-auto" onClick={() => { setEditingStudent(null); setShowAddForm(true); }}>
            <UserPlus size={16} /> Add Student
          </Button>
        </div>

        {/* Add/Edit Student */}
        {(showAddForm || editingStudent) && (
          <StudentForm
            student={editingStudent}
            profile={profile}
            onSave={handleSaveStudent}
            onCancel={() => { setShowAddForm(false); setEditingStudent(null); }}
          />
        )}

        {/* View Student */}
        {viewingStudent && (
          <StudentDetailView
            student={viewingStudent}
            canEdit={canEdit(viewingStudent)}
            onClose={() => setViewingStudent(null)}
            onEdit={() => { setEditingStudent(viewingStudent); setViewingStudent(null); }}
          />
        )}

        {/* Filters */}
        <div className="glass-card rounded-xl p-4 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name, admission no, parent..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-surface border-border pl-10"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9 rounded-md border border-border bg-surface px-3 text-sm text-foreground"
          >
            <option value="">All Status</option>
            <option value="Draft">Draft</option>
            <option value="Sent to Parent">Sent to Parent</option>
            <option value="Parent Confirmed">Parent Confirmed</option>
            <option value="Teacher Approved">Teacher Approved</option>
          </select>
        </div>

        {/* Students list */}
        <div className="glass-card rounded-xl overflow-hidden">
          <div className="space-y-1 p-2">
            {filtered.length === 0 ? (
              <div className="p-10 text-center text-sm text-muted-foreground">
                No students yet. Click <span className="text-primary font-medium">Add Student</span> to begin.
              </div>
            ) : filtered.map((student) => (
              <div key={student.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-surface p-3 sm:p-4 hover:bg-surface-hover transition-colors">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="h-10 w-10 shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary overflow-hidden">
                    {student.photo ? (
                      <img src={student.photo} alt={student.name} className="h-full w-full object-cover" />
                    ) : (
                      student.name[0]
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate">{student.name}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {student.admissionNo} • {student.parentMobile}
                    </p>
                    <span className={`mt-1 inline-block md:hidden rounded-full px-2 py-0.5 text-[10px] font-medium ${
                      student.status === "Draft" ? "bg-muted text-muted-foreground" :
                      student.status === "Sent to Parent" ? "bg-yellow-500/10 text-yellow-400" :
                      student.status === "Parent Confirmed" ? "bg-blue-500/10 text-blue-400" :
                      "bg-emerald-500/10 text-emerald-400"
                    }`}>
                      {student.status}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`rounded-full px-3 py-1 text-xs font-medium hidden md:inline ${
                    student.status === "Draft" ? "bg-muted text-muted-foreground" :
                    student.status === "Sent to Parent" ? "bg-yellow-500/10 text-yellow-400" :
                    student.status === "Parent Confirmed" ? "bg-blue-500/10 text-blue-400" :
                    "bg-emerald-500/10 text-emerald-400"
                  }`}>
                    {student.status}
                  </span>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setViewingStudent(student)}>
                      <Eye size={14} />
                    </Button>
                    {canEdit(student) && (
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditingStudent(student)}>
                        <Edit size={14} />
                      </Button>
                    )}
                    {student.status === "Parent Confirmed" && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-emerald-400 hover:text-emerald-300"
                        onClick={() => handleApprove(student.id)}
                      >
                        <ThumbsUp size={14} />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function StudentForm({ student, profile, onSave, onCancel }: {
  student: StudentEntry | null;
  profile: TeacherProfile;
  onSave: (s: StudentEntry) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<StudentEntry>(student || {
    id: 0, name: "", admissionNo: "",
    class: profile.classGrade, division: profile.division,
    dob: "", bloodGroup: "",
    gender: "", parentName: "", parentMobile: "", address: "", emergencyContact: "", photo: null, status: "Draft",
  });

  return (
    <div className="glass-card rounded-2xl p-4 sm:p-6 glow-green-sm space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">{student ? "Edit Student" : "Add New Student"}</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            For Class {profile.classGrade} - Division {profile.division} • {profile.schoolName}
          </p>
        </div>
        <button onClick={onCancel} className="text-muted-foreground hover:text-foreground"><X size={20} /></button>
      </div>

      {/* Photo Upload */}
      <div className="flex justify-center">
        <div className="relative">
          <div className="h-28 w-28 rounded-full border-2 border-dashed border-border bg-surface flex items-center justify-center overflow-hidden">
            {form.photo ? (
              <img src={form.photo} alt="Student" className="h-full w-full object-cover" />
            ) : (
              <Camera size={32} className="text-muted-foreground" />
            )}
          </div>
          <label className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-primary flex items-center justify-center cursor-pointer hover:bg-primary/80 transition-colors">
            <Upload size={14} className="text-primary-foreground" />
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
          <Label>Student Full Name *</Label>
          <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Full name" className="bg-surface border-border" />
        </div>
        <div className="space-y-2">
          <Label>Admission Number *</Label>
          <Input value={form.admissionNo} onChange={(e) => setForm({ ...form, admissionNo: e.target.value })} placeholder="ADM-XXX" className="bg-surface border-border" />
        </div>
        <div className="space-y-2">
          <Label>Class</Label>
          <Input value={`Class ${profile.classGrade}`} disabled className="bg-surface border-border opacity-70" />
        </div>
        <div className="space-y-2">
          <Label>Division</Label>
          <Input value={`Division ${profile.division}`} disabled className="bg-surface border-border opacity-70" />
        </div>
        <div className="space-y-2">
          <Label>Date of Birth *</Label>
          <Input type="date" value={form.dob} onChange={(e) => setForm({ ...form, dob: e.target.value })} className="bg-surface border-border" />
        </div>
        <div className="space-y-2">
          <Label>Blood Group</Label>
          <select value={form.bloodGroup} onChange={(e) => setForm({ ...form, bloodGroup: e.target.value })} className="flex h-9 w-full rounded-md border border-border bg-surface px-3 py-1 text-sm text-foreground">
            <option value="">Select</option>
            {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(bg => <option key={bg} value={bg}>{bg}</option>)}
          </select>
        </div>
        <div className="space-y-2">
          <Label>Gender *</Label>
          <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })} className="flex h-9 w-full rounded-md border border-border bg-surface px-3 py-1 text-sm text-foreground">
            <option value="">Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label>Parent/Guardian Name *</Label>
          <Input value={form.parentName} onChange={(e) => setForm({ ...form, parentName: e.target.value })} placeholder="Parent name" className="bg-surface border-border" />
        </div>
        <div className="space-y-2">
          <Label>Parent Mobile *</Label>
          <Input type="tel" value={form.parentMobile} onChange={(e) => setForm({ ...form, parentMobile: e.target.value })} placeholder="+91 XXXXX XXXXX" className="bg-surface border-border" />
        </div>
        <div className="space-y-2">
          <Label>Address</Label>
          <Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Home address" className="bg-surface border-border" />
        </div>
        <div className="space-y-2">
          <Label>Emergency Contact</Label>
          <Input type="tel" value={form.emergencyContact} onChange={(e) => setForm({ ...form, emergencyContact: e.target.value })} placeholder="+91 XXXXX XXXXX" className="bg-surface border-border" />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-end">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button variant="heroOutline" onClick={() => onSave({ ...form, status: "Draft" })}>Save as Draft</Button>
        <Button variant="hero" onClick={() => onSave({ ...form, status: "Sent to Parent" })}>Save & Send to Parent</Button>
      </div>
    </div>
  );
}

function StudentDetailView({ student, canEdit, onClose, onEdit }: {
  student: StudentEntry;
  canEdit: boolean;
  onClose: () => void;
  onEdit: () => void;
}) {
  return (
    <div className="glass-card rounded-2xl p-4 sm:p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{student.name}</h2>
        <div className="flex items-center gap-2">
          {canEdit && (
            <Button variant="heroOutline" size="sm" onClick={onEdit}><Edit size={14} /> Edit</Button>
          )}
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X size={20} /></button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary overflow-hidden">
          {student.photo ? (
            <img src={student.photo} alt={student.name} className="h-full w-full object-cover" />
          ) : student.name[0]}
        </div>
        <div>
          <span className={`rounded-full px-3 py-1 text-xs font-medium ${
            student.status === "Teacher Approved" ? "bg-emerald-500/10 text-emerald-400" :
            student.status === "Parent Confirmed" ? "bg-blue-500/10 text-blue-400" :
            student.status === "Sent to Parent" ? "bg-yellow-500/10 text-yellow-400" :
            "bg-muted text-muted-foreground"
          }`}>
            {student.status}
          </span>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 text-sm">
        {[
          ["Admission No", student.admissionNo],
          ["Class", `${student.class}-${student.division}`],
          ["Date of Birth", student.dob],
          ["Blood Group", student.bloodGroup],
          ["Gender", student.gender],
          ["Parent Name", student.parentName],
          ["Parent Mobile", student.parentMobile],
          ["Address", student.address],
          ["Emergency Contact", student.emergencyContact],
        ].map(([label, value]) => (
          <div key={label} className="rounded-lg bg-surface p-3">
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="font-medium">{value || "—"}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
