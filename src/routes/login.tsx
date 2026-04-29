import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";
import { Users, GraduationCap, ShieldCheck, Phone, ArrowRight, UserPlus, Sparkles, BookOpen } from "lucide-react";
import parentChild from "@/assets/parent-child.jpg";
import teacherClassroom from "@/assets/teacher-classroom.jpg";
import adminOffice from "@/assets/admin-office.jpg";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

type Role = "parent" | "teacher" | "admin";

const roles: { id: Role; label: string; icon: React.ElementType; description: string; redirect: string }[] = [
  { id: "parent", label: "Parent", icon: Users, description: "View & verify your child's ID details", redirect: "/parent" },
  { id: "teacher", label: "Teacher", icon: GraduationCap, description: "Enter student details & manage approvals", redirect: "/teacher" },
  { id: "admin", label: "Admin", icon: ShieldCheck, description: "Manage schools, templates & reports", redirect: "/admin" },
];

const roleVisuals: Record<Role, { image: string; alt: string; tagline: string; headline: React.ReactNode; subline: string }> = {
  parent: {
    image: parentChild,
    alt: "Happy parent and child reviewing student details on a phone",
    tagline: "Parent Portal Access",
    headline: <>Stay connected to your <span className="gradient-text">child's school journey</span></>,
    subline: "Verify ID details, download official cards, and approve updates — all from your phone with a secure OTP.",
  },
  teacher: {
    image: teacherClassroom,
    alt: "Teacher engaging with students in a bright modern classroom",
    tagline: "Teacher Portal Access",
    headline: <>Manage your class with <span className="gradient-text">confidence and ease</span></>,
    subline: "Enter student details, review parent confirmations, and finalize ID cards for your assigned class & division.",
  },
  admin: {
    image: adminOffice,
    alt: "School administrator managing dashboards and reports in an office",
    tagline: "Admin Portal Access",
    headline: <>Oversee schools, templates & <span className="gradient-text">reports in one place</span></>,
    subline: "Configure card templates, monitor approvals across schools, and generate reports for your entire institution.",
  },
};

