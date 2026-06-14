import type { Metadata } from "next";
import { Studio } from "@/components/Studio";
import { canonical } from "@/lib/site";

export const metadata: Metadata = {
  title: "Unix Timestamp Converter — Epoch Time to Date & Back",
  description:
    "Paste any Unix timestamp, ISO 8601 date, JWT, JSON, or log line and instantly see every representation — UTC, local, ISO, RFC, relative, and code in 14 languages. Free, fast, ad-free.",
  alternates: { canonical: canonical("/") },
};

export default function Home() {
  return <Studio />;
}
