import { ogImage, ogSize, ogContentType } from "@/lib/og";
export const size = ogSize;
export const contentType = ogContentType;
export const alt = "Diff Checker — DevToolsKit";
export default function Image() { return ogImage("diff-checker"); }

export const dynamic = "force-static";
