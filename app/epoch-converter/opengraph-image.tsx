import { ogImage, ogSize, ogContentType } from "@/lib/og";
export const size = ogSize;
export const contentType = ogContentType;
export const alt = "Epoch Converter — DevToolsKit";
export default function Image() { return ogImage("epoch-converter"); }

export const dynamic = "force-static";
