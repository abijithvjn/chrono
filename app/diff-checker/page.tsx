import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { WorkspaceLayout } from "@/components/app/WorkspaceLayout";
import { ToolSeo } from "@/components/app/ToolSeo";
import { ToolSkeleton } from "@/components/app/ToolSkeleton";
import { toolMetadata } from "@/lib/toolMeta";

const DiffTool = dynamic(() => import("@/features/diff/DiffTool").then((m) => m.DiffTool), { loading: () => <ToolSkeleton /> });

export const metadata: Metadata = toolMetadata("diff-checker");

export default function Page() {
  return (
    <WorkspaceLayout slug="diff-checker">
      <DiffTool />
      <ToolSeo slug="diff-checker" />
    </WorkspaceLayout>
  );
}
