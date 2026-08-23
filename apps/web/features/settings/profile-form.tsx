"use client";

import { useState, type FormEvent } from "react";
import { Camera } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { userApi } from "@/services/api.endpoints";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { FormField } from "@/components/ui/form-field";
import { Avatar } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ApiClientError } from "@/types/api";

const TIMEZONES = [
  { value: "UTC", label: "UTC" },
  { value: "America/New_York", label: "New York (EST)" },
  { value: "America/Chicago", label: "Chicago (CST)" },
  { value: "America/Los_Angeles", label: "Los Angeles (PST)" },
  { value: "America/Toronto", label: "Toronto (EST)" },
  { value: "Europe/London", label: "London (GMT)" },
  { value: "Europe/Paris", label: "Paris (CET)" },
  { value: "Europe/Berlin", label: "Berlin (CET)" },
  { value: "Asia/Dubai", label: "Dubai (GST)" },
  { value: "Asia/Kolkata", label: "Mumbai (IST)" },
  { value: "Asia/Singapore", label: "Singapore (SGT)" },
  { value: "Asia/Tokyo", label: "Tokyo (JST)" },
  { value: "Australia/Sydney", label: "Sydney (AEDT)" },
];

export function ProfileForm() {
  const { bundle, refreshUser } = useAuth();
  const { toast } = useToast();
  const user = bundle?.user;
  const profile = bundle?.profile;

  const [form, setForm] = useState({
    fullName: user?.fullName ?? "",
    bio: profile?.bio ?? "",
    location: profile?.location ?? "",
    company: profile?.company ?? "",
    title: profile?.title ?? "",
    website: profile?.website ?? "",
    timezone: user?.timezone ?? "UTC",
  });
  const [saving, setSaving] = useState(false);

  if (!user) return null;

  function update(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await userApi.updateProfile({
        fullName: form.fullName,
        bio: form.bio || null,
        location: form.location || null,
        company: form.company || null,
        title: form.title || null,
        website: form.website || null,
        timezone: form.timezone,
      });
      await refreshUser();
      toast({ title: "Profile updated", variant: "success" });
    } catch (error) {
      toast({
        title: "Couldn't update profile",
        description: error instanceof ApiClientError ? error.message : "Please try again.",
        variant: "error",
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>This information is visible across your workspace.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex items-center gap-4">
            <Avatar name={form.fullName || user.fullName} src={user.avatarUrl} size="xl" />
            <div>
              <Button type="button" variant="secondary" size="sm" onClick={() => toast({ title: "Avatar uploads are coming in a future phase", variant: "info" })}>
                <Camera className="size-3.5" />
                Upload new photo
              </Button>
              <p className="mt-1.5 text-[12px] text-muted">JPG or PNG. Max 2 MB.</p>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <FormField label="Full name" htmlFor="fullName">
              <Input id="fullName" value={form.fullName} onChange={update("fullName")} />
            </FormField>

            <FormField label="Username" hint="Not editable yet">
              <Input value={user.username} disabled readOnly />
            </FormField>

            <FormField label="Email" htmlFor="email" hint="Change in Security">
              <Input id="email" value={user.email} disabled readOnly />
            </FormField>

            <FormField label="Timezone" htmlFor="timezone">
              <Select id="timezone" options={TIMEZONES} value={form.timezone} onChange={update("timezone")} />
            </FormField>
          </div>

          <FormField label="Job title">
            <Input placeholder="e.g. Founder" value={form.title} onChange={update("title")} />
          </FormField>

          <FormField label="Company">
            <Input placeholder="e.g. Acme Inc." value={form.company} onChange={update("company")} />
          </FormField>

          <FormField label="Location">
            <Input placeholder="e.g. Bengaluru, India" value={form.location} onChange={update("location")} />
          </FormField>

          <FormField label="Website">
            <Input type="url" placeholder="https://your-site.com" value={form.website} onChange={update("website")} />
          </FormField>

          <div className="space-y-1.5">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              placeholder="Tell your team a little about yourself…"
              value={form.bio}
              onChange={update("bio")}
              maxLength={500}
            />
            <p className="text-right text-[12px] text-muted">{form.bio.length}/500</p>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" size="lg" loading={saving}>
          Save changes
        </Button>
      </div>
    </form>
  );
}
