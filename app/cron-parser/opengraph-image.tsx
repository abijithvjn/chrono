import { ogImage, ogSize, ogContentType } from "@/lib/og";
export const size = ogSize;
export const contentType = ogContentType;
export const alt = "Cron Parser — DevToolsKit";
export default function Image() { return ogImage("cron-parser"); }

export const dynamic = "force-static";
