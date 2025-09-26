export interface RoleLike {
  id?: number;
}

export interface UserLike {
  role?: RoleLike | null;
  role_id?: number | null;
}

export interface ProductLike {
  id: number;
  name?: string;
  price: string | number;
  price_tiers?: Array<{
    id: number | string;
    name?: string;
    discount_off_retail_price?: string | number;
    pivot?: {
      price_adjustment?: string | number;
      is_active?: number | boolean;
    } | null;
  }>;
}

/**
 * Compute the effective base price for a product for a given user.
 * Prefers a matching price tier by user role; falls back to any tier with pivot.price_adjustment; otherwise returns product.price.
 */
export function getEffectiveProductPrice(product: ProductLike, user: UserLike | null | undefined): number {
  const base = safeNumber(product?.price);
  const tiers = Array.isArray(product?.price_tiers) ? product!.price_tiers! : [];
  if (!tiers.length) return base;

  const roleId = typeof user?.role?.id !== 'undefined' && user?.role?.id !== null
    ? Number(user!.role!.id)
    : (typeof user?.role_id !== 'undefined' && user?.role_id !== null ? Number(user!.role_id) : null);

  // Try exact role match first
  if (roleId !== null) {
    const match = tiers.find(t => Number(t.id) === Number(roleId));
    if (match?.pivot?.price_adjustment != null) {
      const adj = safeNumber(match.pivot.price_adjustment);
      if (!isNaN(adj) && adj > 0) return adj;
    }
  }

  // Fallback: any tier with a pivot price_adjustment
  for (const t of tiers) {
    if (t?.pivot?.price_adjustment != null) {
      const adj = safeNumber(t.pivot.price_adjustment);
      if (!isNaN(adj) && adj > 0) return adj;
    }
  }

  return base;
}

export function safeNumber(value: any): number {
  if (value == null) return 0;
  if (typeof value === 'number') return value;
  const n = parseFloat(String(value).replace(/[$,]/g, ''));
  return isNaN(n) ? 0 : n;
} 