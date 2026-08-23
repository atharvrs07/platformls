import type { Metadata } from "next";
import { SecurityForm } from "@/features/settings/security-form";

export const metadata: Metadata = { title: "Security" };

export default function SecurityPage() {
  return <SecurityForm />;
}
