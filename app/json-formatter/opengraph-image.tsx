import { ogImage, ogSize, ogContentType } from "@/lib/og";
export const size = ogSize;
export const contentType = ogContentType;
export const alt = "JSON Formatter — DevToolsKit";
export default function Image() { return ogImage("json-formatter"); }

export const dynamic = "force-static";
