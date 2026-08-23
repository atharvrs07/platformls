import type { Metadata } from "next";
import { NotificationsForm } from "@/features/settings/notifications-form";

export const metadata: Metadata = { title: "Notifications" };

export default function NotificationsPage() {
  return <NotificationsForm />;
}
