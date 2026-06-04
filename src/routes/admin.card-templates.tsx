import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CreditCard, Upload, Trash2 } from "lucide-react";
import { adminSidebar } from "@/lib/nav";
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { getTemplates, uploadTemplate, updateTemplate, deleteTemplate } from "@/service/admin";

export const Route = createFileRoute("/admin/card-templates")({
  component: AdminTemplates,
});

type Template = {
  id: string;
  uploadedDate: string;
  fileName: string;
  imageUrl?: string;
};

function normalizeTemplate(template: any): Template {
  return {
    id: String(template.id ?? template.template_id ?? template.pk ?? template.uuid ?? ""),
    uploadedDate: template.uploaded_date || template.uploadedDate || template.created_at || new Date().toISOString().split("T")[0],
    fileName: template.file_name || template.filename || template.fileName || template.name || "",
    imageUrl:
      template.file_url ||
      template.file ||
      template.url ||
      template.image ||
      template.image_url ||
      template.template_url ||
      undefined,
  };
}

function TemplateCard({
  template,
  onDelete,
}: {
  template: Template;
  onDelete: (id: string) => Promise<void>;
}) {
  return (
    <div className="glass-card rounded-xl overflow-hidden border border-border bg-background shadow-sm group">
      <div className="relative h-32 overflow-hidden bg-slate-950/10 flex items-center justify-center p-4">
        {template.imageUrl ? (
          <img
            src={template.imageUrl}
            alt={template.name}
            className="max-h-full w-auto object-contain transition-transform duration-300 transform group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-slate-950/10 text-muted-foreground">
            <CreditCard size={48} />
          </div>
        )}
      </div>

      <div className="p-5 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold">{template.id}</h3>
            <p className="text-xs text-muted-foreground truncate">{template.fileName}</p>
          </div>
          <div className="flex flex-col items-end gap-1 text-right text-xs text-muted-foreground">
            <span>Uploaded</span>
            <span className="font-semibold text-foreground">{new Date(template.uploadedDate).toLocaleDateString()}</span>
          </div>
        </div>

        <Button variant="destructive" size="sm" onClick={() => onDelete(template.id)}>
          Delete
        </Button>
      </div>
    </div>
  );
}

function TemplateListView({
  templates,
  onUpload,
  onDelete,
}: {
  templates: Template[];
  onUpload: () => void;
  onDelete: (id: string) => Promise<void>;
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Card Templates</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage all available ID card templates</p>
        </div>
        <Button variant="hero" size="lg" onClick={onUpload} className="flex items-center gap-2">
          <Upload size={18} />
          Add New Template
        </Button>
      </div>

      {templates.length === 0 ? (
        <div className="glass-card rounded-xl p-12 text-center">
          <CreditCard size={48} className="mx-auto text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">No Templates Yet</h2>
          <p className="text-muted-foreground mb-6">Upload your first ID card template to get started.</p>
          <Button variant="hero" onClick={onUpload}>
            Upload Template
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((template) => (
            <TemplateCard key={template.id} template={template} onDelete={onDelete} />
          ))}
        </div>
      )}
    </div>
  );
}


function AdminTemplates() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadName, setUploadName] = useState("");
  const [loadingTemplates, setLoadingTemplates] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadTemplates = async () => {
      setError(null);
      setLoadingTemplates(true);
      try {
        const data = await getTemplates();
        const items = Array.isArray(data)
          ? data
          : data?.data?.results ?? data?.results ?? data?.data ?? [];
        setTemplates(items.map(normalizeTemplate));
      } catch (err) {
        console.error(err);
        setError("Unable to load templates. Please try again.");
        toast.error("Failed to load templates");
      } finally {
        setLoadingTemplates(false);
      }
    };

    loadTemplates();
  }, []);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedExtensions = [".psd", ".psb", ".jpg", ".jpeg", ".png"];
    const fileName = file.name.toLowerCase();
    const isAllowed = allowedExtensions.some((ext) => fileName.endsWith(ext));

    if (!isAllowed) {
      toast.error("Only PSD, PSB, JPG, JPEG, and PNG files are supported");
      return;
    }

    if (!uploadName.trim()) {
      toast.error("Please enter a name for the template before uploading.");
      return;
    }

    setUploading(true);
    try {
      const data = await uploadTemplate(file, uploadName.trim());
      const newTemplate = normalizeTemplate(data);
      setTemplates((current) => [newTemplate, ...current]);
      toast.success("Template uploaded successfully");
      setShowUploadDialog(false);
      setUploadName("");
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload template");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteTemplate = async (id: string) => {
    try {
      await deleteTemplate(id);
      setTemplates((current) => current.filter((t) => t.id !== id));
      toast.success("Template deleted");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete template");
    }
  };

  const handleUpdateTemplate = async (id: string) => {
    // No longer used since we removed edit functionality
  };

  return (
    <DashboardLayout title="ID Card Templates" role="Admin" items={adminSidebar}>
      <div className="space-y-6">
        {error && (
          <div className="rounded-xl bg-destructive/10 border border-destructive/20 p-4 text-sm text-destructive">
            {error}
          </div>
        )}
        {loadingTemplates && templates.length === 0 ? (
          <div className="glass-card rounded-xl p-6 text-center text-sm text-muted-foreground">
            Loading templates...
          </div>
        ) : (
          <TemplateListView
            templates={templates}
            onDelete={handleDeleteTemplate}
            onUpload={() => setShowUploadDialog(true)}
          />
        )}
      </div>

      {/* Upload Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload New Template</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground">Template ID</label>
                <input
                  value={uploadName}
                  onChange={(event) => setUploadName(event.target.value)}
                  placeholder="Enter template ID"
                  className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-primary"
                />
              </div>

              <div
              className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload size={32} className="mx-auto text-muted-foreground mb-2" />
              <p className="font-medium text-sm">Click to upload a template file</p>
              <p className="text-xs text-muted-foreground mt-1">Accepted: .psd, .psb, .jpg, .jpeg, .png</p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".psd,.psb,.jpg,.jpeg,.png"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>

            <div className="bg-blue-50 dark:bg-blue-950/30 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-xs text-blue-700 dark:text-blue-300">
                <strong>Tip:</strong> Upload PSD, PSB, JPG, JPEG, or PNG files. The template will be used for generating ID cards.
              </p>
            </div>

            <div className="flex gap-3">
              <Button variant="ghost" onClick={() => setShowUploadDialog(false)} className="flex-1">
                Cancel
              </Button>
              <Button
                variant="hero"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="flex-1"
              >
                {uploading ? "Uploading..." : "Select File"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
