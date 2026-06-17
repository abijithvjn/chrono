import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { WorkspaceLayout } from "@/components/app/WorkspaceLayout";
import { ToolSeo } from "@/components/app/ToolSeo";
import { ToolSkeleton } from "@/components/app/ToolSkeleton";
import { toolBySlug } from "@/tools/registry";
import { canonical } from "@/lib/site";

const CronTool = dynamic(() => import("@/features/cron/CronTool").then((m) => m.CronTool), { loading: () => <ToolSkeleton /> });

const t = toolBySlug("cron-parser")!;
export const metadata: Metadata = {
  title: t.metaTitle, description: t.metaDescription,
  alternates: { canonical: canonical("/cron-parser") },
  openGraph: { title: t.metaTitle, description: t.metaDescription, url: canonical("/cron-parser"), type: "website" },
};

export default function Page() {
  return (
    <WorkspaceLayout slug="cron-parser">
      <CronTool />
      <ToolSeo slug="cron-parser" />
    </WorkspaceLayout>
  );
}
