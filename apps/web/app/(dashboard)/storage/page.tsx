import type { Metadata } from "next";
import { ModulePlaceholder } from "@/features/modules/module-placeholder";

export const metadata: Metadata = { title: "Storage" };

export default function Page() {
  return <ModulePlaceholder moduleId="storage" />;
}

