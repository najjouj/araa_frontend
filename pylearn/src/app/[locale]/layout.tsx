import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { rtlLocales, type Locale } from "@/i18n/request";
import "../globals.css";

// Note: intentionally no generateStaticParams here. next-intl's server APIs
// (getMessages) require dynamic rendering, which conflicts with static
// pre-generation in newer Next.js versions and fails the build. Since this
// app deploys as a normal server-rendered app on Vercel (not a static
// export), server-rendering these routes on request is the right default.

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
