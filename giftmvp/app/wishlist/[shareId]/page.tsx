import { createClient } from "@/lib/supabase-server";
import { cookies } from "next/headers";
import ClaimButton from "@/components/ClaimButton";

export default async function PublicWishlist({ params }: { params: { shareId: string }}) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: wl } = await supabase.from("wishlists").select("*").eq("share_id", params.shareId).single();
  if (!wl) return <div className="card">Wishlist not found.</div>;

  const { data: items } = await supabase.from("wishlist_items")
    .select("id, note, priority, status, created_at, gift_idea_id, gift_ideas ( title, url, image_url, price_cents, merchant, affiliate_url )")
    .eq("wishlist_id", wl.id).order("created_at", { ascending: false });

  return (
    <div className="grid gap-4">
      <div className="card">
        <h1 className="text-2xl font-semibold">{wl.title}</h1>
        <p className="text-gray-600">Claim an item to avoid duplicates. The wishlist owner won’t see who claimed it.</p>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {items?.map((it) => (
          <div key={it.id} className="card">
            <div className="flex gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={it.gift_ideas?.image_url || '/placeholder.png'} alt="" className="w-24 h-24 object-cover rounded-xl" />
              <div className="flex-1">
                <div className="font-medium">{it.gift_ideas?.title}</div>
                <div className="text-sm text-gray-600">{it.gift_ideas?.merchant}</div>
                {it.gift_ideas?.price_cents ? <div className="text-sm mt-1">${(it.gift_ideas.price_cents/100).toFixed(2)}</div> : null}
                <div className="mt-2 flex gap-2">
                  <a className="btn" href={it.gift_ideas?.affiliate_url || it.gift_ideas?.url || '#'} target="_blank">View</a>
                  <ClaimButton itemId={it.id} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}