import type { Metadata } from "next";
import { AppLayout } from "@/components/app/AppLayout";
import { ToolPage } from "@/components/app/ToolPage";
import { CronTool } from "@/features/cron/CronTool";
import { toolBySlug } from "@/tools/registry";
import { canonical } from "@/lib/site";

const t = toolBySlug("cron-parser")!;
export const metadata: Metadata = {
  title: t.metaTitle, description: t.metaDescription,
  alternates: { canonical: canonical("/cron-parser") },
  openGraph: { title: t.metaTitle, description: t.metaDescription, url: canonical("/cron-parser"), type: "website" },
};

export default function Page() {
  return <AppLayout><ToolPage slug="cron-parser"><CronTool /></ToolPage></AppLayout>;
}
