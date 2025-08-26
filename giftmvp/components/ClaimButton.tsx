'use client';
import { useState } from "react";

export default function ClaimButton({ itemId }: { itemId: string }) {
  const [claimed, setClaimed] = useState(false);
  const [loading, setLoading] = useState(false);
  async function claim() {
    setLoading(true);
    try {
      const name = prompt("Your name (optional)") || undefined;
      const email = prompt("Your email (optional)") || undefined;
      const res = await fetch('/api/claim', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ itemId, name, email }) });
      if (!res.ok) throw new Error('Failed');
      setClaimed(true);
    } finally {
      setLoading(false);
    }
  }
  return (
    <button className="btn btn-primary" disabled={claimed || loading} onClick={claim}>
      {claimed ? 'Claimed' : (loading ? 'Claiming...' : 'Claim')}
    </button>
  );
}