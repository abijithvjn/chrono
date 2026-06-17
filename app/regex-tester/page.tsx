import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { WorkspaceLayout } from "@/components/app/WorkspaceLayout";
import { ToolSeo } from "@/components/app/ToolSeo";
import { ToolSkeleton } from "@/components/app/ToolSkeleton";
import { toolMetadata } from "@/lib/toolMeta";

const RegexTool = dynamic(() => import("@/features/regex/RegexTool").then((m) => m.RegexTool), { loading: () => <ToolSkeleton /> });

export const metadata: Metadata = toolMetadata("regex-tester");

export default function Page() {
  return (
    <WorkspaceLayout slug="regex-tester">
      <RegexTool />
      <ToolSeo slug="regex-tester" />
    </WorkspaceLayout>
  );
}
