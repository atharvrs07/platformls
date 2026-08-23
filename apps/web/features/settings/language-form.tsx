"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { userApi } from "@/services/api.endpoints";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "hi", label: "हिन्दी (Hindi)" },
  { value: "es", label: "Español (Spanish)" },
  { value: "fr", label: "Français (French)" },
  { value: "de", label: "Deutsch (German)" },
  { value: "pt", label: "Português (Portuguese)" },
  { value: "ja", label: "日本語 (Japanese)" },
  { value: "zh", label: "中文 (Chinese)" },
  { value: "ar", label: "العربية (Arabic)" },
];

export function LanguageForm() {
  const { bundle, refreshUser } = useAuth();
  const { toast } = useToast();
  const [language, setLanguage] = useState(bundle?.preferences?.language ?? "en");
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      await userApi.updatePreferences({ language });
      await refreshUser();
      toast({ title: "Language preference saved", variant: "success" });
    } catch {
      toast({ title: "Couldn't save preference", variant: "error" });
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Language</CardTitle>
        <CardDescription>Choose the language used across the platform.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="max-w-sm space-y-1.5">
          <Select
            aria-label="Interface language"
            options={LANGUAGES}
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={handleSave} loading={saving} disabled={language === (bundle?.preferences?.language ?? "en")}>
            Save preference
          </Button>
          <p className="text-[12px] text-muted">Additional languages are on the roadmap.</p>
        </div>
      </CardContent>
    </Card>
  );
}
