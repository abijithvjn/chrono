import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { WorkspaceLayout } from "@/components/app/WorkspaceLayout";
import { ToolSeo } from "@/components/app/ToolSeo";
import { ToolSkeleton } from "@/components/app/ToolSkeleton";
import { toolMetadata } from "@/lib/toolMeta";

const UrlTool = dynamic(() => import("@/features/url/UrlTool").then((m) => m.UrlTool), { loading: () => <ToolSkeleton /> });

export const metadata: Metadata = toolMetadata("url-encoder");

export default function Page() {
  return (
    <WorkspaceLayout slug="url-encoder">
      <UrlTool />
      <ToolSeo slug="url-encoder" />
    </WorkspaceLayout>
  );
}
