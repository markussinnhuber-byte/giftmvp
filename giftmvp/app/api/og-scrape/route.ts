import { NextResponse } from "next/server";
import * as cheerio from "cheerio";
import { monetizeUrl } from "@/lib/affiliate";

export async function POST(req: Request) {
  const { url } = await req.json();
  if (!url) return NextResponse.json({ error: "Missing url" }, { status: 400 });
  try {
    const res = await fetch(url, { headers: { 'user-agent': 'Mozilla/5.0 GiftMVP' } });
    const html = await res.text();
    const $ = cheerio.load(html);
    const get = (sel: string) => $(sel).attr('content') || '';
    const title = get('meta[property="og:title"]') || $('title').text() || url;
    const image = get('meta[property="og:image"]');
    const priceRaw = get('meta[property="product:price:amount"]') || get('meta[itemprop="price"]') || "";
    const price_cents = priceRaw ? Math.round(parseFloat(priceRaw) * 100) : null;
    const merchant = new URL(url).hostname.replace(/^www\./, '');

    return NextResponse.json({
      title, image_url: image, price_cents, merchant,
      affiliate_url: monetizeUrl(url),
    });
  } catch (e) {
    return NextResponse.json({ error: "Failed to fetch URL" }, { status: 500 });
  }
}