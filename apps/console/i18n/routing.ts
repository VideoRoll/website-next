import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ["en", "zh"],

  // Used when no locale matches
  defaultLocale: "en",
  pathnames: {
    "/": "/",
    "/zh": "/zh",
    "/en": "/en",
    "/tools": "/tools",
    "/tools/convert": "/tools/convert",
    "/profile": "/profile",
  },
});
