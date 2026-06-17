import {
  Binary, Braces, Clock, GitCompare, Regex, Timer,
  KeyRound, Fingerprint, Hash, Link2, Palette, Calculator, Type,
  type LucideIcon,
} from "lucide-react";

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

export const CATEGORIES = ["Date & Time", "Encoding", "JSON", "Regex", "Text", "Generators", "Converters", "Utilities"] as const;

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
  {
    slug: "jwt-decoder",
    name: "JWT Decoder",
    category: "Encoding",
    short: "Decode & inspect JSON Web Tokens — header, payload & expiry.",
    icon: KeyRound,
    accent: "#14B8A6",
    keywords: ["jwt decoder", "decode jwt", "json web token", "jwt parser", "jwt debugger", "jwt expiry", "jwt online"],
    metaTitle: "JWT Decoder - Decode & Inspect JSON Web Tokens | DevToolsKit",
    metaDescription:
      "Free online JWT Decoder. Decode and inspect a JSON Web Token's header, payload and claims, with human-readable issued and expiry times. Tokens are decoded locally and never leave your browser.",
    faqs: [
      { q: "Does this verify the JWT signature?", a: "No. It decodes and displays the token for inspection; it does not verify the signature, which requires the secret or public key." },
      { q: "Is it safe to paste my token here?", a: "Yes — decoding happens entirely in your browser. The token is never sent anywhere. Still, avoid pasting production tokens into any online tool." },
      { q: "How do I read the expiry?", a: "The exp claim is a Unix timestamp; this tool shows it as a readable date and flags whether the token is expired." },
    ],
  },
  {
    slug: "uuid-generator",
    name: "UUID Generator",
    category: "Generators",
    short: "Generate cryptographically-random UUID v4 IDs in bulk.",
    icon: Fingerprint,
    accent: "#6366F1",
    keywords: ["uuid generator", "guid generator", "random uuid", "uuid v4", "generate uuid", "unique id generator"],
    metaTitle: "UUID Generator - Generate Random UUID v4 Online | DevToolsKit",
    metaDescription:
      "Free online UUID Generator. Create cryptographically-random UUID v4 (GUID) identifiers in bulk, with uppercase and hyphen-free options. Fast, private and fully client-side.",
    faqs: [
      { q: "What kind of UUIDs are these?", a: "Version 4 UUIDs, generated with the browser's cryptographically secure random number generator (crypto.randomUUID)." },
      { q: "Are they unique?", a: "UUID v4 has 122 random bits, so collisions are astronomically unlikely — safe as primary keys and identifiers." },
      { q: "Can I generate many at once?", a: "Yes — choose a count and generate up to 100 at a time, then copy them all." },
    ],
  },
  {
    slug: "hash-generator",
    name: "Hash Generator",
    category: "Generators",
    short: "Compute SHA-1, SHA-256, SHA-384 & SHA-512 hashes.",
    icon: Hash,
    accent: "#0EA5E9",
    keywords: ["hash generator", "sha256 generator", "sha1 hash", "sha512 hash", "checksum", "hash text online"],
    metaTitle: "Hash Generator - SHA-1, SHA-256 & SHA-512 Online | DevToolsKit",
    metaDescription:
      "Free online Hash Generator. Compute SHA-1, SHA-256, SHA-384 and SHA-512 hashes of any text using the Web Crypto API. Instant, private and fully client-side.",
    faqs: [
      { q: "Which algorithms are supported?", a: "SHA-1, SHA-256, SHA-384 and SHA-512 via the browser's native Web Crypto API." },
      { q: "Is MD5 supported?", a: "No. The Web Crypto API does not provide MD5 (it is cryptographically broken). Use SHA-256 or stronger for integrity and security." },
      { q: "Does my text get uploaded?", a: "No. Hashing runs entirely in your browser; the input never leaves your device." },
    ],
  },
  {
    slug: "url-encoder",
    name: "URL Encoder / Decoder",
    category: "Encoding",
    short: "Percent-encode and decode URLs and query parameters.",
    icon: Link2,
    accent: "#F97316",
    keywords: ["url encoder", "url decoder", "percent encoding", "encode url", "decode url", "uri encode online"],
    metaTitle: "URL Encoder & Decoder - Percent-Encode URLs Online | DevToolsKit",
    metaDescription:
      "Free online URL Encoder & Decoder. Percent-encode or decode URLs, query strings and components, with both full-URL and component modes. Instant and fully client-side.",
    faqs: [
      { q: "What is the difference between component and full URL?", a: "Component mode (encodeURIComponent) escapes everything including / and ? — use it for query values. Full-URL mode (encodeURI) preserves URL structure." },
      { q: "Why are spaces shown as %20?", a: "Percent-encoding replaces unsafe characters with %XX; a space becomes %20 (or + inside a query string in some contexts)." },
      { q: "Is anything uploaded?", a: "No. Encoding and decoding happen entirely in your browser." },
    ],
  },
  {
    slug: "color-converter",
    name: "Color Converter",
    category: "Converters",
    short: "Pick a color and convert between HEX, RGB and HSL.",
    icon: Palette,
    accent: "#D946EF",
    keywords: ["color picker", "color converter", "html color picker", "hex to rgb", "rgb to hex", "hsl converter", "hex to hsl", "eyedropper"],
    metaTitle: "Color Picker & Converter - HEX, RGB & HSL Online | DevToolsKit",
    metaDescription:
      "Free online Color Picker and Converter. Pick a color visually (or grab one from your screen with the eyedropper) and convert between HEX, RGB and HSL with a live preview. Instant, private and browser-based.",
    faqs: [
      { q: "Is there a color picker?", a: "Yes — click the swatch to open a visual color picker, and on supported browsers use the eyedropper to grab any color from your screen." },
      { q: "Which formats are supported?", a: "HEX (#rrggbb), RGB (rgb(r,g,b)) and HSL (hsl(h,s%,l%)). Pick or paste any of them and the others update instantly." },
      { q: "Does it support alpha?", a: "This converter focuses on opaque colors; for alpha you can append it to the HEX (#rrggbbaa) in most browsers." },
    ],
  },
  {
    slug: "number-base-converter",
    name: "Number Base Converter",
    category: "Converters",
    short: "Convert integers between binary, octal, decimal & hex.",
    icon: Calculator,
    accent: "#84CC16",
    keywords: ["number base converter", "binary to decimal", "hex to decimal", "decimal to binary", "base converter", "radix converter"],
    metaTitle: "Number Base Converter - Binary, Hex, Decimal & Octal | DevToolsKit",
    metaDescription:
      "Free online Number Base Converter. Convert integers between binary, octal, decimal and hexadecimal with big-integer precision. Instant and fully client-side.",
    faqs: [
      { q: "How large a number can it handle?", a: "It uses BigInt, so it handles arbitrarily large integers without losing precision." },
      { q: "Which bases are supported?", a: "Binary (2), octal (8), decimal (10) and hexadecimal (16). Enter a value in any base and read the rest." },
      { q: "Are negative numbers supported?", a: "Yes — a leading minus sign is preserved across all bases." },
    ],
  },
  {
    slug: "case-converter",
    name: "Case Converter",
    category: "Text",
    short: "Convert text to camelCase, snake_case, kebab-case & slugs.",
    icon: Type,
    accent: "#EAB308",
    keywords: ["case converter", "camelcase converter", "snake case", "kebab case", "slug generator", "text case converter"],
    metaTitle: "Case Converter - camelCase, snake_case, kebab-case & Slug | DevToolsKit",
    metaDescription:
      "Free online Case Converter. Convert text between camelCase, PascalCase, snake_case, kebab-case, CONSTANT_CASE, Title Case, sentence case and URL slugs instantly. Private and browser-based.",
    faqs: [
      { q: "Which cases are supported?", a: "camelCase, PascalCase, snake_case, kebab-case, CONSTANT_CASE, Title Case, Sentence case, UPPERCASE, lowercase and URL slug." },
      { q: "How does it split words?", a: "It detects word boundaries from spaces, hyphens, underscores and camelCase humps, then re-joins them in the target style." },
      { q: "Is it good for slugs?", a: "Yes — the slug output lowercases, strips punctuation and joins words with hyphens, ideal for URLs and filenames." },
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
