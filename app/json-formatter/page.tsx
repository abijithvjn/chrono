import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { WorkspaceLayout } from "@/components/app/WorkspaceLayout";
import { ToolSeo } from "@/components/app/ToolSeo";
import { ToolSkeleton } from "@/components/app/ToolSkeleton";
import { toolMetadata } from "@/lib/toolMeta";

const JsonTool = dynamic(() => import("@/features/json/JsonTool").then((m) => m.JsonTool), { loading: () => <ToolSkeleton /> });

export const metadata: Metadata = toolMetadata("json-formatter");

export default function Page() {
  return (
    <WorkspaceLayout slug="json-formatter">
      <JsonTool />
      <ToolSeo slug="json-formatter" />
    </WorkspaceLayout>
  );
}
