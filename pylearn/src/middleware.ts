import createMiddleware from "next-intl/middleware";
import { locales } from "./i18n/request";

// Every route lives under /en/... or /ar/...; the root path redirects to
// the visitor's stored preference (cookie) or browser Accept-Language,
// per the "automatically remember preferred language" requirement.
export default createMiddleware({
  locales,
  defaultLocale: "en",
  localePrefix: "always",
});

export const config = {
  // Skip API routes, static files, and Next internals.
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
