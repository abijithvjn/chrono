// Code snippets that convert the selected timestamp, per language.
export const LANGS = [
  "JavaScript", "TypeScript", "Python", "Go", "Rust", "Java", "Kotlin",
  "Swift", "PHP", "Ruby", "C#", "SQL", "Bash", "PowerShell",
] as const;
export type Lang = (typeof LANGS)[number];

export function snippet(lang: Lang, s: number, ms: number, iso: string): string {
  switch (lang) {
    case "JavaScript": return `const d = new Date(${ms});\nconsole.log(d.toISOString()); // ${iso}\nMath.floor(Date.now() / 1000); // current epoch`;
    case "TypeScript": return `const d: Date = new Date(${ms});\nconst iso: string = d.toISOString(); // ${iso}\nconst now: number = Math.floor(Date.now() / 1000);`;
    case "Python": return `from datetime import datetime, timezone\nprint(datetime.fromtimestamp(${s}, tz=timezone.utc))  # ${iso}\nimport time; int(time.time())`;
    case "Go": return `package main\nimport ("fmt"; "time")\nfunc main() {\n  fmt.Println(time.Unix(${s}, 0).UTC()) // ${iso}\n  fmt.Println(time.Now().Unix())\n}`;
    case "Rust": return `use std::time::{UNIX_EPOCH, Duration};\nlet t = UNIX_EPOCH + Duration::from_secs(${s}); // ${iso}\n// chrono: DateTime::from_timestamp(${s}, 0)`;
    case "Java": return `import java.time.Instant;\nInstant t = Instant.ofEpochSecond(${s}L); // ${iso}\nlong now = Instant.now().getEpochSecond();`;
    case "Kotlin": return `import java.time.Instant\nval t = Instant.ofEpochSecond(${s}L) // ${iso}\nval now = Instant.now().epochSecond`;
    case "Swift": return `import Foundation\nlet t = Date(timeIntervalSince1970: ${s}) // ${iso}\nlet now = Int(Date().timeIntervalSince1970)`;
    case "PHP": return `<?php\necho gmdate("c", ${s}); // ${iso}\necho time(); // current epoch`;
    case "Ruby": return `require 'time'\nputs Time.at(${s}).utc.iso8601 # ${iso}\nputs Time.now.to_i`;
    case "C#": return `var t = DateTimeOffset.FromUnixTimeSeconds(${s}L).UtcDateTime; // ${iso}\nvar now = DateTimeOffset.UtcNow.ToUnixTimeSeconds();`;
    case "SQL": return `-- PostgreSQL\nSELECT to_timestamp(${s}); -- ${iso}\n-- MySQL\nSELECT FROM_UNIXTIME(${s});`;
    case "Bash": return `date -u -d @${s}      # GNU -> ${iso}\ndate -u -r ${s}       # macOS/BSD\ndate +%s             # current epoch`;
    case "PowerShell": return `[DateTimeOffset]::FromUnixTimeSeconds(${s}).UtcDateTime # ${iso}\n[DateTimeOffset]::UtcNow.ToUnixTimeSeconds()`;
  }
}
