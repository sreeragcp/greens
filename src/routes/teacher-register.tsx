import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { isValidIndianMobile } from "@/lib/utils";
import {
  GraduationCap,
  School,
  User,
  Phone,
  Mail,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  BookOpen,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import teacherIllustration from "@/assets/teacher-students.jpg";
import { teacherRegistration, handleGetSchoolNames, handleVerifyOTP } from "@/service/teacher";

export const Route = createFileRoute("/teacher-register")({
  component: TeacherRegister,
});

const SCHOOLS = [
  { id: "delhi-public-school-noida", name: "Delhi Public School, Noida" },
  { id: "markone-international-academy-bengaluru", name: "Mark One International Academy, Bengaluru" },
  { id: "st-xaviers-high-school-mumbai", name: "St. Xavier's High School, Mumbai" },
  { id: "kendriya-vidyalaya-chennai", name: "Kendriya Vidyalaya, Chennai" },
  { id: "bishop-cotton-school-shimla", name: "Bishop Cotton School, Shimla" },
  { id: "dav-public-school-pune", name: "DAV Public School, Pune" },
  { id: "modern-school-new-delhi", name: "Modern School, New Delhi" },
  { id: "greenwood-high-hyderabad", name: "Greenwood High, Hyderabad" },
];

const CLASSES = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
const DIVISIONS = ["A", "B", "C", "D", "E"];

type TeacherProfile = {
  schoolId: string;
  schoolName: string;
  teacherName: string;
  classGrade: string;
  division: string;
  mobile: string;
  email: string;
};

function TeacherRegister() {
  const navigate = useNavigate();
  const [step, setStep] = useState<"form" | "otp" | "done">("form");
  const [profile, setProfile] = useState<TeacherProfile>({
    schoolId: "",
    schoolName: "",
    teacherName: "",
    classGrade: "",
    division: "",
    mobile: "",
    email: "",
  });
  const [schoolList, setSchoolList] = useState<Array<{ id: string; name: string }>>([]);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [resendTimer, setResendTimer] = useState(0);

  const startResendCountdown = () => setResendTimer(300);

  const getRegistrationPayload = () => {
    const [first_name = "", last_name = ""] = profile.teacherName
      .trim()
      .split(/\s+/, 2);

    return {
      phone: profile.mobile,
      first_name,
      last_name,
      email: profile.email,
      role: "TEACHER",
      school: profile.schoolId || "",
      division: profile.division || "",
      class: profile.classGrade || "",
    };
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0) return;

    try {
      const res = await teacherRegistration(getRegistrationPayload());
      const success = res === true || res?.status === true || res?.success === true;

      if (success) {
        toast.success(`OTP resent to ${profile.mobile}`, {
          description: "Please check your phone for the new code.",
        });
        startResendCountdown();
      } else {
        toast.error(
          res?.error || res?.message || "Unable to resend OTP. Please try again.",
        );
      }
    } catch (err: any) {
      const msg =
        err?.error ||
        err?.message ||
        (err && JSON.stringify(err)) ||
        "Unable to resend OTP. Please try again.";
      toast.error(msg);
    }
  };

  useEffect(() => {
    if (resendTimer <= 0) return;

    const interval = window.setInterval(() => {
      setResendTimer((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => window.clearInterval(interval);
  }, [resendTimer]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!profile.schoolId) e.schoolName = "Please select your school";
    if (!profile.teacherName.trim() || profile.teacherName.trim().length < 2)
      e.teacherName = "Enter your full name";
    if (!profile.classGrade) e.classGrade = "Select class";
    if (!profile.division) e.division = "Select division";
    if (!isValidIndianMobile(profile.mobile))
      e.mobile = "Enter a valid Indian mobile number starting with 6-9.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email))
      e.email = "Enter a valid email";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const loadSchoolNames = async () => {
    try {
      const res = await handleGetSchoolNames();
      const items = Array.isArray(res) ? res : res?.data || [];

      const schools = items
        .map((school: any) => ({
          id:
            school.id?.toString() ||
            school.school_id?.toString() ||
            school.value?.toString() ||
            school.name?.toString() ||
            "",
          name:
            school.name ||
            school.school_name ||
            school.schoolName ||
            school.value ||
            "",
        }))
        .filter((school: any) => school.id && school.name);

      if (schools.length) {
        setSchoolList(schools);
      }
    } catch (error: any) {
      const msg =
        error?.message ||
        (error && JSON.stringify(error)) ||
        "Unable to load school names";

      toast.error(msg);
    }
  };

  useEffect(() => {
    loadSchoolNames();
  }, []);

  const availableSchools = schoolList.length ? schoolList : SCHOOLS;

  const handleSendOtp = async () => {
    if (!validate()) {
      toast.error("Please fix the highlighted fields");
      return;
    }

    const [first_name = "", last_name = ""] = profile.teacherName
      .trim()
      .split(/\s+/, 2);

    const payload = getRegistrationPayload();

    try {
      const res = await teacherRegistration(payload);
      const success = res === true || res?.status === true || res?.success === true;

      if (success) {
        toast.success(`OTP sent to ${profile.mobile}`, {
          description: "Use any 6 digits to continue (demo mode).",
        });
        setStep("otp");
        startResendCountdown();
      } else {
        toast.error("Unable to start registration. Please try again.");
      }
    } catch (err: any) {
      const msg =
        err?.error ||
        err?.message ||
        (err && JSON.stringify(err)) ||
        "Unable to start registration. Please try again.";
      toast.error(msg);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5)
      document.getElementById(`reg-otp-${index + 1}`)?.focus();
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0)
      document.getElementById(`reg-otp-${index - 1}`)?.focus();
  };

  const handleVerify = async() => {
    if (otp.join("").length < 6) {
      toast.error("Please enter the full 6-digit OTP");
      return;
    }

    try {
      const response = await handleVerifyOTP(profile.mobile, otp.join(""));
      console.log(response, "rrrrrrrrrrrrrrr");

      const success = response?.status === true;
      if (!success) {
        toast.error(
          response?.error || response?.message || "OTP verification failed. Please try again.",
        );
        return;
      }

      toast.success(`Welcome, ${profile.teacherName}!`, {
        description: "OTP verified — redirecting to your dashboard…",
      });
      setStep("done");
      setTimeout(() => navigate({ to: "/teacher" }), 1200);
    } catch (err: any) {
      const msg =
        err?.error ||
        err?.message ||
        (err && JSON.stringify(err)) ||
        "Unable to verify OTP. Please try again.";
      toast.error(msg);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <header className="border-b border-border/40 bg-background/60 backdrop-blur-md">
        <div className="container mx-auto flex items-center justify-between px-4 py-4 gap-3">
          <Link to="/" className="flex items-center gap-2 min-w-0">
            <img src="/logo.png" alt="Mark One logo" className="h-9 w-auto shrink-0 object-contain" />
            <span className="font-bold text-base sm:text-lg truncate">
              <span className="sr-only">Mark One</span>
              <span className="text-primary">Portal</span>
            </span>
          </Link>
          <Link
            to="/login"
            className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors text-right shrink-0"
          >
            <span className="hidden sm:inline">Already registered? </span>
            <span className="text-primary font-medium">Login</span>
          </Link>
        </div>
      </header>

      <div className="container mx-auto grid lg:grid-cols-2 gap-8 px-4 py-8 lg:py-12 items-start">
        {/* LEFT */}
        <aside className="hidden lg:flex flex-col gap-6 sticky top-24 animate-slide-in-left">
          <div className="inline-flex w-fit items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-4 py-1.5">
            <Sparkles size={14} className="text-primary" />
            <span className="text-xs font-medium text-primary">
              For Educators
            </span>
          </div>
          <h1 className="text-4xl xl:text-5xl font-bold tracking-tight leading-tight">
            Empower your classroom,{" "}
            <span className="gradient-text">one student at a time</span>
          </h1>
          <p className="text-muted-foreground text-base max-w-md">
            Join hundreds of teachers issuing secure, professional student ID
            cards in minutes. Built for Indian schools, loved by educators.
          </p>

          <div className="rounded-3xl overflow-hidden glass-card glow-green-sm">
            <img
              src={teacherIllustration}
              alt="Friendly teacher with happy school students holding ID cards"
              width={1024}
              height={1024}
              className="w-full h-auto object-cover"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Perk icon={ShieldCheck} title="Secure" subtitle="OTP verified" />
            <Perk icon={BookOpen} title="Simple" subtitle="3-step setup" />
            <Perk icon={School} title="Trusted" subtitle="500+ schools" />
          </div>
        </aside>

        {/* RIGHT */}
        <div className="w-full max-w-xl mx-auto lg:mx-0 animate-fade-up">
          <div className="lg:hidden text-center mb-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-4 py-1.5 mb-4">
              <GraduationCap size={14} className="text-primary" />
              <span className="text-xs font-medium text-primary">
                Teacher Registration
              </span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">
              Welcome, <span className="gradient-text">Educator</span>
            </h1>
            <p className="text-muted-foreground mt-2 text-sm">
              Register your class to begin issuing student ID cards.
            </p>
          </div>

          <div className="hidden lg:block mb-6">
            <h2 className="text-2xl font-bold">Create your teacher account</h2>
            <p className="text-muted-foreground text-sm mt-1">
              Tell us about your school and class — takes under a minute.
            </p>
          </div>

          <div className="flex items-center justify-center lg:justify-start gap-2 mb-6">
            <Stepper
              label="Details"
              active={step === "form"}
              done={step !== "form"}
            />
            <div className="h-px w-10 bg-border" />
            <Stepper
              label="Verify OTP"
              active={step === "otp"}
              done={step === "done"}
            />
            <div className="h-px w-10 bg-border" />
            <Stepper label="Done" active={step === "done"} done={false} />
          </div>

          <div className="glass-card rounded-2xl p-5 sm:p-8 glow-green-sm">
            {step === "form" && (
              <form
                className="space-y-5"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendOtp();
                }}
              >
                <Field
                  label="School Name"
                  icon={School}
                  error={errors.schoolName}
                >
                  <Select
                    value={profile.schoolId}
                    onValueChange={(v) => {
                      const selected = availableSchools.find((item) => item.id === v);
                      setProfile({
                        ...profile,
                        schoolId: v,
                        schoolName: selected?.name || "",
                      });
                    }}
                  >
                    <SelectTrigger className="bg-surface border-border h-11 pl-10">
                      <SelectValue placeholder="Select your school" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableSchools.map((s) => (
                        <SelectItem key={s.id} value={s.id}>
                          {s.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>

                <Field
                  label="Teacher Full Name"
                  icon={User}
                  error={errors.teacherName}
                >
                  <Input
                    value={profile.teacherName}
                    onChange={(e) =>
                      setProfile({ ...profile, teacherName: e.target.value })
                    }
                    placeholder="e.g., Priya Sharma"
                    maxLength={80}
                    className="bg-surface border-border h-11 pl-10"
                  />
                </Field>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm">Class</Label>
                    <Select
                      value={profile.classGrade}
                      onValueChange={(v) =>
                        setProfile({ ...profile, classGrade: v })
                      }
                    >
                      <SelectTrigger className="bg-surface border-border h-11">
                        <SelectValue placeholder="Select class" />
                      </SelectTrigger>
                      <SelectContent>
                        {CLASSES.map((c) => (
                          <SelectItem key={c} value={c}>
                            Class {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.classGrade && (
                      <p className="text-xs text-destructive">
                        {errors.classGrade}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Division</Label>
                    <Select
                      value={profile.division}
                      onValueChange={(v) =>
                        setProfile({ ...profile, division: v })
                      }
                    >
                      <SelectTrigger className="bg-surface border-border h-11">
                        <SelectValue placeholder="Select division" />
                      </SelectTrigger>
                      <SelectContent>
                        {DIVISIONS.map((d) => (
                          <SelectItem key={d} value={d}>
                            Division {d}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.division && (
                      <p className="text-xs text-destructive">
                        {errors.division}
                      </p>
                    )}
                  </div>
                </div>

                <Field label="Mobile Number" icon={Phone} error={errors.mobile}>
                  <Input
                    type="tel"
                    value={profile.mobile}
                    onChange={(e) =>
                      setProfile({ ...profile, mobile: e.target.value })
                    }
                    placeholder="+91 98765 43210"
                    maxLength={20}
                    className="bg-surface border-border h-11 pl-10"
                  />
                </Field>

                <Field label="Email Address" icon={Mail} error={errors.email}>
                  <Input
                    type="email"
                    value={profile.email}
                    onChange={(e) =>
                      setProfile({ ...profile, email: e.target.value })
                    }
                    placeholder="teacher@school.edu.in"
                    maxLength={120}
                    className="bg-surface border-border h-11 pl-10"
                  />
                </Field>

                <div className="rounded-xl bg-primary/5 border border-primary/15 p-3 text-xs text-muted-foreground">
                  <span className="text-primary font-medium">Note:</span> A
                  6-digit OTP will be sent to your mobile to verify your
                  identity.
                </div>

                <Button
                  type="submit"
                  variant="hero"
                  size="lg"
                  className="w-full"
                >
                  Continue to OTP <ArrowRight size={16} />
                </Button>

                <p className="text-center text-sm text-muted-foreground">
                  Already registered?{" "}
                  <Link
                    to="/login"
                    className="text-primary hover:underline font-medium"
                  >
                    Login here
                  </Link>
                </p>
              </form>
            )}

            {step === "otp" && (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-xl font-semibold">Verify your mobile</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    We sent a 6-digit code to{" "}
                    <span className="text-foreground font-medium">
                      {profile.mobile}
                    </span>
                  </p>
                </div>

                <div className="flex justify-center gap-1.5 sm:gap-2">
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      id={`reg-otp-${i}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      className="w-9 h-11 sm:w-11 sm:h-12 text-center text-base sm:text-lg font-bold rounded-lg border border-border bg-surface text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-ring transition-colors"
                    />
                  ))}
                </div>

                <p className="text-xs text-muted-foreground text-center">
                  Didn't receive?{" "}
                  <button
                    type="button"
                    className={`text-primary ${resendTimer > 0 ? "opacity-50 cursor-not-allowed" : "hover:underline"}`}
                    onClick={handleResendOtp}
                    disabled={resendTimer > 0}
                  >
                    {resendTimer > 0
                      ? `Resend OTP (${Math.floor(resendTimer / 60)}:${String(resendTimer % 60).padStart(2, "0")})`
                      : "Resend OTP"}
                  </button>
                </p>

                <Button
                  variant="hero"
                  size="lg"
                  className="w-full"
                  onClick={handleVerify}
                >
                  <CheckCircle2 size={16} /> Verify & Complete Registration
                </Button>

                <button
                  type="button"
                  onClick={() => setStep("form")}
                  className="w-full text-sm text-muted-foreground hover:text-foreground inline-flex items-center justify-center gap-1"
                >
                  <ArrowLeft size={14} /> Edit details
                </button>
              </div>
            )}

            {step === "done" && (
              <div className="text-center py-8 space-y-4 animate-scale-in">
                <div className="mx-auto h-16 w-16 rounded-full bg-primary/15 flex items-center justify-center">
                  <CheckCircle2 size={32} className="text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">
                    Registration successful!
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Redirecting you to your teacher dashboard…
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Perk({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: React.ElementType;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="glass-card rounded-xl p-3 text-center">
      <Icon size={18} className="mx-auto text-primary mb-1" />
      <p className="text-xs font-semibold">{title}</p>
      <p className="text-[10px] text-muted-foreground">{subtitle}</p>
    </div>
  );
}

function Stepper({
  label,
  active,
  done,
}: {
  label: string;
  active: boolean;
  done: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${
          done
            ? "bg-primary text-primary-foreground"
            : active
              ? "bg-primary/20 text-primary border border-primary/40"
              : "bg-surface text-muted-foreground border border-border"
        }`}
      >
        {done ? <CheckCircle2 size={14} /> : label[0]}
      </div>
      <span
        className={`text-xs font-medium hidden sm:inline ${active || done ? "text-foreground" : "text-muted-foreground"}`}
      >
        {label}
      </span>
    </div>
  );
}

function Field({
  label,
  icon: Icon,
  error,
  children,
}: {
  label: string;
  icon: React.ElementType;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label className="text-sm">{label}</Label>
      <div className="relative">
        <Icon
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground z-10 pointer-events-none"
        />
        {children}
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
