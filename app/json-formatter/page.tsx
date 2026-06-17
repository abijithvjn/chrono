import type { Metadata } from "next";
import { AppLayout } from "@/components/app/AppLayout";
import { ToolPage } from "@/components/app/ToolPage";
import { JsonTool } from "@/features/json/JsonTool";
import { toolBySlug } from "@/tools/registry";
import { canonical } from "@/lib/site";

const t = toolBySlug("json-formatter")!;
export const metadata: Metadata = {
  title: t.metaTitle, description: t.metaDescription,
  alternates: { canonical: canonical("/json-formatter") },
  openGraph: { title: t.metaTitle, description: t.metaDescription, url: canonical("/json-formatter"), type: "website" },
};

export default function Page() {
  return <AppLayout><ToolPage slug="json-formatter"><JsonTool /></ToolPage></AppLayout>;
}
