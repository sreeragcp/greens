import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import {
  Users,
  GraduationCap,
  ShieldCheck,
  Phone,
  ArrowRight,
  UserPlus,
  Sparkles,
  BookOpen,
} from "lucide-react";
import parentChild from "@/assets/parent-child.jpg";
import teacherClassroom from "@/assets/teacher-classroom.jpg";
import adminOffice from "@/assets/admin-office.jpg";
import { handleLoginWithPassword } from "@/service/auth";
import { isValidIndianMobile, filterDigitsOnly } from "@/lib/utils";
import { login } from "@/redux/authSlice";
import { AppDispatch } from "@/redux/store";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

type Role = "teacher" | "admin";

const roles: {
  id: Role;
  label: string;
  icon: React.ElementType;
  description: string;
  redirect: string;
}[] = [
  {
    id: "teacher",
    label: "Teacher",
    icon: GraduationCap,
    description: "Enter student details & manage approvals",
    redirect: "/teacher",
  },
  {
    id: "admin",
    label: "Admin",
    icon: ShieldCheck,
    description: "Manage schools, templates & reports",
    redirect: "/admin",
  },
];

const roleVisuals: Record<
  Role,
  {
    image: string;
    alt: string;
    tagline: string;
    headline: React.ReactNode;
    subline: string;
  }
> = {
  teacher: {
    image: teacherClassroom,
    alt: "Teacher engaging with students in a bright modern classroom",
    tagline: "Teacher Portal Access",
    headline: (
      <>
        Manage your class with{" "}
        <span className="gradient-text">confidence and ease</span>
      </>
    ),
    subline:
      "Enter student details, review confirmations, and finalize ID cards for your assigned class & division.",
  },
  admin: {
    image: adminOffice,
    alt: "School administrator managing dashboards and reports in an office",
    tagline: "Admin Portal Access",
    headline: (
      <>
        Oversee schools, templates &{" "}
        <span className="gradient-text">reports in one place</span>
      </>
    ),
    subline:
      "Configure card templates, monitor approvals across schools, and generate reports for your entire institution.",
  },
};

