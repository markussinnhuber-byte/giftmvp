export type GiftIdea = {
  id: string;
  title: string;
  url: string;
  merchant?: string | null;
  image_url?: string | null;
  price_cents?: number | null;
  affiliate_url?: string | null;
  tags?: string[];
};