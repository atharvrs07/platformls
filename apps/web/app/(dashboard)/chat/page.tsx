import type { Metadata } from "next";
import { ModulePlaceholder } from "@/features/modules/module-placeholder";

export const metadata: Metadata = { title: "AI Chat" };

export default function ChatPage() {
  return <ModulePlaceholder moduleId="chat" />;
}
