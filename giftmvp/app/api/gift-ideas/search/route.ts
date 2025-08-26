import { NextResponse } from "next/server";
import { monetizeUrl } from "@/lib/affiliate";

// Very simple seed list; in production you'd search a catalog or use LLM-augmented retrieval
const SEED: any[] = [
  { title: "Aromatherapy Diffuser", url: "https://www.amazon.com/", image_url: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=640", price_cents: 2999, merchant: "Amazon", tags: ["home", "relaxation"] },
  { title: "Chef’s Knife", url: "https://www.williams-sonoma.com/", image_url: "https://images.unsplash.com/photo-1544025162-d76694265947?w=640", price_cents: 7999, merchant: "Williams-Sonoma", tags: ["kitchen", "cooking"] },
  { title: "Trail Daypack", url: "https://www.rei.com/", image_url: "https://images.unsplash.com/photo-1514477917009-389c76a86b68?w=640", price_cents: 6499, merchant: "REI", tags: ["outdoors", "hiking"] },
  { title: "Pour-Over Coffee Kit", url: "https://www.bluebottlecoffee.com/", image_url: "https://images.unsplash.com/photo-1507133750040-4a8f5702153a?w=640", price_cents: 5599, merchant: "Blue Bottle", tags: ["coffee"] }
];

export async function POST(req: Request) {
  const brief = await req.json().catch(() => ({}));
  let ideas = SEED;

  // Naive filter by budget
  const min = Number(brief.budgetMin ?? 0);
  const max = Number(brief.budgetMax ?? 999999);
  ideas = ideas.filter((x) => x.price_cents >= min*100 && x.price_cents <= max*100);

  // Attach affiliate URLs
  ideas = ideas.map((x) => ({
    ...x,
    affiliate_url: monetizeUrl(x.url),
  }));

  return NextResponse.json({ ideas });
}