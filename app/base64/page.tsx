import type { Metadata } from "next";
import { AppLayout } from "@/components/app/AppLayout";
import { ToolPage } from "@/components/app/ToolPage";
import { Base64Tool } from "@/features/base64/Base64Tool";
import { toolBySlug } from "@/tools/registry";
import { canonical } from "@/lib/site";

const t = toolBySlug("base64")!;
export const metadata: Metadata = {
  title: t.metaTitle, description: t.metaDescription,
  alternates: { canonical: canonical("/base64") },
  openGraph: { title: t.metaTitle, description: t.metaDescription, url: canonical("/base64"), type: "website" },
};

export default function Page() {
  return <AppLayout><ToolPage slug="base64"><Base64Tool /></ToolPage></AppLayout>;
}
