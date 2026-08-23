import type { Metadata } from "next";
import { ModulePlaceholder } from "@/features/modules/module-placeholder";

export const metadata: Metadata = { title: "Agents" };

export default function Page() {
  return <ModulePlaceholder moduleId="agents" />;
}

