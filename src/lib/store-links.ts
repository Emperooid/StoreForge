export function storePath(slug: string, href: string): string {
  if (!href || href === "#") return href;
  if (/^(https?:|mailto:|tel:)/.test(href)) return href;

  const path = href.startsWith("/") ? href : `/${href}`;
  return path === "/" ? `/store/${slug}` : `/store/${slug}${path}`;
}
