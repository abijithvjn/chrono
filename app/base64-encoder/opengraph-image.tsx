import { ogImage, ogSize, ogContentType } from "@/lib/og";
export const size = ogSize;
export const contentType = ogContentType;
export const alt = "Base64 Encoder — DevToolsKit";
export default function Image() { return ogImage("base64-encoder"); }

export const dynamic = "force-static";
