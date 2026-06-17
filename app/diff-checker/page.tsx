import type { Metadata } from "next";
import { AppLayout } from "@/components/app/AppLayout";
import { ToolPage } from "@/components/app/ToolPage";
import { DiffTool } from "@/features/diff/DiffTool";
import { toolBySlug } from "@/tools/registry";
import { canonical } from "@/lib/site";

const t = toolBySlug("diff-checker")!;
export const metadata: Metadata = {
  title: t.metaTitle, description: t.metaDescription,
  alternates: { canonical: canonical("/diff-checker") },
  openGraph: { title: t.metaTitle, description: t.metaDescription, url: canonical("/diff-checker"), type: "website" },
};

export default function Page() {
  return <AppLayout><ToolPage slug="diff-checker"><DiffTool /></ToolPage></AppLayout>;
}
