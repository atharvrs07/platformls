import type { Metadata } from "next";
import { LanguageForm } from "@/features/settings/language-form";

export const metadata: Metadata = { title: "Language" };

export default function LanguagePage() {
  return <LanguageForm />;
}
