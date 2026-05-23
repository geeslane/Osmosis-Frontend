/** Mentee call rating on a 1–5 scale (integer for display). */
export function normalizeCallRating(value: unknown): number | null {
  if (value == null || value === '') return null;
  const n = typeof value === 'number' ? value : Number(value);
  if (Number.isNaN(n)) return null;
  const rounded = Math.round(n);
  if (rounded >= 1 && rounded <= 5) return rounded;
  return null;
}
