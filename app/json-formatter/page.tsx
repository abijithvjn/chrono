import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { WorkspaceLayout } from "@/components/app/WorkspaceLayout";
import { ToolSeo } from "@/components/app/ToolSeo";
import { ToolSkeleton } from "@/components/app/ToolSkeleton";
import { toolBySlug } from "@/tools/registry";
import { canonical } from "@/lib/site";

const JsonTool = dynamic(() => import("@/features/json/JsonTool").then((m) => m.JsonTool), { loading: () => <ToolSkeleton /> });

const t = toolBySlug("json-formatter")!;
export const metadata: Metadata = {
  title: t.metaTitle, description: t.metaDescription,
  alternates: { canonical: canonical("/json-formatter") },
  openGraph: { title: t.metaTitle, description: t.metaDescription, url: canonical("/json-formatter"), type: "website" },
};

export default function Page() {
  return (
    <WorkspaceLayout slug="json-formatter">
      <JsonTool />
      <ToolSeo slug="json-formatter" />
    </WorkspaceLayout>
  );
}
