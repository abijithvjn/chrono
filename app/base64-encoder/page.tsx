import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { WorkspaceLayout } from "@/components/app/WorkspaceLayout";
import { ToolSeo } from "@/components/app/ToolSeo";
import { ToolSkeleton } from "@/components/app/ToolSkeleton";
import { toolMetadata } from "@/lib/toolMeta";

const Base64Tool = dynamic(() => import("@/features/base64/Base64Tool").then((m) => m.Base64Tool), { loading: () => <ToolSkeleton /> });

export const metadata: Metadata = toolMetadata("base64-encoder");

export default function Page() {
  return (
    <WorkspaceLayout slug="base64-encoder">
      <Base64Tool />
      <ToolSeo slug="base64-encoder" />
    </WorkspaceLayout>
  );
}
