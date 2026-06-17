import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { WorkspaceLayout } from "@/components/app/WorkspaceLayout";
import { ToolSeo } from "@/components/app/ToolSeo";
import { ToolSkeleton } from "@/components/app/ToolSkeleton";
import { toolMetadata } from "@/lib/toolMeta";

const CronTool = dynamic(() => import("@/features/cron/CronTool").then((m) => m.CronTool), { loading: () => <ToolSkeleton /> });

export const metadata: Metadata = toolMetadata("cron-parser");

export default function Page() {
  return (
    <WorkspaceLayout slug="cron-parser">
      <CronTool />
      <ToolSeo slug="cron-parser" />
    </WorkspaceLayout>
  );
}
