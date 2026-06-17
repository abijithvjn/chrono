import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { WorkspaceLayout } from "@/components/app/WorkspaceLayout";
import { ToolSeo } from "@/components/app/ToolSeo";
import { ToolSkeleton } from "@/components/app/ToolSkeleton";
import { toolMetadata } from "@/lib/toolMeta";

const CaseTool = dynamic(() => import("@/features/case/CaseTool").then((m) => m.CaseTool), { loading: () => <ToolSkeleton /> });

export const metadata: Metadata = toolMetadata("case-converter");

export default function Page() {
  return (
    <WorkspaceLayout slug="case-converter">
      <CaseTool />
      <ToolSeo slug="case-converter" />
    </WorkspaceLayout>
  );
}
