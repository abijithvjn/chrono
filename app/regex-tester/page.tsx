import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { WorkspaceLayout } from "@/components/app/WorkspaceLayout";
import { ToolSeo } from "@/components/app/ToolSeo";
import { ToolSkeleton } from "@/components/app/ToolSkeleton";
import { toolBySlug } from "@/tools/registry";
import { canonical } from "@/lib/site";

const RegexTool = dynamic(() => import("@/features/regex/RegexTool").then((m) => m.RegexTool), { loading: () => <ToolSkeleton /> });

const t = toolBySlug("regex-tester")!;
export const metadata: Metadata = {
  title: t.metaTitle, description: t.metaDescription,
  alternates: { canonical: canonical("/regex-tester") },
  openGraph: { title: t.metaTitle, description: t.metaDescription, url: canonical("/regex-tester"), type: "website" },
};

export default function Page() {
  return (
    <WorkspaceLayout slug="regex-tester">
      <RegexTool />
      <ToolSeo slug="regex-tester" />
    </WorkspaceLayout>
  );
}
