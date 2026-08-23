import type { Metadata } from "next";
import { ModulePlaceholder } from "@/features/modules/module-placeholder";

export const metadata: Metadata = { title: "Flows" };

export default function FlowsPage() {
  return <ModulePlaceholder moduleId="flows" />;
}
