import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { WorkspaceLayout } from "@/components/app/WorkspaceLayout";
import { ToolSeo } from "@/components/app/ToolSeo";
import { ToolSkeleton } from "@/components/app/ToolSkeleton";
import { toolMetadata } from "@/lib/toolMeta";

const UuidTool = dynamic(() => import("@/features/uuid/UuidTool").then((m) => m.UuidTool), { loading: () => <ToolSkeleton /> });

export const metadata: Metadata = toolMetadata("uuid-generator");

export default function Page() {
  return (
    <WorkspaceLayout slug="uuid-generator">
      <UuidTool />
      <ToolSeo slug="uuid-generator" />
    </WorkspaceLayout>
  );
}
