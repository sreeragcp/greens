import { createFileRoute, useNavigate, Outlet, useLocation } from "@tanstack/react-router";
import { useEffect, useMemo, useState,useRef} from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  School,
  Users,
  CreditCard,
  Search,
  TrendingUp,
  Activity,
  ArrowLeft,
  Eye,
  Edit,
  Camera,
  Upload,
  FileText,
  ChevronRight,
  ThumbsUp,
  XCircle,
} from "lucide-react";
import { adminSidebar } from "@/lib/nav";
import { getAdminDashboard, getStudents, getSchools, getSchoolClasses, patchStudentStatus } from "@/service/admin";
import { ConfirmActionDialog } from "@/components/ConfirmActionDialog";
import {
  getStatusBadgeClass,
  getStatusLabel,
  normalizeStudentStatus,
  type StudentWorkflowStatus,
} from "@/lib/student-status";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export const Route = createFileRoute("/admin")({
  component: AdminDashboard,
});

const stats = [
  { label: "Total Schools", value: "524", icon: School, trend: "+12 this month", color: "text-primary" },
  { label: "Total Students", value: "45,230", icon: Users, trend: "+1,340 this month", color: "text-blue-400" },
  { label: "Pending Approvals", value: "89", icon: Activity, trend: "15 urgent", color: "text-yellow-400" },
  { label: "Cards Generated", value: "38,450", icon: CreditCard, trend: "+890 this week", color: "text-emerald-400" },
];

const recentActivity = [
  { action: "New school registered", detail: "St. Xavier's International, Mumbai", time: "2 min ago" },
  { action: "Batch approved", detail: "156 cards approved for DPS Noida", time: "15 min ago" },
  { action: "Template updated", detail: "Classic Green v2.1 released", time: "1 hr ago" },
  { action: "Report exported", detail: "Monthly analytics report downloaded", time: "3 hrs ago" },
  { action: "New teacher onboarded", detail: "Sunita Rao, Green Valley School", time: "5 hrs ago" },
];

type SchoolCard = {
  id: number;
  name: string;
  classCount: number;
  studentCount: number;
  city?: string;
};

type ClassCard = {
  id: number;
  name: string;
  studentCount: number;
  className?: string;
  division?: string;
  href?: string;
};

type StudentRecord = {
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
  status: StudentWorkflowStatus;
  school: string;
};

const defaultSchoolCards: SchoolCard[] = [
  { id: 1, name: "DPS Noida", classCount: 18, studentCount: 1980, city: "Noida" },
  { id: 2, name: "Green Valley School", classCount: 14, studentCount: 1365, city: "Gurugram" },
  { id: 3, name: "St. Xavier's International", classCount: 16, studentCount: 1545, city: "Mumbai" },
  { id: 4, name: "Oakridge Public School", classCount: 12, studentCount: 1120, city: "Bangalore" },
  { id: 5, name: "Modern Academy", classCount: 10, studentCount: 945, city: "Delhi" },
  { id: 6, name: "Cambridge High", classCount: 8, studentCount: 760, city: "Chennai" },
];

const defaultClassesBySchool: Record<number, ClassCard[]> = {
  1: [
    { id: 101, name: "Class 5A", studentCount: 45 },
    { id: 102, name: "Class 6B", studentCount: 48 },
    { id: 103, name: "Class 7C", studentCount: 42 },
  ],
  2: [
    { id: 201, name: "Class 6A", studentCount: 41 },
    { id: 202, name: "Class 7B", studentCount: 46 },
    { id: 203, name: "Class 8C", studentCount: 44 },
  ],
  3: [
    { id: 301, name: "Class 4A", studentCount: 39 },
    { id: 302, name: "Class 5B", studentCount: 43 },
    { id: 303, name: "Class 6C", studentCount: 47 },
  ],
};

