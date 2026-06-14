// Programmatic conversion landing pages. Each entry yields a unique page with
// its own explanation, worked example, interactive tool, FAQ, and internal links.

export interface Faq { q: string; a: string; }

export interface Conversion {
  slug: string;
  h1: string;
  metaTitle: string;
  metaDescription: string;
  example: string;        // the input we demonstrate (parsed at build)
  targetKey: string;      // representation key to highlight (see format.ts)
  intro: string[];        // unique paragraphs
  faqs: Faq[];
  related: string[];      // other conversion slugs
}

export const CONVERSIONS: Conversion[] = [
  {
    slug: "unix-timestamp-to-date",
    h1: "Convert Unix Timestamp to Date",
    metaTitle: "Unix Timestamp to Date Converter (UTC & Local) — Free",
    metaDescription:
      "Convert a Unix timestamp (seconds) to a human-readable date in UTC and your local time zone. Instant, accurate, with code examples.",
    example: "1700000000",
    targetKey: "utc",
    intro: [
      "A Unix timestamp is the number of seconds elapsed since the Unix epoch — 00:00:00 UTC on 1 January 1970. To turn that integer into a readable calendar date you add those seconds to the epoch and render the result in a chosen time zone.",
      "The converter below detects the unit automatically (10-digit values are treated as seconds) and shows the date in UTC, your local zone, ISO 8601, and more. Everything updates the moment you paste — no button to press.",
    ],
    faqs: [
      { q: "What is a Unix timestamp?", a: "It is a single integer counting the seconds since 1 January 1970 00:00:00 UTC, independent of time zone. It is the most portable way to store an instant in time." },
      { q: "How do I know if my number is in seconds or milliseconds?", a: "Seconds are typically 10 digits (until the year 2286), milliseconds 13 digits, microseconds 16, and nanoseconds 19. The tool auto-detects by length but you can override the unit." },
      { q: "Does the converted date depend on my time zone?", a: "The underlying instant is absolute, but its calendar representation differs by zone. We show both UTC and your local time so there is no ambiguity." },
    ],
    related: ["date-to-unix-timestamp", "milliseconds-to-date", "unix-timestamp-to-iso-8601"],
  },
  {
    slug: "date-to-unix-timestamp",
    h1: "Convert Date to Unix Timestamp",
    metaTitle: "Date to Unix Timestamp Converter — Free & Instant",
    metaDescription:
      "Convert any date or ISO 8601 string to a Unix timestamp in seconds and milliseconds. Supports natural language like 'next friday 5pm'.",
    example: "2023-11-14T22:13:20Z",
    targetKey: "s",
    intro: [
      "Going from a calendar date to a Unix timestamp means measuring how many seconds separate that moment from the Unix epoch. Because the epoch is defined in UTC, the result is the same everywhere on Earth for a given instant.",
      "Paste an ISO 8601 string, a plain date, or even natural language such as “next friday 5pm” — the parser resolves it and returns the timestamp in seconds and milliseconds, ready to drop into your database or API call.",
    ],
    faqs: [
      { q: "How is a date converted to a Unix timestamp?", a: "The date is interpreted as an absolute instant (using its zone or offset), then the number of whole seconds since 1970-01-01T00:00:00Z is computed." },
      { q: "What if my date string has no time zone?", a: "A bare date/time is interpreted in your local zone by the browser. Add a 'Z' or an offset like +05:30 to make it explicit and unambiguous." },
      { q: "Can I convert natural language dates?", a: "Yes — phrases like 'tomorrow', 'in 3 hours', or 'next monday 9am' are parsed and turned into a precise timestamp." },
    ],
    related: ["unix-timestamp-to-date", "iso-8601-to-unix-timestamp", "unix-timestamp-to-iso-8601"],
  },
  {
    slug: "milliseconds-to-date",
    h1: "Convert Milliseconds to Date",
    metaTitle: "Milliseconds Timestamp to Date Converter — Free",
    metaDescription:
      "Convert a Unix timestamp in milliseconds (13 digits) to a human date in UTC and local time. Common for JavaScript Date.now() and Java System.currentTimeMillis().",
    example: "1700000000000",
    targetKey: "utc",
    intro: [
      "Many runtimes report time in milliseconds rather than seconds — JavaScript's Date.now() and Java's System.currentTimeMillis() both return 13-digit millisecond timestamps. Dividing by 1000 gives the classic Unix seconds value.",
      "Paste your 13-digit value below to see the exact date and time. The tool keeps millisecond precision and also shows the equivalent seconds, microseconds, and nanoseconds.",
    ],
    faqs: [
      { q: "Why is my timestamp 13 digits instead of 10?", a: "It is in milliseconds. Multiply seconds by 1000 to get milliseconds; divide by 1000 to go back. 13-digit values cover dates around the present day." },
      { q: "How do I convert milliseconds to seconds?", a: "Integer-divide by 1000 (drop the last three digits). 1700000000000 ms = 1700000000 s." },
      { q: "Does JavaScript use seconds or milliseconds?", a: "Milliseconds. Date.now() and getTime() return milliseconds since the epoch; divide by 1000 for Unix seconds used by most backends." },
    ],
    related: ["unix-timestamp-to-date", "date-to-unix-timestamp", "nanoseconds-to-date"],
  },
  {
    slug: "unix-timestamp-to-iso-8601",
    h1: "Convert Unix Timestamp to ISO 8601",
    metaTitle: "Unix Timestamp to ISO 8601 Converter — Free",
    metaDescription:
      "Convert a Unix timestamp to an ISO 8601 / RFC 3339 string (e.g. 2023-11-14T22:13:20Z). Copy-ready output with code examples in 14 languages.",
    example: "1700000000",
    targetKey: "iso",
    intro: [
      "ISO 8601 is the international standard for representing dates and times as text, e.g. 2023-11-14T22:13:20Z. Its UTC form (the trailing 'Z') is unambiguous and sorts lexicographically, which is why APIs and logs prefer it.",
      "Enter a Unix timestamp to get the canonical ISO 8601 string in UTC, plus the RFC 3339 form with your local offset. Both are valid ISO 8601; the difference is only the time zone designator.",
    ],
    faqs: [
      { q: "What is the difference between ISO 8601 and RFC 3339?", a: "RFC 3339 is a strict profile of ISO 8601 used on the internet. Every RFC 3339 timestamp is valid ISO 8601, but ISO 8601 also allows forms RFC 3339 does not (like week dates)." },
      { q: "What does the 'Z' mean?", a: "'Z' (Zulu) is the zone designator for UTC, equivalent to +00:00. It marks the timestamp as Coordinated Universal Time." },
      { q: "Is ISO 8601 in UTC or local time?", a: "It can be either — a 'Z' or an explicit offset such as +05:30 tells you which. Without an offset the time zone is unspecified, which you should avoid." },
    ],
    related: ["iso-8601-to-unix-timestamp", "unix-timestamp-to-date", "unix-timestamp-to-rfc-2822"],
  },
  {
    slug: "iso-8601-to-unix-timestamp",
    h1: "Convert ISO 8601 to Unix Timestamp",
    metaTitle: "ISO 8601 to Unix Timestamp Converter — Free",
    metaDescription:
      "Parse an ISO 8601 / RFC 3339 date string into a Unix timestamp in seconds and milliseconds. Handles 'Z' and numeric offsets correctly.",
    example: "2023-11-14T22:13:20+00:00",
    targetKey: "s",
    intro: [
      "To convert an ISO 8601 string back to a Unix timestamp, the parser reads the date, time, and zone designator, resolves the absolute instant, and counts seconds from the epoch. Offsets like +05:30 and the 'Z' suffix are honoured.",
      "Paste your ISO string below for the seconds and millisecond values, ready for storage or arithmetic.",
    ],
    faqs: [
      { q: "Does the offset change the resulting timestamp?", a: "Yes. 2023-11-14T22:13:20Z and 2023-11-15T03:43:20+05:30 are the same instant and produce the same Unix timestamp." },
      { q: "What if the string lacks an offset?", a: "It is treated as local time by the browser, which can be ambiguous. Always include 'Z' or an explicit offset for reliable conversion." },
      { q: "Are fractional seconds supported?", a: "Yes — values like 2023-11-14T22:13:20.500Z keep millisecond precision in the output." },
    ],
    related: ["unix-timestamp-to-iso-8601", "date-to-unix-timestamp", "unix-timestamp-to-date"],
  },
  {
    slug: "unix-timestamp-to-rfc-2822",
    h1: "Convert Unix Timestamp to RFC 2822",
    metaTitle: "Unix Timestamp to RFC 2822 Date Converter — Free",
    metaDescription:
      "Convert a Unix timestamp to an RFC 2822 date string (e.g. Tue, 14 Nov 2023 22:13:20 +0000), the format used in email headers and HTTP.",
    example: "1700000000",
    targetKey: "rfc2822",
    intro: [
      "RFC 2822 defines the date format used in email headers and, closely related, HTTP. It looks like “Tue, 14 Nov 2023 22:13:20 +0000” — a human-friendly layout with an explicit numeric offset.",
      "Convert any Unix timestamp to RFC 2822 below, alongside ISO 8601 and the raw seconds for cross-referencing.",
    ],
    faqs: [
      { q: "Where is RFC 2822 used?", a: "Primarily in email 'Date:' headers and, with a small variation, in HTTP headers like Last-Modified and Expires." },
      { q: "How does RFC 2822 differ from ISO 8601?", a: "RFC 2822 is human-oriented (day name, month name, numeric offset) while ISO 8601 is machine-oriented and lexicographically sortable." },
      { q: "What offset should I use?", a: "+0000 denotes UTC. Email systems may use local offsets, but UTC is the safest for storage and comparison." },
    ],
    related: ["unix-timestamp-to-iso-8601", "unix-timestamp-to-date", "date-to-unix-timestamp"],
  },
  {
    slug: "nanoseconds-to-date",
    h1: "Convert Nanoseconds to Date",
    metaTitle: "Nanoseconds Timestamp to Date Converter — Free",
    metaDescription:
      "Convert a 19-digit nanosecond Unix timestamp to a date. Common in Go (time.UnixNano), tracing systems, and high-resolution logs.",
    example: "1700000000000000000",
    targetKey: "utc",
    intro: [
      "Nanosecond timestamps (19 digits) appear in Go's time.UnixNano(), distributed tracing, and high-frequency systems. They count billionths of a second since the Unix epoch.",
      "Paste a nanosecond value to see the date plus the equivalent seconds, milliseconds, and microseconds. Full integer precision is preserved using big integers.",
    ],
    faqs: [
      { q: "How many digits is a nanosecond timestamp?", a: "Around 19 digits for present-day dates. Divide by 1,000,000,000 to get seconds." },
      { q: "Which languages use nanosecond time?", a: "Go (time.UnixNano), and many tracing/observability tools. Rust and Java can also expose nanosecond precision." },
      { q: "Will I lose precision converting in JavaScript?", a: "Plain JS numbers lose sub-millisecond precision. This tool uses BigInt to keep the full nanosecond value exact." },
    ],
    related: ["milliseconds-to-date", "unix-timestamp-to-date", "unix-timestamp-to-iso-8601"],
  },
  {
    slug: "current-unix-timestamp",
    h1: "Current Unix Timestamp",
    metaTitle: "Current Unix Timestamp (Live Epoch Clock) — Free",
    metaDescription:
      "The current Unix timestamp right now, live in seconds, milliseconds, microseconds, and nanoseconds. One-click copy and code to get it in any language.",
    example: "now",
    targetKey: "s",
    intro: [
      "The current Unix timestamp is the number of seconds since 1 January 1970 UTC at this very moment. It ticks once per second and is the canonical way to record “now” in a portable, zone-independent form.",
      "The live clock below updates in real time. Copy the seconds or milliseconds value, or grab the one-liner for your language further down the page.",
    ],
    faqs: [
      { q: "What is the current Unix timestamp?", a: "It is the live count of seconds since the 1970 epoch, shown and updated in real time above. Milliseconds, microseconds, and nanoseconds are also provided." },
      { q: "How do I get the current timestamp in code?", a: "Use Math.floor(Date.now()/1000) in JS, int(time.time()) in Python, time.Now().Unix() in Go — see the snippets below." },
      { q: "Is the timestamp the same in every country?", a: "Yes. Unix time is defined in UTC, so the integer is identical worldwide at any given instant." },
    ],
    related: ["unix-timestamp-to-date", "milliseconds-to-date", "date-to-unix-timestamp"],
  },
];

export const conversionBySlug = (slug: string) => CONVERSIONS.find((c) => c.slug === slug);
