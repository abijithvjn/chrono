import { LANGS, type Lang } from "@/lib/snippets";

export interface LangPage {
  lang: Lang;
  slug: string;            // e.g. "python"
  metaTitle: string;
  metaDescription: string;
  intro: string;          // unique, mentions the real API
  pitfall: string;        // a language-specific gotcha
  faqs: { q: string; a: string }[];
}

const INFO: Record<Lang, { intro: string; pitfall: string; faqs: { q: string; a: string }[] }> = {
  JavaScript: {
    intro: "In JavaScript, Date.now() returns the current time in milliseconds since the Unix epoch. Divide by 1000 for the seconds value most backends expect, and use new Date(ms) to turn a timestamp back into a date.",
    pitfall: "Date works in milliseconds, not seconds — forgetting the ÷1000 is the most common bug when talking to APIs that use Unix seconds.",
    faqs: [
      { q: "How do I get the current Unix timestamp in JavaScript?", a: "Math.floor(Date.now() / 1000) gives seconds; Date.now() gives milliseconds." },
      { q: "How do I convert a Unix timestamp to a Date in JavaScript?", a: "new Date(seconds * 1000) — multiply by 1000 because the Date constructor expects milliseconds." },
    ],
  },
  TypeScript: {
    intro: "TypeScript uses the same runtime APIs as JavaScript — Date.now() for milliseconds — but lets you type timestamps explicitly (e.g. number) and model branded epoch types for safety.",
    pitfall: "Typing a value as Date vs number won't catch a seconds/milliseconds mix-up — consider a branded type like type EpochMs = number & { __ms: true }.",
    faqs: [
      { q: "Is timestamp handling different in TypeScript?", a: "The runtime behaviour is identical to JavaScript; TypeScript only adds compile-time types around it." },
      { q: "How do I type a Unix timestamp?", a: "As number. For extra safety use a branded type to distinguish seconds from milliseconds." },
    ],
  },
  Python: {
    intro: "Python's time.time() returns the current Unix time as a float of seconds, while datetime.fromtimestamp(ts, tz=timezone.utc) converts a timestamp to an aware datetime. Always pass a tz to avoid local-time surprises.",
    pitfall: "datetime.fromtimestamp() without a tz uses local time; use timezone.utc (or datetime.utcfromtimestamp, now deprecated) for UTC.",
    faqs: [
      { q: "How do I get the current Unix timestamp in Python?", a: "int(time.time()) for seconds. Use time.time_ns() for nanoseconds." },
      { q: "How do I convert a timestamp to UTC in Python?", a: "datetime.fromtimestamp(ts, tz=timezone.utc) returns a timezone-aware UTC datetime." },
    ],
  },
  Go: {
    intro: "In Go, time.Now().Unix() returns the current Unix time in seconds, and time.Unix(sec, nsec) builds a time.Time from a timestamp. time.Now().UnixNano() gives nanosecond precision.",
    pitfall: "UnixNano() will overflow int64 around the year 2262 — fine for most uses, but worth knowing for far-future dates.",
    faqs: [
      { q: "How do I get the current Unix timestamp in Go?", a: "time.Now().Unix() for seconds, time.Now().UnixMilli() for milliseconds, time.Now().UnixNano() for nanoseconds." },
      { q: "How do I convert a Unix timestamp to time.Time?", a: "time.Unix(seconds, 0).UTC() returns the instant in UTC." },
    ],
  },
  Rust: {
    intro: "In Rust, SystemTime::now().duration_since(UNIX_EPOCH) yields the time since the epoch as a Duration; call .as_secs() or .as_millis(). The chrono crate offers richer formatting via DateTime::from_timestamp.",
    pitfall: "duration_since returns a Result — it errors if the clock is before the epoch — so handle or unwrap deliberately.",
    faqs: [
      { q: "How do I get the current Unix timestamp in Rust?", a: "SystemTime::now().duration_since(UNIX_EPOCH).unwrap().as_secs() for seconds." },
      { q: "How do I format a timestamp in Rust?", a: "Use the chrono crate: DateTime::from_timestamp(secs, 0) then .to_rfc3339()." },
    ],
  },
  Java: {
    intro: "Modern Java uses java.time: Instant.now().getEpochSecond() for the current second, and Instant.ofEpochSecond(ts) to rebuild an instant. System.currentTimeMillis() remains for milliseconds.",
    pitfall: "Avoid the legacy java.util.Date; java.time.Instant is immutable, unambiguous (UTC), and far less error-prone.",
    faqs: [
      { q: "How do I get the current Unix timestamp in Java?", a: "Instant.now().getEpochSecond() for seconds, or System.currentTimeMillis() for milliseconds." },
      { q: "How do I convert a timestamp to a date in Java?", a: "Instant.ofEpochSecond(ts).atZone(ZoneOffset.UTC) gives a zoned date-time in UTC." },
    ],
  },
  Kotlin: {
    intro: "Kotlin on the JVM uses java.time directly: Instant.now().epochSecond for the current second and Instant.ofEpochSecond(ts) to convert back. System.currentTimeMillis() returns milliseconds.",
    pitfall: "On Kotlin Multiplatform the JVM time APIs aren't available everywhere — use kotlinx-datetime's Clock.System.now() for portability.",
    faqs: [
      { q: "How do I get the current Unix timestamp in Kotlin?", a: "Instant.now().epochSecond on the JVM, or Clock.System.now().epochSeconds with kotlinx-datetime." },
      { q: "How do I convert a timestamp in Kotlin?", a: "Instant.ofEpochSecond(ts) builds an Instant you can format in any zone." },
    ],
  },
  Swift: {
    intro: "In Swift, Date().timeIntervalSince1970 returns the current Unix time as a Double of seconds, and Date(timeIntervalSince1970: ts) converts a timestamp back to a Date.",
    pitfall: "timeIntervalSince1970 is a Double with sub-second precision — cast to Int only when you intentionally want whole seconds.",
    faqs: [
      { q: "How do I get the current Unix timestamp in Swift?", a: "Int(Date().timeIntervalSince1970) for whole seconds." },
      { q: "How do I convert a timestamp to a Date in Swift?", a: "Date(timeIntervalSince1970: ts) then format with ISO8601DateFormatter." },
    ],
  },
  PHP: {
    intro: "PHP's time() returns the current Unix timestamp in seconds, and gmdate('c', $ts) formats a timestamp as an ISO 8601 string in UTC. DateTime::createFromFormat('U', $ts) builds an object.",
    pitfall: "date() uses the default timezone set by date_default_timezone_set(); use gmdate() when you specifically want UTC.",
    faqs: [
      { q: "How do I get the current Unix timestamp in PHP?", a: "time() returns the current time in seconds." },
      { q: "How do I convert a timestamp to a date in PHP?", a: "gmdate('Y-m-d H:i:s', $ts) for UTC, or date(...) for the configured local zone." },
    ],
  },
  Ruby: {
    intro: "In Ruby, Time.now.to_i returns the current Unix time in seconds, and Time.at(ts) builds a Time from a timestamp. Call .utc to render it in UTC.",
    pitfall: "Time.at returns local time by default — chain .utc to avoid zone-dependent output.",
    faqs: [
      { q: "How do I get the current Unix timestamp in Ruby?", a: "Time.now.to_i for seconds, (Time.now.to_f * 1000).to_i for milliseconds." },
      { q: "How do I convert a timestamp in Ruby?", a: "Time.at(ts).utc.iso8601 returns an ISO 8601 UTC string." },
    ],
  },
  "C#": {
    intro: "In C#, DateTimeOffset.UtcNow.ToUnixTimeSeconds() returns the current Unix time, and DateTimeOffset.FromUnixTimeSeconds(ts) converts a timestamp back. Both keep the UTC offset explicit.",
    pitfall: "Prefer DateTimeOffset over DateTime — DateTime can silently lose zone information and cause off-by-hours bugs.",
    faqs: [
      { q: "How do I get the current Unix timestamp in C#?", a: "DateTimeOffset.UtcNow.ToUnixTimeSeconds() for seconds, ToUnixTimeMilliseconds() for milliseconds." },
      { q: "How do I convert a Unix timestamp in C#?", a: "DateTimeOffset.FromUnixTimeSeconds(ts).UtcDateTime gives a UTC DateTime." },
    ],
  },
  SQL: {
    intro: "Databases differ: PostgreSQL uses to_timestamp(ts) and extract(epoch from now()), while MySQL uses FROM_UNIXTIME(ts) and UNIX_TIMESTAMP(). Both convert between epoch integers and native timestamp types.",
    pitfall: "Watch the session time zone — PostgreSQL's to_timestamp returns timestamptz, and display depends on the client's TimeZone setting.",
    faqs: [
      { q: "How do I get the current Unix timestamp in SQL?", a: "PostgreSQL: SELECT extract(epoch from now())::bigint; MySQL: SELECT UNIX_TIMESTAMP();" },
      { q: "How do I convert a Unix timestamp in SQL?", a: "PostgreSQL: to_timestamp(ts); MySQL: FROM_UNIXTIME(ts)." },
    ],
  },
  Bash: {
    intro: "In the shell, date +%s prints the current Unix timestamp in seconds. GNU date converts with date -d @ts; macOS/BSD date uses date -r ts.",
    pitfall: "GNU and BSD date have different flags — -d @ts works on Linux, -r ts on macOS. Scripts that must run on both should detect the platform.",
    faqs: [
      { q: "How do I get the current Unix timestamp in Bash?", a: "date +%s prints seconds; date +%s%3N prints milliseconds on GNU date." },
      { q: "How do I convert a timestamp to a date in Bash?", a: "GNU: date -u -d @ts; macOS/BSD: date -u -r ts." },
    ],
  },
  PowerShell: {
    intro: "PowerShell can use .NET directly: [DateTimeOffset]::UtcNow.ToUnixTimeSeconds() for the current timestamp and [DateTimeOffset]::FromUnixTimeSeconds(ts) to convert back.",
    pitfall: "Get-Date returns a DateTime in local time; go through [DateTimeOffset] to keep the conversion zone-correct.",
    faqs: [
      { q: "How do I get the current Unix timestamp in PowerShell?", a: "[DateTimeOffset]::UtcNow.ToUnixTimeSeconds()." },
      { q: "How do I convert a Unix timestamp in PowerShell?", a: "[DateTimeOffset]::FromUnixTimeSeconds(ts).UtcDateTime." },
    ],
  },
};

export const LANG_PAGES: LangPage[] = LANGS.map((lang) => ({
  lang,
  slug: lang.toLowerCase().replace("#", "sharp").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
  metaTitle: `Unix Timestamp in ${lang} — Get & Convert Epoch Time`,
  metaDescription: `How to get the current Unix timestamp and convert between epoch time and dates in ${lang}, with copy-ready code examples.`,
  intro: INFO[lang].intro,
  pitfall: INFO[lang].pitfall,
  faqs: INFO[lang].faqs,
}));

export const langBySlug = (slug: string) => LANG_PAGES.find((l) => l.slug === slug);
