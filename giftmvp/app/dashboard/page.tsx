import { createClient } from "@/lib/supabase-server";
import Link from "next/link";
import { cookies } from "next/headers";

export default async function Dashboard() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="card">
        <h1 className="text-xl font-semibold mb-2">Welcome</h1>
        <p className="text-gray-600">Please sign in to manage your wishlists.</p>
        <form action="/api/auth/signin" method="post">
          <button className="btn btn-primary mt-3">Sign in with magic link</button>
        </form>
      </div>
    );
  }

  const { data: wishlists } = await supabase.from("wishlists").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
  return (
    <div className="grid gap-4">
      <div className="card">
        <h1 className="text-2xl font-semibold">Your wishlists</h1>
        <p className="text-gray-600 mb-4">Create and share a wishlist as a simple link.</p>
        <form action="/api/wishlists" method="post" className="flex gap-2">
          <input name="title" className="input" placeholder="Wishlist title" />
          <button className="btn btn-primary">New wishlist</button>
        </form>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {wishlists?.map((w) => (
          <div key={w.id} className="card">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold">{w.title}</div>
                <div className="text-sm text-gray-600">Share link: <Link className="underline" href={`/wishlist/${w.share_id}`}>/wishlist/{w.share_id}</Link></div>
              </div>
              <form action={`/api/wishlists?id=${w.id}`} method="post">
                <input type="hidden" name="_method" value="DELETE" />
                <button className="btn">Delete</button>
              </form>
            </div>
            <div className="mt-3">
              <form action="/api/wishlist-items" method="post" className="grid gap-2">
                <input type="hidden" name="wishlist_id" value={w.id} />
                <div className="label">Add by URL</div>
                <input name="url" className="input" placeholder="Paste any product URL" />
                <div className="grid md:grid-cols-2 gap-2">
                  <input name="title" className="input" placeholder="Title (optional)" />
                  <input name="price" className="input" placeholder="Price (optional)" />
                </div>
                <button className="btn btn-primary w-max">Add item</button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}