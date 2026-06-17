import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { WorkspaceLayout } from "@/components/app/WorkspaceLayout";
import { ToolSeo } from "@/components/app/ToolSeo";
import { ToolSkeleton } from "@/components/app/ToolSkeleton";
import { toolMetadata } from "@/lib/toolMeta";

const BaseTool = dynamic(() => import("@/features/base/BaseTool").then((m) => m.BaseTool), { loading: () => <ToolSkeleton /> });

export const metadata: Metadata = toolMetadata("number-base-converter");

export default function Page() {
  return (
    <WorkspaceLayout slug="number-base-converter">
      <BaseTool />
      <ToolSeo slug="number-base-converter" />
    </WorkspaceLayout>
  );
}
