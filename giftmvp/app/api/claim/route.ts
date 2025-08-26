import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase-server";

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const data = await req.json();
  const { itemId, name, email } = data || {};
  if (!itemId) return NextResponse.json({ error: "Missing itemId" }, { status: 400 });

  const { error: claimErr } = await supabase.from('claims').insert({
    wishlist_item_id: itemId, claimer_name: name || null, claimer_email: email || null
  });
  if (claimErr) return NextResponse.json({ error: claimErr.message }, { status: 500 });

  const { error: statusErr } = await supabase.from('wishlist_items').update({ status: 'claimed' }).eq('id', itemId);
  if (statusErr) return NextResponse.json({ error: statusErr.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}