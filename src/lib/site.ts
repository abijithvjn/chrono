export const SITE_URL = "https://epochtimeconverter.online";
export const SITE_NAME = "Epoch Time Converter";
export const SITE_TAGLINE = "The developer's timestamp & time-zone toolkit";
export const SITE_DESC =
  "Convert Unix timestamps, ISO 8601, RFC dates, and time zones instantly. Free, fast, ad-free developer tools with code snippets in 14 languages.";

export const canonical = (path = "/") => SITE_URL + (path.endsWith("/") ? path : path + "/");
