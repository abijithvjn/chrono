import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { WorkspaceLayout } from "@/components/app/WorkspaceLayout";
import { ToolSeo } from "@/components/app/ToolSeo";
import { ToolSkeleton } from "@/components/app/ToolSkeleton";
import { toolMetadata } from "@/lib/toolMeta";

const ColorTool = dynamic(() => import("@/features/color/ColorTool").then((m) => m.ColorTool), { loading: () => <ToolSkeleton /> });

export const metadata: Metadata = toolMetadata("color-converter");

export default function Page() {
  return (
    <WorkspaceLayout slug="color-converter">
      <ColorTool />
      <ToolSeo slug="color-converter" />
    </WorkspaceLayout>
  );
}
