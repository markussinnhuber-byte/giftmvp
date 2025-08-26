/**
 * Affiliate helpers
 * - Sovrn/Skimlinks: handled by client script injection via SOVRN_SITE_ID (auto-rewrites outbound links).
 * - Awin / impact: you can wrap priority merchants here with your affiliate deep link format.
 *   Example formats vary per program; configure as needed.
 */
const PRIORITY_MERCHANTS: Record<string, (url: string) => string> = {
  // "example.com": (url) => `https://affiliate-network.com/track?mid=123&url=${encodeURIComponent(url)}`
};

export function monetizeUrl(rawUrl: string): string {
  try {
    const host = new URL(rawUrl).hostname.replace(/^www\./, '');
    const wrapper = PRIORITY_MERCHANTS[host];
    if (wrapper) return wrapper(rawUrl);
  } catch { /* ignore */ }
  return rawUrl; // Sovrn script will auto-monetize on click
}