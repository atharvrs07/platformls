import type { Metadata } from "next";
import { AppearanceForm } from "@/features/settings/appearance-form";

export const metadata: Metadata = { title: "Appearance" };

export default function AppearancePage() {
  return <AppearanceForm />;
}
