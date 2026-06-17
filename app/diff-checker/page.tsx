import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { WorkspaceLayout } from "@/components/app/WorkspaceLayout";
import { ToolSeo } from "@/components/app/ToolSeo";
import { ToolSkeleton } from "@/components/app/ToolSkeleton";
import { toolBySlug } from "@/tools/registry";
import { canonical } from "@/lib/site";

const DiffTool = dynamic(() => import("@/features/diff/DiffTool").then((m) => m.DiffTool), { loading: () => <ToolSkeleton /> });

const t = toolBySlug("diff-checker")!;
export const metadata: Metadata = {
  title: t.metaTitle, description: t.metaDescription,
  alternates: { canonical: canonical("/diff-checker") },
  openGraph: { title: t.metaTitle, description: t.metaDescription, url: canonical("/diff-checker"), type: "website" },
};

export default function Page() {
  return (
    <WorkspaceLayout slug="diff-checker">
      <DiffTool />
      <ToolSeo slug="diff-checker" />
    </WorkspaceLayout>
  );
}
