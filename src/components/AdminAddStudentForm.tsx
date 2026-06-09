import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Camera, Upload, X, AlertCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { isValidIndianMobile } from "@/lib/utils";

type StudentEntry = {
  id: number;
  name: string;
  teacherName: string;
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
  status: string;
};

export function AdminAddStudentForm({
  school,
  class: className,
  division,
  onSave,
  onCancel,
}: {
  school: string;
  class: string;
  division: string;
  onSave: (s: any) => Promise<void> | void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<StudentEntry>({
    id: 0,
    name: "",
    teacherName: "",
    admissionNo: "",
    class: className,
    division: division,
    dob: "",
    bloodGroup: "",
    gender: "",
    parentName: "",
    parentMobile: "",
    address: "",
    emergencyContact: "",
    photo: null,
    status: "PENDING_ADMIN",
  });
  const [errors, setErrors] = useState<{
    parentMobile?: string;
    emergencyContact?: string;
  }>({});

  const validateForm = () => {
    const nextErrors: typeof errors = {};

    if (!form.name.trim()) {
      toast.error("Student name is required");
      return false;
    }

    if (!form.teacherName.trim()) {
      toast.error("Teacher name is required");
      return false;
    }

    if (!form.admissionNo.trim()) {
      toast.error("Admission number is required");
      return false;
    }

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
      toast.error("Please fix the errors before saving.");
      return;
    }
    onSave(form);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Add New Student</h2>
          <p className="text-sm text-muted-foreground mt-1">
            School: <span className="font-medium text-foreground">{school}</span>
            {" "} | Class: <span className="font-medium text-foreground">{className}</span>
            {" "} | Division: <span className="font-medium text-foreground">{division}</span>
          </p>
        </div>
        <button
          onClick={onCancel}
          className="text-muted-foreground hover:text-foreground transition-colors p-2 hover:bg-surface rounded-lg"
        >
          <X size={24} />
        </button>
      </div>

      {/* Main Form Container */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left: Photo Section */}
        <div className="lg:col-span-1">
          <div className="glass-card rounded-xl p-6 space-y-4">
            <h3 className="font-semibold text-sm">Student Photo</h3>
            <div className="relative mx-auto w-full max-w-60">
              <div className="aspect-square w-full rounded-3xl border border-border/70 bg-surface shadow-sm flex items-center justify-center overflow-hidden">
                {form.photo ? (
                  <img
                    src={form.photo}
                    alt="Student"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="text-center px-4">
                    <Camera size={36} className="text-muted-foreground mx-auto mb-3" />
                    <p className="text-sm font-medium text-foreground mb-1">Upload Student Photo</p>
                    <p className="text-xs text-muted-foreground">JPG, PNG or WebP · Max 5MB</p>
                  </div>
                )}
              </div>
              <label className="absolute bottom-3 right-3 h-10 w-10 rounded-xl bg-primary flex items-center justify-center cursor-pointer hover:bg-primary/90 transition-colors shadow-lg">
                <Upload size={16} className="text-primary-foreground" />
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
        </div>

        {/* Right: Form Fields */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="glass-card rounded-xl p-6 space-y-4">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <div className="h-6 w-1 bg-primary rounded-full"></div>
              Basic Information
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Student Full Name *</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Enter full name"
                  className="bg-surface border-border"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Teacher Name *</Label>
                <Input
                  value={form.teacherName}
                  onChange={(e) =>
                    setForm({ ...form, teacherName: e.target.value })
                  }
                  placeholder="Enter teacher name"
                  className="bg-surface border-border"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Admission Number *</Label>
                <Input
                  value={form.admissionNo}
                  onChange={(e) =>
                    setForm({ ...form, admissionNo: e.target.value })
                  }
                  placeholder="ADM-001"
                  className="bg-surface border-border"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Date of Birth</Label>
                <Input
                  type="date"
                  value={form.dob}
                  onChange={(e) => setForm({ ...form, dob: e.target.value })}
                  className="bg-surface border-border"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Blood Group</Label>
                <select
                  value={form.bloodGroup}
                  onChange={(e) =>
                    setForm({ ...form, bloodGroup: e.target.value })
                  }
                  className="flex h-9 w-full rounded-md border border-border bg-surface px-3 py-1 text-sm text-foreground"
                >
                  <option value="">Select Blood Group</option>
                  {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
                    <option key={bg} value={bg}>
                      {bg}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Gender</Label>
                <select
                  value={form.gender}
                  onChange={(e) => setForm({ ...form, gender: e.target.value })}
                  className="flex h-9 w-full rounded-md border border-border bg-surface px-3 py-1 text-sm text-foreground"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Parent/Guardian Information */}
          <div className="glass-card rounded-xl p-6 space-y-4">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <div className="h-6 w-1 bg-primary rounded-full"></div>
              Parent/Guardian Information
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-1">
                <Label className="text-sm font-medium">
                  Parent/Guardian Name *
                </Label>
                <Input
                  value={form.parentName}
                  onChange={(e) =>
                    setForm({ ...form, parentName: e.target.value })
                  }
                  placeholder="Enter parent name"
                  className="bg-surface border-border"
                />
              </div>
              <div className="space-y-2 sm:col-span-1">
                <Label className="text-sm font-medium">Parent Mobile *</Label>
                <Input
                  type="tel"
                  value={form.parentMobile}
                  onChange={(e) =>
                    setForm({ ...form, parentMobile: e.target.value })
                  }
                  placeholder="10-digit mobile number"
                  className="bg-surface border-border"
                />
                {errors.parentMobile && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <AlertCircle size={12} />
                    {errors.parentMobile}
                  </p>
                )}
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label className="text-sm font-medium">Address</Label>
                <Textarea
                  value={form.address}
                  onChange={(e) =>
                    setForm({ ...form, address: e.target.value })
                  }
                  placeholder="Home address"
                  rows={4}
                  className="bg-surface border-border resize-none"
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label className="text-sm font-medium">Emergency Contact</Label>
                <Input
                  type="tel"
                  value={form.emergencyContact}
                  onChange={(e) =>
                    setForm({ ...form, emergencyContact: e.target.value })
                  }
                  placeholder="10-digit emergency contact number"
                  className="bg-surface border-border"
                />
                {errors.emergencyContact && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <AlertCircle size={12} />
                    {errors.emergencyContact}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-end">
            <Button variant="outline" onClick={onCancel} className="sm:w-auto">
              Cancel
            </Button>
            <Button variant="hero" onClick={handleSave} className="sm:w-auto">
              Save & Add Student
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
