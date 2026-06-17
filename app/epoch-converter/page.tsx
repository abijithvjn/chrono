import type { Metadata } from "next";
import { AppLayout } from "@/components/app/AppLayout";
import { ToolPage } from "@/components/app/ToolPage";
import { EpochTool } from "@/features/epoch/EpochTool";
import { toolBySlug } from "@/tools/registry";
import { canonical } from "@/lib/site";

const t = toolBySlug("epoch-converter")!;
export const metadata: Metadata = {
  title: t.metaTitle, description: t.metaDescription,
  alternates: { canonical: canonical("/epoch-converter") },
  openGraph: { title: t.metaTitle, description: t.metaDescription, url: canonical("/epoch-converter"), type: "website" },
};

export default function Page() {
  return <AppLayout><ToolPage slug="epoch-converter"><EpochTool /></ToolPage></AppLayout>;
}
