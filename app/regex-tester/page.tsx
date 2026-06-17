import type { Metadata } from "next";
import { AppLayout } from "@/components/app/AppLayout";
import { ToolPage } from "@/components/app/ToolPage";
import { RegexTool } from "@/features/regex/RegexTool";
import { toolBySlug } from "@/tools/registry";
import { canonical } from "@/lib/site";

const t = toolBySlug("regex-tester")!;
export const metadata: Metadata = {
  title: t.metaTitle, description: t.metaDescription,
  alternates: { canonical: canonical("/regex-tester") },
  openGraph: { title: t.metaTitle, description: t.metaDescription, url: canonical("/regex-tester"), type: "website" },
};

export default function Page() {
  return <AppLayout><ToolPage slug="regex-tester"><RegexTool /></ToolPage></AppLayout>;
}
