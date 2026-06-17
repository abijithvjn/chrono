import { ogImage, ogSize, ogContentType } from "@/lib/og";
export const size = ogSize;
export const contentType = ogContentType;
export const alt = "Regex Tester — DevToolsKit";
export default function Image() { return ogImage("regex-tester"); }

export const dynamic = "force-static";
