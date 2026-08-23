"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { MessageSquare, GitBranch, Bot, FolderPlus, ArrowUpRight } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { workspaceApi } from "@/services/api.endpoints";
import { ApiClientError } from "@/types/api";

const actions = [
  { label: "Start an AI Chat", href: "/chat", icon: MessageSquare, hint: "Coming soon" },
  { label: "Create a Flow", href: "/flows", icon: GitBranch, hint: "Coming soon" },
  { label: "Deploy an Agent", href: "/agents", icon: Bot, hint: "Coming soon" },
];

export function QuickActions({ onProjectCreated }: { onProjectCreated?: () => void }) {
  const { bundle } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>();

  const workspaceId = bundle?.workspace?.id;

  async function handleCreateProject(e: FormEvent) {
    e.preventDefault();
    if (!name.trim() || !workspaceId) return;
    setSaving(true);
    setError(undefined);
    try {
      await workspaceApi.createProject(workspaceId, { name: name.trim(), description: description.trim() || undefined });
      toast({ title: "Project created", description: `“${name.trim()}” is ready to go.`, variant: "success" });
      setDialogOpen(false);
      setName("");
      setDescription("");
      onProjectCreated?.();
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section>
      <h2 className="mb-4 text-[15px] font-semibold tracking-tight text-foreground">Quick actions</h2>

      <div className="grid gap-3">
        {actions.map((action) => (
          <button
            key={action.label}
            type="button"
            onClick={() => router.push(action.href)}
            className="liqui-primary liqui-lift group flex items-center gap-3.5 rounded-g2 p-4 text-left"
          >
            <span className="liqui-minimal flex size-9 shrink-0 items-center justify-center rounded-g1 transition-colors duration-300 group-hover:bg-brand-600/10">
              <action.icon className="size-4.5 text-muted transition-colors duration-300 group-hover:text-brand-600" strokeWidth={1.75} />
            </span>
            <span className="flex-1">
              <span className="block text-[13.5px] font-medium text-foreground">{action.label}</span>
              <span className="block text-[12px] text-muted">{action.hint}</span>
            </span>
            <ArrowUpRight className="size-4 text-muted opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </button>
        ))}

        <button
          type="button"
          onClick={() => setDialogOpen(true)}
          className="liqui-minimal group flex items-center gap-3.5 rounded-g2 p-4 text-left transition-all duration-200 ease-(--ease-liquid) hover:bg-surface-hover"
        >
          <span className="flex size-9 shrink-0 items-center justify-center rounded-g1 bg-brand-600/10">
            <FolderPlus className="size-4.5 text-brand-600" strokeWidth={1.75} />
          </span>
          <span>
            <span className="block text-[13.5px] font-medium text-foreground">New Project</span>
            <span className="block text-[12px] text-muted">Organize your work into projects</span>
          </span>
        </button>
      </div>

      <Dialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title="Create project"
        description="Projects help you organize work inside your workspace."
      >
        <form onSubmit={handleCreateProject} className="space-y-4 px-6 pb-6">
          {error && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3.5 py-2.5 text-[13px] text-red-700 dark:text-red-400 animate-fade-in">
              {error}
            </div>
          )}
          <div className="space-y-1.5">
            <Label htmlFor="project-name">Name</Label>
            <Input
              id="project-name"
              placeholder="Marketing site revamp"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="project-desc">Description (optional)</Label>
            <Textarea
              id="project-desc"
              placeholder="What is this project about?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={saving} disabled={!name.trim()}>
              Create project
            </Button>
          </div>
        </form>
      </Dialog>
    </section>
  );
}