function LoginPage() {
  const [selectedRole, setSelectedRole] = useState<Role>("parent");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const navigate = useNavigate();

  const handleRoleChange = (id: Role) => {
    setSelectedRole(id);
    setStep("phone");
    setOtp(["", "", "", "", "", ""]);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      const next = document.getElementById(`otp-${index + 1}`);
      next?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prev = document.getElementById(`otp-${index - 1}`);
      prev?.focus();
    }
  };

  const currentRole = roles.find((r) => r.id === selectedRole)!;
  const visual = roleVisuals[selectedRole];

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Header />
      <div className="container mx-auto grid lg:grid-cols-2 gap-8 lg:gap-10 px-4 sm:px-6 pt-24 pb-10 lg:pt-28 lg:pb-12 items-center">
        {/* LEFT - imagery */}
        <aside className="hidden lg:flex flex-col gap-6 animate-slide-in-left">
          <div className="inline-flex w-fit items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-4 py-1.5 transition-all duration-300">
            <Sparkles size={14} className="text-primary" />
            <span className="text-xs font-medium text-primary">{visual.tagline}</span>
          </div>
          <h2 key={`h-${selectedRole}`} className="text-4xl xl:text-5xl font-bold leading-tight animate-fade-up">
            {visual.headline}
          </h2>
          <p key={`p-${selectedRole}`} className="text-muted-foreground text-base max-w-md animate-fade-up">
            {visual.subline}
          </p>
          <div className="rounded-3xl overflow-hidden glass-card glow-brand-sm">
            <img
              key={visual.image}
              src={visual.image}
              alt={visual.alt}
              loading="lazy"
              width={1024}
              height={1024}
              className="w-full h-auto object-cover transition-opacity duration-500 animate-fade-in"
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="glass-card rounded-xl p-3 text-center">
              <ShieldCheck size={18} className="mx-auto text-primary mb-1" />
              <p className="text-xs font-semibold">Secure</p>
              <p className="text-[10px] text-muted-foreground">OTP verified</p>
            </div>
            <div className="glass-card rounded-xl p-3 text-center">
              <BookOpen size={18} className="mx-auto text-primary mb-1" />
              <p className="text-xs font-semibold">Simple</p>
              <p className="text-[10px] text-muted-foreground">No passwords</p>
            </div>
            <div className="glass-card rounded-xl p-3 text-center">
              <Users size={18} className="mx-auto text-primary mb-1" />
              <p className="text-xs font-semibold">All roles</p>
              <p className="text-[10px] text-muted-foreground">One login</p>
            </div>
          </div>
        </aside>

        {/* RIGHT - form */}
        <div className="w-full max-w-md mx-auto lg:mx-0 animate-fade-up">
          <div className="text-center lg:text-left mb-8">
            <h1 className="text-3xl font-bold">Welcome back</h1>
            <p className="text-muted-foreground mt-2">Sign in securely with mobile OTP</p>
          </div>

          {/* Role selector */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-8">
            {roles.map((role) => (
              <button
                key={role.id}
                onClick={() => handleRoleChange(role.id)}
                className={`glass-card rounded-xl p-3 sm:p-4 text-center transition-all duration-200 cursor-pointer ${
                  selectedRole === role.id
                    ? "border-primary/60 bg-primary/10 glow-green-sm"
                    : "hover:bg-surface-hover"
                }`}
              >
                <role.icon size={22} className={`mx-auto mb-1.5 sm:mb-2 ${selectedRole === role.id ? "text-primary" : "text-muted-foreground"}`} />
                <p className={`text-xs sm:text-sm font-medium ${selectedRole === role.id ? "text-primary" : "text-muted-foreground"}`}>{role.label}</p>
              </button>
            ))}
          </div>

          {/* OTP login form (unified for all roles) */}
          <div className="glass-card rounded-2xl p-5 sm:p-6 glow-green-sm">
            <div className="mb-6">
              <p className="text-sm text-muted-foreground text-center">
                {currentRole.description}
              </p>
            </div>

            {selectedRole === "teacher" && step === "phone" && (
              <div className="mb-4 rounded-xl bg-primary/5 border border-primary/15 p-3 text-xs text-center text-muted-foreground">
                New teacher?{" "}
                <Link to="/teacher-register" className="text-primary font-medium hover:underline inline-flex items-center gap-1">
                  <UserPlus size={12} /> Register here
                </Link>
              </div>
            )}

            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              {step === "phone" ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm">Mobile Number</Label>
                    <div className="relative">
                      <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+91 XXXXX XXXXX"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="bg-surface border-border focus:border-primary pl-10"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {selectedRole === "parent"
                        ? "Enter the mobile number registered with the school"
                        : selectedRole === "teacher"
                        ? "Enter your registered teacher mobile number"
                        : "Enter your authorized admin mobile number"}
                    </p>
                  </div>
                  <Button
                    variant="hero"
                    size="lg"
                    className="w-full"
                    onClick={() => {
                      const digits = phoneNumber.replace(/\D/g, "");
                      if (digits.length < 10) {
                        toast.error("Please enter a valid 10-digit mobile number");
                        return;
                      }
                      toast.success(`OTP sent to ${phoneNumber}`, {
                        description: "Use any 6 digits to continue (demo mode).",
                      });
                      setStep("otp");
                    }}
                  >
                    Send OTP <ArrowRight size={16} />
                  </Button>
                </>
              ) : (
                <>
                  <div className="space-y-3">
                    <Label className="text-sm">Enter OTP sent to {phoneNumber || "+91 XXXXX"}</Label>
                    <div className="flex justify-center gap-1.5 sm:gap-2">
                      {otp.map((digit, i) => (
                        <input
                          key={i}
                          id={`otp-${i}`}
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
                        className="text-primary hover:underline"
                        onClick={() => toast.success(`OTP resent to ${phoneNumber || "your mobile"}`)}
                      >
                        Resend OTP
                      </button>
                    </p>
                  </div>
                  <Button
                    variant="hero"
                    size="lg"
                    className="w-full"
                    onClick={() => {
                      if (otp.join("").length < 6) {
                        toast.error("Please enter the full 6-digit OTP");
                        return;
                      }
                      toast.success(`Welcome back, ${currentRole.label}!`);
                      navigate({ to: currentRole.redirect });
                    }}
                  >
                    Verify & Login as {currentRole.label}
                  </Button>
                  <button
                    type="button"
                    onClick={() => setStep("phone")}
                    className="w-full text-sm text-muted-foreground hover:text-foreground text-center"
                  >
                    ← Change number
                  </button>
                </>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
