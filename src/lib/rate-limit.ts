const buckets = new Map<string, { count: number; resetAt: number }>();

/** Best effort local limiter. En producción compleméntalo con Netlify WAF/rate limiting. */
export function isRateLimited(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const bucket = buckets.get(key);
  if (!bucket || now > bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }
  bucket.count += 1;
  return bucket.count > limit;
}
