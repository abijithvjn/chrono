export const SITE_URL = "https://devtoolskit.online";
export const SITE_NAME = "DevToolsKit";
export const SITE_TAGLINE = "The developer's toolkit";
export const SITE_DESC =
  "A fast, ad-free suite of developer tools — Epoch converter, JSON formatter, Regex tester, Base64, Diff checker, Cron parser and more. Everything runs in your browser.";

export const canonical = (path = "/") => SITE_URL + (path.endsWith("/") ? path : path + "/");