function LoginPage() {
  const dispatch = useDispatch<AppDispatch>();
  const [selectedRole, setSelectedRole] = useState<Role>("teacher");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRoleChange = (id: Role) => {
    setSelectedRole(id);
    setPassword("");
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
            <span className="text-xs font-medium text-primary">
              {visual.tagline}
            </span>
          </div>
          <h2
            key={`h-${selectedRole}`}
            className="text-4xl xl:text-5xl font-bold leading-tight animate-fade-up"
          >
            {visual.headline}
          </h2>
          <p
            key={`p-${selectedRole}`}
            className="text-muted-foreground text-base max-w-md animate-fade-up"
          >
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
                <p className="text-[10px] text-muted-foreground">Password protected</p>
              </div>
              <div className="glass-card rounded-xl p-3 text-center">
                <BookOpen size={18} className="mx-auto text-primary mb-1" />
                <p className="text-xs font-semibold">Simple</p>
                <p className="text-[10px] text-muted-foreground">Use your password</p>
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
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold">Welcome back</h1>
            <p className="text-muted-foreground mt-2">
              Sign in with mobile number and password
            </p>
          </div>

          {/* Role selector */}
          <div className="flex justify-center gap-3 mb-8">
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
                <role.icon
                  size={22}
                  className={`mx-auto mb-1.5 sm:mb-2 ${selectedRole === role.id ? "text-primary" : "text-muted-foreground"}`}
                />
                <p
                  className={`text-xs sm:text-sm font-medium ${selectedRole === role.id ? "text-primary" : "text-muted-foreground"}`}
                >
                  {role.label}
                </p>
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

            {selectedRole === "teacher" && (
              <div className="mb-4 rounded-xl bg-primary/5 border border-primary/15 p-3 text-xs text-center text-muted-foreground">
                New teacher?{" "}
                <Link
                  to="/teacher-register"
                  className="text-primary font-medium hover:underline inline-flex items-center gap-1"
                >
                  <UserPlus size={12} /> Register here
                </Link>
              </div>
            )}
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm">
                    Mobile Number
                  </Label>
                  <div className="relative">
                    <Phone
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    />
                    <Input
                      id="phone"
                      type="tel"
                      inputMode="numeric"
                      maxLength={10}
                      placeholder="9876543210"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(filterDigitsOnly(e.target.value))}
                      className="bg-surface border-border focus:border-primary pl-10"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {selectedRole === "teacher"
                      ? "Enter your registered teacher mobile number (10 digits)"
                      : "Enter your authorized admin mobile number (10 digits)"}
                  </p>
                  {phoneNumber && (
                    <p className={`text-xs ${
                      isValidIndianMobile(phoneNumber) ? "text-emerald-600" : "text-destructive"
                    }`}>
                      {isValidIndianMobile(phoneNumber) ? "✓ Valid mobile number" : "✗ Invalid mobile number (6-9 start, 10 digits)"}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-surface border-border"
                  />
                </div>

                <Button
                  variant="hero"
                  size="lg"
                  className="w-full"
                  onClick={async () => {
                    if (!isValidIndianMobile(phoneNumber)) {
                      toast.error(
                        "Mobile number should follow Indian standard: 10 digits starting with 6-9.",
                      );
                      return;
                    }

                    if (!password || password.length < 6) {
                      toast.error("Please enter your password (min 6 characters)");
                      return;
                    }

                    try {
                      const role = selectedRole.toUpperCase();
                      const res = await handleLoginWithPassword(phoneNumber, password, role);

                      const accessToken = res?.data?.tokens?.access || res?.access || res?.data?.access || "";
                      const refreshToken = res?.data?.tokens?.refresh || res?.refresh || res?.data?.refresh || "";
                      const user = res?.data?.user || res?.user || null;

                      const success = res?.status === true || !!accessToken;

                      if (!success) {
                        toast.error(res?.error || res?.message || "Login failed. Please check your credentials.");
                        return;
                      }

                      if (accessToken && user) {
                        dispatch(
                          login({
                            accessToken,
                            refreshToken,
                            user,
                          }),
                        );
                      }

                      if (selectedRole === "teacher") {
                        const teacherProfile =
                          res?.profile || res?.teacher || res?.data?.teacher || res?.data?.profile || null;

                        try {
                          if (teacherProfile) {
                            const normalized = {
                              schoolName:
                                teacherProfile.schoolName ||
                                teacherProfile.school_name ||
                                teacherProfile.school ||
                                "",
                              teacherName:
                                teacherProfile.name ||
                                teacherProfile.teacherName ||
                                teacherProfile.first_name ||
                                phoneNumber,
                              classGrade:
                                teacherProfile.class ||
                                teacherProfile.classGrade ||
                                "",
                              division: teacherProfile.division || "",
                              mobile: teacherProfile.phone || phoneNumber,
                              email: teacherProfile.email || "",
                            };
                            localStorage.setItem(
                              "markone.teacherProfile",
                              JSON.stringify(normalized),
                            );
                          } else {
                            const placeholder = {
                              schoolName: "",
                              teacherName: phoneNumber,
                              classGrade: "",
                              division: "",
                              mobile: phoneNumber,
                              email: "",
                            };
                            localStorage.setItem(
                              "markone.teacherProfile",
                              JSON.stringify(placeholder),
                            );
                          }
                        } catch {
                          // ignore storage errors
                        }

                        toast.success(`Welcome back, ${currentRole.label}!`);
                        navigate({ to: currentRole.redirect });
                        return;
                      }

                      toast.success(`Welcome back, ${currentRole.label}!`);
                      navigate({ to: currentRole.redirect });
                    } catch (err: any) {
                      const msg = err?.error || err?.message || (err && JSON.stringify(err)) || "Login failed";
                      toast.error(msg);
                    }
                  }}
                >
                  Sign in <ArrowRight size={16} />
                </Button>
              </>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
