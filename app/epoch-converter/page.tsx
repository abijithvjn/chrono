import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { WorkspaceLayout } from "@/components/app/WorkspaceLayout";
import { ToolSeo } from "@/components/app/ToolSeo";
import { ToolSkeleton } from "@/components/app/ToolSkeleton";
import { toolBySlug } from "@/tools/registry";
import { canonical } from "@/lib/site";

const EpochTool = dynamic(() => import("@/features/epoch/EpochTool").then((m) => m.EpochTool), { loading: () => <ToolSkeleton /> });

const t = toolBySlug("epoch-converter")!;
export const metadata: Metadata = {
  title: t.metaTitle, description: t.metaDescription,
  alternates: { canonical: canonical("/epoch-converter") },
  openGraph: { title: t.metaTitle, description: t.metaDescription, url: canonical("/epoch-converter"), type: "website" },
};

export default function Page() {
  return (
    <WorkspaceLayout slug="epoch-converter">
      <EpochTool />
      <ToolSeo slug="epoch-converter" />
    </WorkspaceLayout>
  );
}
