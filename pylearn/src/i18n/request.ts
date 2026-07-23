import { getRequestConfig } from "next-intl/server";
import { notFound } from "next/navigation";

// Locale registry. Adding a third language later means adding one entry
// here and one messages/{locale}.json file — no other code changes,
// per the i18n architecture requirement in the PRD (Section 7).
export const locales = ["en", "ar"] as const;
export type Locale = (typeof locales)[number];

// RTL locales are tracked explicitly rather than inferred, since inferring
// text direction from locale codes gets fragile once more languages are added.
export const rtlLocales: Locale[] = ["ar"];

export default getRequestConfig(async ({ locale }) => {
  if (!locales.includes(locale as Locale)) notFound();

  return {
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
