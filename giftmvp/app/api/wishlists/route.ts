import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase-server";

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.redirect(new URL('/dashboard', process.env.NEXT_PUBLIC_SITE_URL));

  const data = await req.formData();
  const title = String(data.get('title') || 'My Wishlist');
  const { data: wl, error } = await supabase.from('wishlists').insert({ title, user_id: user.id }).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.redirect(new URL('/dashboard', process.env.NEXT_PUBLIC_SITE_URL));
}

export async function PUT(req: Request) {
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const { error } = await supabase.from('wishlists').delete().eq('id', id).eq('user_id', user.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.redirect(new URL('/dashboard', process.env.NEXT_PUBLIC_SITE_URL));
}