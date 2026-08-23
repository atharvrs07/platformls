import type { Metadata } from "next";
import { BillingView } from "@/features/settings/billing-view";

export const metadata: Metadata = { title: "Billing" };

export default function BillingPage() {
  return <BillingView />;
}
