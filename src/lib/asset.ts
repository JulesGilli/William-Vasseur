/**
 * Resolve a file living in /public against the deployment base path.
 * On GitHub Pages the site is served from /William-Vasseur/, so a bare
 * "/image.jpg" would 404 — import.meta.env.BASE_URL carries the right prefix.
 */
export function asset(path: string): string {
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;
}
