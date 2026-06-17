import { ogImage, ogSize, ogContentType } from "@/lib/og";
export const size = ogSize;
export const contentType = ogContentType;
export const alt = "URL Encoder / Decoder — DevToolsKit";
export const dynamic = "force-static";
export default function Image() { return ogImage("url-encoder"); }
