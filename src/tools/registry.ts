import { Binary, Braces, Clock, GitCompare, Regex, Timer, type LucideIcon } from "lucide-react";

// ── Tool registry — the single source of truth ───────────────────────────────
// Drives routing metadata, sitemap, robots, structured data, navigation, search,
// internal linking and OG images. Add a tool here (+ its long-form copy in
// seoContent.ts and a thin route file) and everything else updates automatically.

export interface Tool {
  slug: string;            // clean URL segment, e.g. "json-formatter"
  name: string;
  category: string;
  short: string;           // one-line description (cards, sidebar)
  icon: LucideIcon;
  accent: string;          // per-tool accent (hex)
  keywords: string[];      // search + meta keywords
  metaTitle: string;       // full <title> (already includes "| DevToolsKit")
  metaDescription: string;
  faqs: { q: string; a: string }[];
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
    keywords: ["epoch converter", "unix timestamp converter", "unix time", "timestamp to date", "date to timestamp", "milliseconds to date", "iso 8601 converter"],
    metaTitle: "Epoch Converter - Unix Timestamp Converter | DevToolsKit",
    metaDescription:
      "Free online Epoch Converter. Convert Unix timestamps to human-readable dates and back, with UTC, local time, ISO 8601, relative time and timezone support. Private and instant.",
    faqs: [
      { q: "What is a Unix timestamp?", a: "A single integer counting seconds since 1 January 1970 00:00:00 UTC — the most portable, zone-independent way to store an instant." },
      { q: "Does the converter run on a server?", a: "No. Every conversion happens locally in your browser — nothing is uploaded." },
      { q: "How do I tell seconds from milliseconds?", a: "Seconds are ~10 digits, milliseconds ~13, microseconds ~16, nanoseconds ~19. The converter auto-detects the unit, and you can override it." },
    ],
  },
  {
    slug: "json-formatter",
    name: "JSON Formatter",
    category: "JSON",
    short: "Pretty-print, minify, validate & explore JSON.",
    icon: Braces,
    accent: "#8B5CF6",
    keywords: ["json formatter", "json validator", "json beautifier", "json pretty print", "json formatter online", "json minifier", "format json"],
    metaTitle: "JSON Formatter - Format, Validate & Minify JSON Online | DevToolsKit",
    metaDescription:
      "Free online JSON Formatter. Instantly format, validate, minify and explore JSON locally in your browser, with exact error line numbers and syntax highlighting. No uploads, fast and private.",
    faqs: [
      { q: "Where does my JSON go?", a: "Nowhere — it is parsed and formatted entirely in your browser. No data is sent to any server." },
      { q: "Why is my JSON invalid?", a: "Common causes are trailing commas, single quotes, or unquoted keys. The validator points to the exact line and column of the first error." },
      { q: "Can it handle large JSON files?", a: "Yes. Formatting and validation are efficient; syntax highlighting is skipped above ~200 KB to keep it instant." },
    ],
  },
  {
    slug: "regex-tester",
    name: "Regex Tester",
    category: "Regex",
    short: "Test patterns live with match highlighting & groups.",
    icon: Regex,
    accent: "#EC4899",
    keywords: ["regex tester", "regex tester online", "test regular expressions", "regex match", "regex groups", "javascript regex tester", "regexp"],
    metaTitle: "Regex Tester - Test Regular Expressions Online | DevToolsKit",
    metaDescription:
      "Free online Regex Tester. Test JavaScript regular expressions with live match highlighting, capture groups, match positions and every flag (gimsuy). Private and instant.",
    faqs: [
      { q: "Which regex flavour is this?", a: "JavaScript (ECMAScript) regular expressions, the same engine your browser and Node.js use." },
      { q: "What do the flags mean?", a: "g = global, i = case-insensitive, m = multiline, s = dotall, u = unicode, y = sticky. Toggle them to change matching behaviour." },
      { q: "Are capture groups supported?", a: "Yes — each match lists its numbered capture groups and positions, including named groups." },
    ],
  },
  {
    slug: "base64-encoder",
    name: "Base64 Encoder",
    category: "Encoding",
    short: "Encode and decode Base64 text and files, UTF-8 safe.",
    icon: Binary,
    accent: "#22C55E",
    keywords: ["base64 encoder", "base64 decoder", "base64 encode", "base64 decode", "base64 online", "encode base64", "decode base64"],
    metaTitle: "Base64 Encoder - Encode & Decode Base64 Online | DevToolsKit",
    metaDescription:
      "Free online Base64 Encoder & Decoder. Encode text to Base64 and decode it back, with auto-detect, file upload, data URLs and live byte counts. UTF-8 safe and fully client-side.",
    faqs: [
      { q: "Is Base64 encryption?", a: "No. Base64 is an encoding, not encryption — it is fully reversible and provides no security. Use it for transport, not secrecy." },
      { q: "Does this handle Unicode and files?", a: "Yes. Encoding is UTF-8 safe, and you can upload any file to get its Base64 (e.g. data URLs for images)." },
      { q: "Is my data uploaded?", a: "No. Encoding and decoding run entirely in your browser; nothing leaves your device." },
    ],
  },
  {
    slug: "diff-checker",
    name: "Diff Checker",
    category: "Utilities",
    short: "Compare two texts line by line, side-by-side or unified.",
    icon: GitCompare,
    accent: "#F59E0B",
    keywords: ["diff checker", "compare text", "text diff", "diff online", "compare two files", "side by side diff", "unified diff"],
    metaTitle: "Diff Checker - Compare Text & Find Differences | DevToolsKit",
    metaDescription:
      "Free online Diff Checker. Compare two blocks of text and highlight additions, removals and changes line by line, side-by-side or unified, with ignore-whitespace and ignore-case options.",
    faqs: [
      { q: "Is my text uploaded anywhere?", a: "No. The comparison runs entirely in your browser; your text never leaves your device." },
      { q: "Can it ignore whitespace or case?", a: "Yes — toggle the options to ignore leading/trailing whitespace or case differences before comparing." },
      { q: "What diff algorithm is used?", a: "A longest-common-subsequence (LCS) line diff, the same approach used by tools like git for clear, minimal changes." },
    ],
  },
  {
    slug: "cron-parser",
    name: "Cron Parser",
    category: "Utilities",
    short: "Explain cron expressions & preview next runs.",
    icon: Timer,
    accent: "#06B6D4",
    keywords: ["cron parser", "cron expression", "crontab guru", "explain cron", "cron schedule", "cron next run", "cron expression generator"],
    metaTitle: "Cron Parser - Explain Cron Expressions Online | DevToolsKit",
    metaDescription:
      "Free online Cron Parser. Translate cron expressions into plain English, validate them, and preview the next execution times, with presets for every minute, hourly, daily, weekly and more.",
    faqs: [
      { q: "What cron format is supported?", a: "Standard 5-field cron: minute, hour, day-of-month, month, day-of-week — with ranges, lists, and step (*/n) syntax." },
      { q: "Which timezone are the next runs in?", a: "Next execution times are shown in both UTC and your local timezone so there is no ambiguity." },
      { q: "Can I use presets?", a: "Yes — one click fills common schedules like every 5 minutes, hourly, daily at 09:00, weekdays, and monthly." },
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
