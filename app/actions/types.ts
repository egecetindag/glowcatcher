export const CATEGORIES = [
  "Skincare",
  "Makeup",
  "Haircare",
  "Fragrance",
  "Tools",
  "Health",
];

export type Deal = {
  id: string;
  slug: string;
  title: string;
  store: string;
  price: number;
  original_price: number | null;
  url: string;
  image_url: string | null;
  voucher_code: string | null;
  description: string | null;
  category: string | null;
  expires_at: string | null;
  profiles: { username: string | null } | null;
};
