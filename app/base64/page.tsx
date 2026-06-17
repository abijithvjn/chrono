import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { WorkspaceLayout } from "@/components/app/WorkspaceLayout";
import { ToolSeo } from "@/components/app/ToolSeo";
import { ToolSkeleton } from "@/components/app/ToolSkeleton";
import { toolBySlug } from "@/tools/registry";
import { canonical } from "@/lib/site";

const Base64Tool = dynamic(() => import("@/features/base64/Base64Tool").then((m) => m.Base64Tool), { loading: () => <ToolSkeleton /> });

const t = toolBySlug("base64")!;
export const metadata: Metadata = {
  title: t.metaTitle, description: t.metaDescription,
  alternates: { canonical: canonical("/base64") },
  openGraph: { title: t.metaTitle, description: t.metaDescription, url: canonical("/base64"), type: "website" },
};

export default function Page() {
  return (
    <WorkspaceLayout slug="base64">
      <Base64Tool />
      <ToolSeo slug="base64" />
    </WorkspaceLayout>
  );
}
