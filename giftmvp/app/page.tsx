'use client';

import { useState } from 'react';
import { z } from 'zod';

const BriefSchema = z.object({
  giftee: z.string().min(2),
  relationship: z.string().optional(),
  occasion: z.string().optional(),
  budgetMin: z.number().min(0).default(0),
  budgetMax: z.number().min(5),
  interests: z.string().optional(),
  constraints: z.string().optional(),
});

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [ideas, setIdeas] = useState<any[]>([]);

  async function generateIdeas(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const payload = {
      giftee: String(form.get('giftee') || ''),
      relationship: String(form.get('relationship') || ''),
      occasion: String(form.get('occasion') || ''),
      budgetMin: Number(form.get('budgetMin') || 0),
      budgetMax: Number(form.get('budgetMax') || 150),
      interests: String(form.get('interests') || ''),
      constraints: String(form.get('constraints') || ''),
    };
    const parsed = BriefSchema.safeParse(payload);
    if (!parsed.success) {
      alert('Please complete the required fields.'); return;
    }
    setLoading(true);
    try {
      // For MVP, this calls a simple heuristic search/curation stub.
      const res = await fetch('/api/gift-ideas/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data),
      });
      const data = await res.json();
      setIdeas(data.ideas || []);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-6">
      <div className="card">
        <h1 className="text-2xl font-semibold mb-2">Find a great gift</h1>
        <p className="text-gray-600 mb-4">Tell us a little about who you’re shopping for.</p>
        <form onSubmit={generateIdeas} className="grid gap-3">
          <div>
            <div className="label">Who are you shopping for? *</div>
            <input name="giftee" className="input" placeholder="e.g., My sister" required />
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <div className="label">Relationship</div>
              <input name="relationship" className="input" placeholder="sister, friend, coworker..." />
            </div>
            <div>
              <div className="label">Occasion</div>
              <input name="occasion" className="input" placeholder="birthday, wedding..." />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <div className="label">Budget min ($)</div>
              <input type="number" name="budgetMin" className="input" defaultValue={25} min={0} />
            </div>
            <div>
              <div className="label">Budget max ($)*</div>
              <input type="number" name="budgetMax" className="input" defaultValue={150} min={5} required />
            </div>
          </div>
          <div>
            <div className="label">Interests</div>
            <input name="interests" className="input" placeholder="hiking, cooking, gaming..." />
          </div>
          <div>
            <div className="label">Constraints</div>
            <input name="constraints" className="input" placeholder="vegan, ships to Canada, no leather..." />
          </div>
          <div className="flex gap-2">
            <button className="btn btn-primary" type="submit" disabled={loading}>{loading ? 'Finding...' : 'Find gifts'}</button>
            <a className="btn" href="/dashboard">Create a wishlist</a>
          </div>
        </form>
      </div>

      {ideas.length > 0 && (
        <div className="grid gap-3">
          <h2 className="text-xl font-semibold">Suggested gifts</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {ideas.map((it, i) => (
              <a key={i} className="card hover:shadow-lg transition" href={it.affiliate_url || it.url} target="_blank">
                <div className="flex gap-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={it.image_url} alt={it.title} className="w-24 h-24 rounded-xl object-cover" />
                  <div>
                    <div className="font-medium">{it.title}</div>
                    <div className="text-gray-600 text-sm">{it.merchant}</div>
                    <div className="text-sm mt-1">${(it.price_cents/100).toFixed(2)}</div>
                    <div className="mt-2 flex gap-2 flex-wrap">
                      {it.tags?.slice(0,3).map((t: string) => <span key={t} className="badge">{t}</span>)}
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}