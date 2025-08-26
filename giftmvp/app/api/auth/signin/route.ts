import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase-server";

export async function POST() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  // For MVP, sign in anonymously; swap with magic link in production
  const { data, error } = await supabase.auth.signInAnonymously();
  const redirectTo = new URL('/dashboard', process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000');
  return NextResponse.redirect(redirectTo);
}