import { Binary, Braces, Clock, GitCompare, Regex, Timer, type LucideIcon } from "lucide-react";

// ── Tool registry ────────────────────────────────────────────────────────────
// Single source of truth for the platform. The dashboard, sidebar, global search,
// sitemap, and per-tool SEO are all driven by this array. Adding a future tool =
// append one entry + create its /route page. Nothing else needs restructuring.

export interface Tool {
  slug: string;            // route segment, e.g. "json-formatter"
  name: string;
  category: string;
  short: string;           // one-line description (cards, sidebar tooltip)
  icon: LucideIcon;
  accent: string;          // per-tool accent (hex) for cards & workspace
  keywords: string[];      // powers global search
  metaTitle: string;
  metaDescription: string;
  faqs: { q: string; a: string }[];
  status?: "ready" | "soon";
}

export const CATEGORIES = ["Date & Time", "Encoding", "JSON", "Regex", "Utilities"] as const;

export const TOOLS: Tool[] = [
  {
    slug: "epoch-converter",
    name: "Epoch Converter",
    category: "Date & Time",
    short: "Convert Unix timestamps, ISO 8601, JWTs & more — instantly.",
    icon: Clock,
    accent: "#3B82F6",
    keywords: ["epoch", "unix", "timestamp", "date", "time", "iso", "utc", "convert", "milliseconds"],
    metaTitle: "Unix Timestamp Converter — Epoch Time to Date & Back",
    metaDescription:
      "Paste any Unix timestamp, ISO 8601 date, JWT, JSON, or log line and instantly see every representation — UTC, local, ISO, RFC, relative — with code in 14 languages.",
    faqs: [
      { q: "What is a Unix timestamp?", a: "A single integer counting seconds since 1 January 1970 00:00:00 UTC — the most portable, zone-independent way to store an instant." },
      { q: "Does the converter run on a server?", a: "No. Every conversion happens locally in your browser — nothing is uploaded." },
    ],
  },
  {
    slug: "base64",
    name: "Base64 Encoder / Decoder",
    category: "Encoding",
    short: "Encode and decode Base64 text and files, UTF-8 safe.",
    icon: Binary,
    accent: "#22C55E",
    keywords: ["base64", "encode", "decode", "encoder", "decoder", "btoa", "atob", "file"],
    metaTitle: "Base64 Encoder & Decoder — Text & Files, UTF-8 Safe",
    metaDescription:
      "Encode text to Base64 and decode Base64 to text, with auto-detect, file upload, download, and live byte counts. Free, fast, fully client-side.",
    faqs: [
      { q: "Is Base64 encryption?", a: "No. Base64 is an encoding, not encryption — it is fully reversible and provides no security. Use it for transport, not secrecy." },
      { q: "Does this handle Unicode and files?", a: "Yes. Encoding is UTF-8 safe, and you can upload any file to get its Base64 (e.g. data URLs for images)." },
    ],
  },
  {
    slug: "json-formatter",
    name: "JSON Formatter",
    category: "JSON",
    short: "Pretty-print, minify, validate & explore JSON.",
    icon: Braces,
    accent: "#8B5CF6",
    keywords: ["json", "format", "formatter", "pretty", "beautify", "minify", "validate", "validator", "lint"],
    metaTitle: "JSON Formatter, Validator & Minifier — Free Online",
    metaDescription:
      "Pretty-print, minify and validate JSON with exact error line numbers, syntax highlighting, copy, download and upload. Handles large files, runs in your browser.",
    faqs: [
      { q: "Where does my JSON go?", a: "Nowhere — it is parsed and formatted entirely in your browser. No data is sent to any server." },
      { q: "Why is my JSON invalid?", a: "Common causes are trailing commas, single quotes, or unquoted keys. The validator points to the exact line and column of the first error." },
    ],
  },
  {
    slug: "regex-tester",
    name: "Regex Tester",
    category: "Regex",
    short: "Test patterns live with match highlighting & groups.",
    icon: Regex,
    accent: "#EC4899",
    keywords: ["regex", "regexp", "regular expression", "match", "pattern", "test", "groups", "capture"],
    metaTitle: "Regex Tester — Live Regular Expression Matching",
    metaDescription:
      "Test JavaScript regular expressions against any text with live match highlighting, capture groups, match positions, all flags (gimsuy), and clear errors.",
    faqs: [
      { q: "Which regex flavour is this?", a: "JavaScript (ECMAScript) regular expressions, the same engine your browser and Node.js use." },
      { q: "What do the flags mean?", a: "g = global, i = case-insensitive, m = multiline, s = dotall, u = unicode, y = sticky. Toggle them to change matching behaviour." },
    ],
  },
  {
    slug: "diff-checker",
    name: "Diff Checker",
    category: "Utilities",
    short: "Compare two texts line by line, side-by-side or unified.",
    icon: GitCompare,
    accent: "#F59E0B",
    keywords: ["diff", "compare", "difference", "text", "merge", "changes", "side by side", "unified"],
    metaTitle: "Diff Checker — Compare Text Online (Side-by-Side)",
    metaDescription:
      "Compare two blocks of text and highlight additions, removals and changes line by line. Side-by-side or unified view, ignore whitespace and case. Free & private.",
    faqs: [
      { q: "Is my text uploaded anywhere?", a: "No. The comparison runs entirely in your browser; your text never leaves your device." },
      { q: "Can it ignore whitespace or case?", a: "Yes — toggle the options to ignore leading/trailing whitespace or case differences before comparing." },
    ],
  },
  {
    slug: "cron-parser",
    name: "Cron Parser",
    category: "Utilities",
    short: "Explain cron expressions & preview next runs.",
    icon: Timer,
    accent: "#06B6D4",
    keywords: ["cron", "crontab", "schedule", "expression", "parser", "next run", "job"],
    metaTitle: "Cron Expression Parser — Explain & Preview Runs",
    metaDescription:
      "Translate cron expressions into plain English, validate them, and preview the next execution times. Presets for every minute, hourly, daily, weekly and more.",
    faqs: [
      { q: "What cron format is supported?", a: "Standard 5-field cron: minute, hour, day-of-month, month, day-of-week — with ranges, lists, and step (*/n) syntax." },
      { q: "Which timezone are the next runs in?", a: "Next execution times are computed in UTC so they are unambiguous; adjust for your local offset as needed." },
    ],
  },
];

export const toolBySlug = (slug: string) => TOOLS.find((t) => t.slug === slug);

export function searchTools(q: string): Tool[] {
  const s = q.trim().toLowerCase();
  if (!s) return TOOLS;
  return TOOLS.filter(
    (t) =>
      t.name.toLowerCase().includes(s) ||
      t.category.toLowerCase().includes(s) ||
      t.keywords.some((k) => k.includes(s))
  );
}

export const toolsByCategory = () =>
  CATEGORIES.map((cat) => ({ category: cat, tools: TOOLS.filter((t) => t.category === cat) }));
