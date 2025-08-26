import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase-server";

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const form = await req.formData();
  const wishlist_id = String(form.get('wishlist_id') || '');
  const url = String(form.get('url') || '');
  const title = String(form.get('title') || '');
  const price = String(form.get('price') || '');

  // Scrape OG if URL provided
  let meta: any = {};
  if (url) {
    const res = await fetch(new URL('/api/og-scrape', process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').toString(), {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url })
    });
    meta = await res.json();
  }

  const { data: idea, error: ideaErr } = await supabase.from('gift_ideas').insert({
    user_id: user.id,
    title: title || meta.title || url,
    url,
    merchant: meta.merchant || null,
    image_url: meta.image_url || null,
    price_cents: price ? Math.round(Number(price) * 100) : (meta.price_cents || null),
    affiliate_url: meta.affiliate_url || null,
  }).select().single();
  if (ideaErr) return NextResponse.json({ error: ideaErr.message }, { status: 500 });

  const { error } = await supabase.from('wishlist_items').insert({ wishlist_id, gift_idea_id: idea.id });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.redirect(new URL('/dashboard', process.env.NEXT_PUBLIC_SITE_URL));
}