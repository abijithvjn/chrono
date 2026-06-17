import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { WorkspaceLayout } from "@/components/app/WorkspaceLayout";
import { ToolSeo } from "@/components/app/ToolSeo";
import { ToolSkeleton } from "@/components/app/ToolSkeleton";
import { toolMetadata } from "@/lib/toolMeta";

const EpochTool = dynamic(() => import("@/features/epoch/EpochTool").then((m) => m.EpochTool), { loading: () => <ToolSkeleton /> });

export const metadata: Metadata = toolMetadata("epoch-converter");

export default function Page() {
  return (
    <WorkspaceLayout slug="epoch-converter">
      <EpochTool />
      <ToolSeo slug="epoch-converter" />
    </WorkspaceLayout>
  );
}
