/**
 * Joins NEXT_PUBLIC_BASE_URL_Images with a stored image path.
 *
 * Bug this fixes: every call site used to do
 *   process.env.NEXT_PUBLIC_BASE_URL_Images + product.imageUrl
 * directly. Seeded/uploaded paths are stored WITHOUT a leading slash
 * (e.g. "f1.png"), so that concatenation produced invalid URLs like
 * "http://localhost:5300f1.png" and crashed next/image at runtime
 * ("Unhandled Runtime Error: Failed to parse src").
 */
export const getImageUrl = (path?: string | null): string => {
  const base = process.env.NEXT_PUBLIC_BASE_URL_Images || "";
  if (!path) {
    return base;
  }
  const normalizedBase = base.endsWith("/") ? base.slice(0, -1) : base;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${normalizedBase}${normalizedPath}`;
};

export default getImageUrl;
