import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { locales, rtlLocales, type Locale } from "@/i18n/request";
import "../globals.css";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: Locale };
}) {
  const messages = await getMessages();
  const dir = rtlLocales.includes(locale) ? "rtl" : "ltr";

  return (
    // dir flips the whole document — nav, rail position, and prose all mirror
    // automatically via CSS logical properties. Nothing inside <CodeSpine> or
    // the code editor pane obeys this; they force ltr explicitly (see those
    // components) because Python syntax is always read left-to-right.
    <html lang={locale} dir={dir}>
      <body
        className={`bg-paper text-ink-indigo dark:bg-paper-dark ${
          dir === "rtl" ? "font-sans-ar" : "font-sans"
        }`}
      >
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
