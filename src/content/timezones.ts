// Programmatic timezone pages: "current time in X" + conversion to/from UTC.

export interface TzPage {
  slug: string;       // e.g. "ist"
  zone: string;       // IANA, e.g. "Asia/Kolkata"
  abbr: string;       // "IST"
  name: string;       // "India Standard Time"
  city: string;       // "Kolkata / Mumbai / New Delhi"
  dst: boolean;       // observes daylight saving?
  blurb: string;      // unique line
}

export const TZ_PAGES: TzPage[] = [
  { slug: "utc", zone: "UTC", abbr: "UTC", name: "Coordinated Universal Time", city: "Greenwich reference", dst: false,
    blurb: "UTC is the global time standard that every other zone is offset from; it never observes daylight saving and is the basis of Unix time." },
  { slug: "ist", zone: "Asia/Kolkata", abbr: "IST", name: "India Standard Time", city: "New Delhi, Mumbai, Bengaluru", dst: false,
    blurb: "IST is UTC+05:30 year-round — one of the few half-hour offsets — and does not observe daylight saving." },
  { slug: "est", zone: "America/New_York", abbr: "ET", name: "Eastern Time", city: "New York, Toronto, Atlanta", dst: true,
    blurb: "US Eastern Time is UTC−05:00 in winter (EST) and UTC−04:00 in summer (EDT) due to daylight saving." },
  { slug: "pst", zone: "America/Los_Angeles", abbr: "PT", name: "Pacific Time", city: "Los Angeles, San Francisco, Seattle", dst: true,
    blurb: "US Pacific Time shifts between UTC−08:00 (PST) and UTC−07:00 (PDT) across the year." },
  { slug: "gmt", zone: "Europe/London", abbr: "GMT/BST", name: "Greenwich Mean / British Summer Time", city: "London, Dublin", dst: true,
    blurb: "London is UTC+00:00 in winter (GMT) and UTC+01:00 in summer (BST); GMT and UTC coincide but are defined differently." },
  { slug: "cet", zone: "Europe/Paris", abbr: "CET/CEST", name: "Central European Time", city: "Paris, Berlin, Madrid", dst: true,
    blurb: "Central European Time runs UTC+01:00 in winter and UTC+02:00 (CEST) in summer." },
  { slug: "jst", zone: "Asia/Tokyo", abbr: "JST", name: "Japan Standard Time", city: "Tokyo, Osaka", dst: false,
    blurb: "Japan Standard Time is a steady UTC+09:00 with no daylight saving." },
  { slug: "aest", zone: "Australia/Sydney", abbr: "AEST/AEDT", name: "Australian Eastern Time", city: "Sydney, Melbourne", dst: true,
    blurb: "Eastern Australia is UTC+10:00 (AEST) and UTC+11:00 (AEDT) in the southern-hemisphere summer." },
];

export const tzBySlug = (slug: string) => TZ_PAGES.find((t) => t.slug === slug);
