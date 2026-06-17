// Long-form, indexable content per tool — rendered below the workspace by
// ToolSeo and used to build HowTo structured data. One entry per tool slug.

export interface ToolContent {
  intro: string;          // what it is / why it exists
  benefits: string[];     // "Why use it" bullets
  howto: { name: string; text: string }[]; // steps → also HowTo schema
  notes: string;          // developer notes
}

export const TOOL_CONTENT: Record<string, ToolContent> = {
  "epoch-converter": {
    intro:
      "The Epoch Converter turns Unix timestamps into human-readable dates and back. Unix time counts the seconds since 1 January 1970 UTC, which makes it compact, sortable and free of timezone ambiguity — the reason almost every database, API and log stores time this way.",
    benefits: [
      "Auto-detects seconds, milliseconds, microseconds and nanoseconds.",
      "Shows UTC, your local time, ISO 8601, RFC 2822 and relative time at once.",
      "Decodes JWTs, JSON payloads and log lines, and parses natural language like “next friday 5pm”.",
      "Runs entirely in your browser — nothing is uploaded.",
    ],
    howto: [
      { name: "Paste a value", text: "Paste a Unix timestamp, ISO date, JWT or log line into the input — or pick a date with the picker." },
      { name: "Read every format", text: "Instantly see UTC, local, ISO 8601, RFC and relative time, plus seconds and milliseconds." },
      { name: "Copy what you need", text: "Click any value to copy it, or grab a code snippet in your language." },
    ],
    notes:
      "Timestamps are absolute instants; only their calendar representation depends on a timezone. Store and compare in UTC seconds, and format to a zone only at display time.",
  },
  "json-formatter": {
    intro:
      "The JSON Formatter pretty-prints, validates and minifies JSON entirely in your browser. Well-formatted JSON is far easier to read and diff, while minified JSON is smaller on the wire — this tool does both, and pinpoints syntax errors by line and column.",
    benefits: [
      "Pretty-print with 2-space indentation or minify to a single line.",
      "Validate with the exact line and column of the first error.",
      "Syntax highlighting and line numbers for fast scanning.",
      "Upload, drag-and-drop or download JSON; handles large files.",
    ],
    howto: [
      { name: "Paste or drop JSON", text: "Paste JSON into the editor, or drag a .json file onto it." },
      { name: "Format or minify", text: "Click Format to pretty-print or Minify to compact it; invalid JSON is flagged with the error location." },
      { name: "Copy or download", text: "Copy the result or download it as a .json file." },
    ],
    notes:
      "Most “invalid JSON” errors come from trailing commas, single quotes, comments or unquoted keys — none of which are valid JSON. JSON is always UTF-8 and keys must be double-quoted strings.",
  },
  "regex-tester": {
    intro:
      "The Regex Tester lets you build and debug JavaScript regular expressions against real text with live feedback. Matches are highlighted as you type, with capture groups, positions and a full match list, so you can iterate quickly without a console.",
    benefits: [
      "Live highlighting of every match in your test string.",
      "Capture groups, named groups and exact match positions.",
      "Toggle all flags — g, i, m, s, u, y — and see the effect instantly.",
      "Clear, immediate errors for invalid patterns.",
    ],
    howto: [
      { name: "Enter a pattern", text: "Type your regular expression in the pattern field (no slashes needed)." },
      { name: "Add a test string", text: "Paste the text to match against; matches highlight live." },
      { name: "Tune flags", text: "Toggle g/i/m/s/u/y and review the matches, groups and positions below." },
    ],
    notes:
      "This uses the JavaScript (ECMAScript) regex engine, so behaviour matches your browser and Node.js exactly — including Unicode property escapes under the u flag and sticky matching under y.",
  },
  "base64-encoder": {
    intro:
      "The Base64 Encoder converts text and files to Base64 and back. Base64 represents binary data using 64 printable ASCII characters, which is why it is used for data URLs, email attachments, JWT segments and embedding assets — anywhere binary must travel through text-only channels.",
    benefits: [
      "Encode text to Base64 and decode Base64 to text, UTF-8 safe.",
      "Auto-detect mode figures out which direction you need.",
      "Upload any file to get its Base64 or a ready-to-use data URL.",
      "Live character and byte counts for input and output.",
    ],
    howto: [
      { name: "Choose a mode", text: "Pick Encode, Decode, or leave it on Auto to detect automatically." },
      { name: "Enter text or a file", text: "Type or paste text, or upload a file to encode it to Base64." },
      { name: "Copy the result", text: "Copy the output, or copy it as a data URL for embedding." },
    ],
    notes:
      "Base64 is an encoding, not encryption — it offers no confidentiality and grows data by ~33%. Use it for transport and embedding, never to protect secrets.",
  },
  "diff-checker": {
    intro:
      "The Diff Checker compares two blocks of text and highlights exactly what changed — additions, removals and modifications — line by line. It is ideal for reviewing config edits, copy changes, query tweaks or any before-and-after text.",
    benefits: [
      "Side-by-side or unified views of the differences.",
      "Highlights added, removed and changed lines clearly.",
      "Ignore whitespace and ignore case options.",
      "Everything stays in your browser — nothing is uploaded.",
    ],
    howto: [
      { name: "Paste both versions", text: "Put the original on the left and the changed text on the right." },
      { name: "Pick options", text: "Optionally ignore whitespace or case, and choose side-by-side or unified view." },
      { name: "Review changes", text: "Added lines show in green, removed in red; copy the unified diff if needed." },
    ],
    notes:
      "The comparison uses a longest-common-subsequence line diff — the same family of algorithm git uses — which produces minimal, readable change sets rather than noisy character churn.",
  },
  "cron-parser": {
    intro:
      "The Cron Parser explains cron expressions in plain English and previews when they will actually run. Cron’s five fields — minute, hour, day-of-month, month and day-of-week — are powerful but easy to get wrong; this tool removes the guesswork.",
    benefits: [
      "Human-readable explanation of any 5-field cron expression.",
      "Preview of the next ten execution times in UTC and your local zone.",
      "Validation with clear errors for malformed expressions.",
      "One-click presets for common schedules.",
    ],
    howto: [
      { name: "Enter an expression", text: "Type a 5-field cron expression, or pick a preset like “Every 5 minutes”." },
      { name: "Read the explanation", text: "See the plain-English meaning and whether the expression is valid." },
      { name: "Check the next runs", text: "Review the next ten execution times in UTC and your local timezone." },
    ],
    notes:
      "Standard cron has no “seconds” field — the smallest interval is one minute. Day-of-month and day-of-week are OR-combined when both are restricted, which surprises many people.",
  },
};

export const contentBySlug = (slug: string) => TOOL_CONTENT[slug];