const defaultStudentsByClass: Record<number, StudentRecord[]> = {
  101: [
    { id: 1, name: "Rahul Verma", admissionNo: "ADM-001", class: "5", division: "A", dob: "2012-03-15", bloodGroup: "B+", gender: "Male", parentName: "Suresh Verma", parentMobile: "+91 98765 43210", address: "B-45, Sector 62, Noida", emergencyContact: "+91 98765 43211", photo: null, status: "APPROVED", school: "DPS Noida" },
    { id: 2, name: "Sneha Patel", admissionNo: "ADM-002", class: "5", division: "A", dob: "2012-08-21", bloodGroup: "A+", gender: "Female", parentName: "Ramesh Patel", parentMobile: "+91 87654 32109", address: "C-12, Vasant Kunj, Delhi", emergencyContact: "+91 87654 32110", photo: null, status: "APPROVED", school: "DPS Noida" },
  ],
  102: [
    { id: 3, name: "Amit Kumar", admissionNo: "ADM-003", class: "6", division: "B", dob: "2011-11-05", bloodGroup: "O+", gender: "Male", parentName: "Manoj Kumar", parentMobile: "+91 76543 21098", address: "D-8, Dwarka, Delhi", emergencyContact: "+91 76543 21099", photo: null, status: "APPROVED", school: "DPS Noida" },
    { id: 4, name: "Priya Singh", admissionNo: "ADM-004", class: "6", division: "B", dob: "2011-05-19", bloodGroup: "AB+", gender: "Female", parentName: "Rakesh Singh", parentMobile: "+91 99887 76655", address: "A-22, Indirapuram, Ghaziabad", emergencyContact: "+91 99887 76656", photo: null, status: "APPROVED", school: "DPS Noida" },
  ],
  201: [
    { id: 5, name: "Karan Mehta", admissionNo: "ADM-005", class: "6", division: "A", dob: "2013-09-12", bloodGroup: "B-", gender: "Male", parentName: "Vinod Mehta", parentMobile: "+91 91234 56789", address: "Plot 14, Sector 18, Gurugram", emergencyContact: "+91 91234 56790", photo: null, status: "APPROVED", school: "Green Valley School" },
  ],
};

function AdminDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [query, setQuery] = useState("");
  const [statsData, setStatsData] = useState(stats);
  const [activityData, setActivityData] = useState(recentActivity);
  const [schoolCards, setSchoolCards] = useState<SchoolCard[]>(defaultSchoolCards);
  const [selectedSchool, setSelectedSchool] = useState<SchoolCard | null>(null);
  const [selectedClass, setSelectedClass] = useState<ClassCard | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<StudentRecord | null>(null);
  const [schoolClassCards, setSchoolClassCards] = useState<ClassCard[]>([]);
  const [classesLoading, setClassesLoading] = useState(false);
  const [classesError, setClassesError] = useState<string | null>(null);
  const [classStudents, setClassStudents] = useState<StudentRecord[]>([]);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [studentsError, setStudentsError] = useState<string | null>(null);
  const [showIdCard, setShowIdCard] = useState(false);
  const drilldownRef = useRef<HTMLDivElement | null>(null);
  const [allStudents, setAllStudents] = useState<StudentRecord[] | null>(null);
  const [loadingDashboard, setLoadingDashboard] = useState(false);
  const [dashboardError, setDashboardError] = useState<string | null>(null);
  const [confirmState, setConfirmState] = useState<{
    title: string;
    description: string;
    onConfirm: () => Promise<void>;
    destructive?: boolean;
  } | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const classCards = schoolClassCards;

  const students = useMemo(
    () => (selectedClass ? classStudents : []),
    [selectedClass, classStudents]
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({ to: "/admin/students" });
  };

  const showConfirm = (
    title: string,
    description: string,
    onConfirm: () => Promise<void>,
    destructive = false
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

  const updateStudentInLists = (updated: StudentRecord) => {
    setSelectedStudent(updated);
    setClassStudents((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
  };

  const handleAdminApprove = (student: StudentRecord) => {
    showConfirm(
      "Approve student",
      `Approve ${student.name} and mark the application as fully approved?`,
      async () => {
        await patchStudentStatus(student.id, "APPROVED");
        updateStudentInLists({ ...student, status: "APPROVED" });
        toast.success(`${student.name} approved`);
      }
    );
  };

  const handleAdminReject = (student: StudentRecord) => {
    showConfirm(
      "Reject student",
      `Reject ${student.name} and send back to the teacher for review?`,
      async () => {
        await patchStudentStatus(student.id, "PENDING_TEACHER");
        updateStudentInLists({ ...student, status: "PENDING_TEACHER" });
        toast.success(`${student.name} sent back to teacher`);
      },
      true
    );
  };

  const handleSchoolSelect = async (school: SchoolCard) => {
    setSelectedSchool(school);
    setSelectedClass(null);
    setSelectedStudent(null);
    setClassesError(null);
    setSchoolClassCards([]);
    setClassStudents([]);
    setStudentsError(null);
    setClassesLoading(true);

    try {
      const classesData = await getSchoolClasses(school.id);
      const list = Array.isArray(classesData)
        ? classesData
        : Array.isArray(classesData?.classes)
        ? classesData.classes
        : Array.isArray(classesData?.data?.classes)
        ? classesData.data.classes
        : Array.isArray(classesData?.results)
        ? classesData.results
        : Array.isArray(classesData?.data?.results)
        ? classesData.data.results
        : Array.isArray(classesData?.data)
        ? classesData.data
        : [];

      setSchoolClassCards(
        (list as any[]).map((schoolClass: any, index: number) => ({
          id: schoolClass.id ?? index,
          name: schoolClass.label || schoolClass.display_name || schoolClass.class_name || `Class ${index + 1}`,
          studentCount: schoolClass.student_count ?? schoolClass.students_count ?? schoolClass.students_enrolled ?? 0,
          className: schoolClass.class_name ?? schoolClass.name ?? undefined,
          division: schoolClass.division ?? undefined,
          href: schoolClass.action?.href ?? undefined,
        }))
      );
    } catch (error: any) {
      setClassesError("Unable to load classes for this school.");
      console.warn("Failed to load school classes:", error);
    } finally {
      setClassesLoading(false);
    }
  };

  const handleClassSelect = async (classItem: ClassCard) => {
    setSelectedClass(classItem);
    setSelectedStudent(null);
    setStudentsError(null);
    setClassStudents([]);
    setStudentsLoading(true);

    try {
      const studentsData = await getStudents({
        school: selectedSchool?.id,
        class_name: classItem.className,
        division: classItem.division,
      });

      const list = Array.isArray(studentsData)
        ? studentsData
        : Array.isArray(studentsData?.data?.results)
        ? studentsData.data.results
        : Array.isArray(studentsData?.results)
        ? studentsData.results
        : Array.isArray(studentsData?.data)
        ? studentsData.data
        : [];

      const mappedStudents = (list as any[]).map((student: any) => ({
        id: student.id,
        name: student.full_name || student.name || `${student.first_name || ""} ${student.last_name || ""}`.trim(),
        admissionNo: student.admission_no || student.admissionNo || `ADM-${student.id}`,
        class: student.class_name || student.class || classItem.className || "",
        division: student.division || classItem.division || "",
        dob: student.date_of_birth || student.dob || "",
        bloodGroup: student.blood_group || student.bloodGroup || "",
        gender: student.gender || "",
        parentName: student.parent_name || student.parentName || "",
        parentMobile: student.parent_mobile || student.parentMobile || "",
        address: student.address || "",
        emergencyContact: student.emergency_contact || student.emergencyContact || "",
        photo: student.photo || null,
        status: normalizeStudentStatus(student.status),
        school: selectedSchool?.name || "",
      }));

      setClassStudents(mappedStudents);
    } catch (error: any) {
      setStudentsError("Unable to load students for this class.");
      console.warn("Failed to load class students:", error);
    } finally {
      setStudentsLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    const loadAdminDashboard = async () => {
      setLoadingDashboard(true);
      try {
        const data = await getAdminDashboard();
        console.log(data,"this is the data from the admin dashboard api");
        
        if (!mounted) return;

        if (Array.isArray(data?.stats)) {
          setStatsData(data.stats);
        }

        if (Array.isArray(data?.recent_activity)) {
          setActivityData(data.recent_activity);
        } else if (Array.isArray(data?.recentActivity)) {
          setActivityData(data.recentActivity);
        }

        // Prefer fetching full schools list from the schools API
        try {
          const schoolsData = await getSchools();
          const list = Array.isArray(schoolsData)
            ? schoolsData
            : Array.isArray(schoolsData?.results)
            ? schoolsData.results
            : Array.isArray(schoolsData?.data?.results)
            ? schoolsData.data.results
            : Array.isArray(schoolsData?.data)
            ? schoolsData.data
            : [];
          setSchoolCards(
            (list as any[]).map((school: any, index: number) => ({
              id: school.id ?? index,
              name: school.name || school.school_name || `School ${index + 1}`,
              classCount: school.total_classes ?? 0,
              studentCount: school.total_student ?? school.total_students ?? 0,
              city: school.city || school.location || school.address || undefined,
            }))
          );
        } catch (err) {
          // fallback to dashboard-provided schools if schools API fails
          if (Array.isArray(data?.schools)) {
            setSchoolCards(
              data.schools.map((school: any, index: number) => ({
                id: school.id ?? index,
                name: school.name || school.school_name || `School ${index + 1}`,
                classCount: school.total_classes ?? 0,
                studentCount: school.total_student ?? school.total_students ?? 0,
                city: school.city || school.location || undefined,
              }))
            );
          } else {
            console.warn("Could not fetch schools list:", err);
          }
        }

        // Also load full student list for admin views
        try {
          const studentsData = await getStudents();
          // API may return array or an object with results
          const list = Array.isArray(studentsData)
            ? studentsData
            : studentsData?.results ?? studentsData?.data ?? [];
          setAllStudents(list as StudentRecord[]);
        } catch (err) {
          console.warn("Could not fetch full students list:", err);
        }

        if (typeof data?.total_schools !== "undefined" || typeof data?.totalSchools !== "undefined" || typeof data?.schools_count !== "undefined") {
          setStatsData([
            {
              label: "Total Schools",
              value: String(data.total_schools ?? data.totalSchools ?? data.schools_count ?? stats[0].value),
              icon: School,
              trend: data.total_schools_trend || data.totalSchoolsTrend || stats[0].trend,
              color: "text-primary",
            },
            {
              label: "Total Students",
              value: String(data.total_students ?? data.totalStudents ?? data.students_count ?? stats[1].value),
              icon: Users,
              trend: data.total_students_trend || data.totalStudentsTrend || stats[1].trend,
              color: "text-blue-400",
            },
            {
              label: "Pending Approvals",
              value: String(data.pending_approvals ?? data.pendingApprovals ?? data.pending_approval_count ?? stats[2].value),
              icon: Activity,
              trend: data.pending_approvals_trend || data.pendingApprovalsTrend || stats[2].trend,
              color: "text-yellow-400",
            },
            {
              label: "Cards Generated",
              value: String(data.cards_generated ?? data.cardsGenerated ?? data.cards_count ?? stats[3].value),
              icon: CreditCard,
              trend: data.cards_generated_trend || data.cardsGeneratedTrend || stats[3].trend,
              color: "text-emerald-400",
            },
          ]);
        }
      } catch (error: any) {
        console.error("Failed to load admin dashboard:", error);
        if (mounted) setDashboardError("Unable to load dashboard details.");
      } finally {
        if (mounted) setLoadingDashboard(false);
      }
    };

    loadAdminDashboard();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    // When a drilldown selection is made, bring that section into view.
    if (selectedSchool || selectedClass || selectedStudent) {
      // small timeout to let layout settle after state update
      setTimeout(() => {
        if (drilldownRef.current) {
          drilldownRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
          drilldownRef.current.focus?.();
        }
      }, 120);
    }
  }, [selectedSchool, selectedClass, selectedStudent]);

  if (location.pathname !== "/admin") {
    return <Outlet />;
  }

  return (
    <DashboardLayout title="Admin Dashboard" role="Admin" items={adminSidebar}>
      <div className="space-y-6">
        {dashboardError && (
          <div className="rounded-xl bg-destructive/10 border border-destructive/20 p-4 text-sm text-destructive">
            {dashboardError}
          </div>
        )}

        {/* Stats */}
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          {statsData.map((stat) => (
            <div key={stat.label} className="glass-card rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <stat.icon size={16} className="text-primary" />
                </div>
              </div>
              <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <TrendingUp size={12} className="text-primary" />
                {stat.trend}
              </p>
            </div>
          ))}
        </div>

        {/* Removed monthly chart and recent activity to focus on drilldown */}

        {/* Quick search */}
        {/* <form onSubmit={handleSearch} className="glass-card rounded-xl p-4 sm:p-6">
          <h2 className="text-lg font-semibold mb-4">Quick Search</h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search schools, teachers, or students..."
                className="bg-surface border-border pl-10"
              />
            </div>
            <Button type="submit" variant="hero" size="default">Search</Button>
          </div>
        </form> */}

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-sm text-muted-foreground">School overview</p>
              <h2 className="text-xl font-semibold">All schools</h2>
            </div>
            <p className="text-sm text-muted-foreground">Tap a school to inspect classes and students.</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {schoolCards.map((school) => (
              <button
                key={school.id}
                type="button"
                onClick={() => handleSchoolSelect(school)}
                className="glass-card rounded-3xl p-5 text-left hover:border-primary/40 border border-transparent transition-colors"
              >
                <div className="flex items-center justify-between gap-4 mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">{school.city || "City"}</p>
                    <h3 className="text-lg font-semibold">{school.name}</h3>
                  </div>
                  <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                    {school.name[0]}
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-surface p-4">
                    <p className="text-xs text-muted-foreground">Total classes</p>
                    <p className="mt-2 text-xl font-semibold">{school.classCount}</p>
                  </div>
                  <div className="rounded-2xl bg-surface p-4">
                    <p className="text-xs text-muted-foreground">Students</p>
                    <p className="mt-2 text-xl font-semibold">{school.studentCount}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {selectedSchool && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <Button variant="ghost" size="sm" onClick={() => { setSelectedSchool(null); setSelectedClass(null); setSelectedStudent(null); }}>
                <ArrowLeft size={16} /> Back to schools
              </Button>
              <div>
                <h2 className="text-xl font-semibold">{selectedSchool.name}</h2>
                <p className="text-sm text-muted-foreground">{selectedSchool.city || "School overview"}</p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3" ref={drilldownRef} tabIndex={-1}>
              {classesLoading && (
                <div className="glass-card rounded-3xl p-6 col-span-full text-center text-sm text-muted-foreground">
                  Loading classes...
                </div>
              )}

              {classesError && !classesLoading && (
                <div className="glass-card rounded-3xl p-6 col-span-full text-center text-sm text-destructive">
                  {classesError}
                </div>
              )}

              {!classesLoading && !classesError && classCards.length === 0 && (
                <div className="glass-card rounded-3xl p-6 col-span-full text-center text-sm text-muted-foreground">
                  No classes found for this school.
                </div>
              )}

              {classCards.map((classItem) => (
                <button
                  key={classItem.id}
                  type="button"
                  onClick={() => handleClassSelect(classItem)}
                  className="glass-card rounded-3xl p-6 text-left hover:border-primary/40 border border-transparent transition-colors"
                >
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Class</p>
                      <h3 className="text-lg font-semibold">{classItem.name}</h3>
                    </div>
                    <ChevronRight size={20} className="text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">Students enrolled</p>
                  <p className="mt-2 text-2xl font-semibold">{classItem.studentCount}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {selectedClass && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <Button variant="ghost" size="sm" onClick={() => { setSelectedClass(null); setSelectedStudent(null); }}>
                <ArrowLeft size={16} /> Back to classes
              </Button>
              <div>
                <h2 className="text-xl font-semibold">{selectedClass.name}</h2>
                <p className="text-sm text-muted-foreground">{selectedSchool?.name} • {selectedClass.studentCount} students</p>
              </div>
            </div>

            <div className="glass-card rounded-3xl overflow-hidden">
              <div className="border-b border-border p-4 sm:p-6 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Student roster</p>
                  <h3 className="text-lg font-semibold">{selectedClass.name}</h3>
                </div>
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  {students.length} students
                </span>
              </div>
              <div className="divide-y divide-border">
                {studentsLoading && (
                  <div className="p-6 text-center text-sm text-muted-foreground">
                    Loading students...
                  </div>
                )}
                {studentsError && !studentsLoading && (
                  <div className="p-6 text-center text-sm text-destructive">
                    {studentsError}
                  </div>
                )}
                {!studentsLoading && !studentsError && students.length === 0 && (
                  <div className="p-6 text-center text-sm text-muted-foreground">
                    No students found for this class.
                  </div>
                )}
                {students.map((student) => (
                  <button
                    key={student.id}
                    type="button"
                    onClick={() => setSelectedStudent(student)}
                    className="w-full flex items-center justify-between gap-4 p-4 sm:p-5 hover:bg-surface-hover transition-colors text-left"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-semibold">
                        {student.name[0]}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium truncate">{student.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{student.admissionNo} • {student.gender}</p>
                      </div>
                    </div>
                    <Eye size={18} className="text-muted-foreground" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        <Dialog open={!!selectedStudent} onOpenChange={(open) => { if (!open) setSelectedStudent(null); }}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-background border-border">
            {selectedStudent && (
              <AdminStudentDetail
                student={selectedStudent}
                onClose={() => setSelectedStudent(null)}
                onSave={(student) => { updateStudentInLists(student); toast.success("Student details updated"); }}
                onShowIdCard={() => setShowIdCard(true)}
                onApprove={() => handleAdminApprove(selectedStudent)}
                onReject={() => handleAdminReject(selectedStudent)}
              />
            )}
          </DialogContent>
        </Dialog>

        <Dialog open={showIdCard} onOpenChange={setShowIdCard}>
          <DialogContent className="max-w-xl bg-background border-border">
            <DialogHeader>
              <DialogTitle>ID Card Preview</DialogTitle>
              <DialogDescription>Preview the student's identity card layout.</DialogDescription>
            </DialogHeader>
            <div className="glass-card rounded-3xl p-6 space-y-4">
              {selectedStudent ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="h-20 w-20 rounded-3xl bg-primary/10 flex items-center justify-center overflow-hidden">
                      {selectedStudent.photo ? (
                        <img src={selectedStudent.photo} alt={selectedStudent.name} className="h-full w-full object-cover" />
                      ) : (
                        <Camera size={28} className="text-primary" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{selectedStudent.school}</p>
                      <h3 className="text-xl font-semibold">{selectedStudent.name}</h3>
                      <p className="text-sm text-muted-foreground">{selectedStudent.admissionNo}</p>
                    </div>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <CardField label="Class" value={`${selectedStudent.class}-${selectedStudent.division}`} />
                    <CardField label="DOB" value={selectedStudent.dob} />
                    <CardField label="Blood Group" value={selectedStudent.bloodGroup} />
                    <CardField label="Parent" value={selectedStudent.parentName} />
                  </div>
                  <div className="rounded-3xl bg-surface p-4">
                    <p className="text-xs text-muted-foreground">Emergency Contact</p>
                    <p className="mt-2 font-medium">{selectedStudent.emergencyContact}</p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No student selected.</p>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowIdCard(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <ConfirmActionDialog
          open={confirmOpen}
          onOpenChange={(open) => {
            setConfirmOpen(open);
            if (!open) setConfirmState(null);
          }}
          title={confirmState?.title || "Confirm action"}
          description={confirmState?.description || "Are you sure you want to proceed?"}
          confirmLabel="Yes"
          cancelLabel="No"
          destructive={confirmState?.destructive}
          onConfirm={handleConfirmAction}
        />
      </div>
    </DashboardLayout>
  );
}

function AdminStudentDetail({
  student,
  onClose,
  onSave,
  onShowIdCard,
  onApprove,
  onReject,
}: {
  student: StudentRecord;
  onClose: () => void;
  onSave: (student: StudentRecord) => void;
  onShowIdCard: () => void;
  onApprove: () => void;
  onReject: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ ...student });

  return (
    <>
      <DialogHeader>
        <div className="flex items-center justify-between gap-4">
          <div>
            <DialogTitle>{student.name}</DialogTitle>
            <DialogDescription>{student.school} • Class {student.class}-{student.division}</DialogDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onShowIdCard}>
              <FileText size={14} /> ID Card
            </Button>
            <Button variant="outline" size="sm" onClick={onClose}>Close</Button>
          </div>
        </div>
      </DialogHeader>

      {!editing ? (
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <span className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusBadgeClass(student.status)}`}>
              {getStatusLabel(student.status)}
            </span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              ["Admission No", student.admissionNo],
              ["DOB", student.dob],
              ["Blood Group", student.bloodGroup],
              ["Gender", student.gender],
              ["Parent", student.parentName],
              ["Mobile", student.parentMobile],
              ["Address", student.address],
              ["Emergency Contact", student.emergencyContact],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl bg-surface p-4">
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="mt-1 font-medium">{value || "—"}</p>
              </div>
            ))}
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setEditing(true)}>
              <Edit size={14} /> Edit
            </Button>
            {student.status === "PENDING_ADMIN" && (
              <>
                <Button variant="outline" className="text-destructive border-destructive/30" onClick={onReject}>
                  <XCircle size={14} /> Reject
                </Button>
                <Button variant="hero" onClick={onApprove}>
                  <ThumbsUp size={14} /> Approve
                </Button>
              </>
            )}
          </DialogFooter>
        </div>
      ) : (
        <div className="space-y-6">
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
                {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => <option key={bg} value={bg}>{bg}</option>)}
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
              <Input value={form.parentMobile} onChange={(e) => setForm({ ...form, parentMobile: e.target.value })} className="bg-surface border-border" />
            </div>
            <div className="sm:col-span-2 space-y-2">
              <Label>Address</Label>
              <Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="bg-surface border-border" />
            </div>
            <div className="sm:col-span-2 space-y-2">
              <Label>Emergency Contact</Label>
              <Input value={form.emergencyContact} onChange={(e) => setForm({ ...form, emergencyContact: e.target.value })} className="bg-surface border-border" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(false)}>Cancel</Button>
            <Button variant="hero" onClick={() => { onSave(form); setEditing(false); }}>
              Save Changes
            </Button>
          </DialogFooter>
        </div>
      )}
    </>
  );
}

function CardField({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-surface p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 font-semibold">{value}</p>
    </div>
  );
}
