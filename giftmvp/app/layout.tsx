import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";

export const metadata: Metadata = {
  title: "GiftMVP",
  description: "Find thoughtful gifts and share wishlists with zero hassle.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const sovrnId = process.env.SOVRN_SITE_ID;
  return (
    <html lang="en">
      <body>
        <header className="border-b">
          <div className="container py-4 flex items-center justify-between">
            <a href="/" className="font-semibold">🎁 GiftMVP</a>
            <nav className="flex gap-3">
              <a className="btn" href="/dashboard">Dashboard</a>
              <a className="btn" href="https://github.com/" target="_blank">GitHub</a>
            </nav>
          </div>
        </header>
        <main className="container py-8">{children}</main>
        {sovrnId ? (
          <Script
            id="sovrn-skimlinks"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `(function(){var s=document.createElement('script'); s.type='text/javascript'; s.async=true; s.src='https://s.skimresources.com/js/` + sovrnId + `.skimlinks.js'; var x=document.getElementsByTagName('script')[0]; x.parentNode.insertBefore(s,x);})();`,
            }}
          />
        ) : null}
      </body>
    </html>
  );
}