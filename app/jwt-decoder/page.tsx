import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { WorkspaceLayout } from "@/components/app/WorkspaceLayout";
import { ToolSeo } from "@/components/app/ToolSeo";
import { ToolSkeleton } from "@/components/app/ToolSkeleton";
import { toolMetadata } from "@/lib/toolMeta";

const JwtTool = dynamic(() => import("@/features/jwt/JwtTool").then((m) => m.JwtTool), { loading: () => <ToolSkeleton /> });

export const metadata: Metadata = toolMetadata("jwt-decoder");

export default function Page() {
  return (
    <WorkspaceLayout slug="jwt-decoder">
      <JwtTool />
      <ToolSeo slug="jwt-decoder" />
    </WorkspaceLayout>
  );
}
