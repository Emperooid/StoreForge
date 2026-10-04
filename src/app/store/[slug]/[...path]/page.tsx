import { notFound } from "next/navigation";
import { samples } from "@/lib/samples/stores";
import { StoredStorePage } from "@/components/store/StoredStorePage";
import { resolveStore } from "@/lib/store-resolver";
import { ProductDetail } from "@/components/store/ProductDetail";
import { CartPage } from "@/components/store/CartPage";
import { ShopPage } from "@/components/store/ShopPage";
import { CheckoutPage } from "@/components/store/CheckoutPage";
import { findPublishedStore } from "@/lib/supabase/store-repository";

export default async function StoreSubpage({
  params,
}: {
  params: Promise<{ slug: string; path: string[] }>;
}) {
  const { slug, path } = await params;
  let sample = resolveStore(slug);
  try {
    const published = await findPublishedStore(slug);
    if (published) sample = { blueprint: published.blueprint, catalog: published.catalog };
  } catch (error) {
    console.warn("Supabase storefront lookup unavailable; using demo resolver.", error);
  }

  if (!sample || path.length === 0) {
    notFound();
  }

  if (path[0] === "cart") {
    return <CartPage storeSlug={slug} currency={sample.blueprint.ecommerce.currency} />;
  }

  if (path[0] === "shop") {
    return <ShopPage storeSlug={slug} initialCatalog={sample.catalog} currency={sample.blueprint.ecommerce.currency} />;
  }

  if (path[0] === "checkout") {
    return <CheckoutPage storeSlug={slug} currency={sample.blueprint.ecommerce.currency} />;
  }

  if (path[0] === "product" && path[1]) {
    const product = sample.catalog.products.find((candidate) => candidate.id === path[1]);
    if (!product) notFound();
    return (
      <ProductDetail
        product={product}
        currency={sample.blueprint.ecommerce.currency}
        storeSlug={slug}
      />
    );
  }

  return (
    <StoredStorePage
      slug={slug}
      blueprint={sample.blueprint}
      catalog={sample.catalog}
      pageSlug={`/${path.join("/")}`}
    />
  );
}

export function generateStaticParams() {
  return samples.flatMap((sample) => {
    const configuredPages = sample.blueprint.pages
      .filter((page) => page.slug !== "/")
      .map((page) => ({
        slug: sample.blueprint.store.slug,
        path: page.slug.split("/").filter(Boolean),
      }));

    const navigationPages = sample.blueprint.navigation.links
      .map((link) => link.href.split("/").filter(Boolean))
      .filter((segments) => segments.length > 0)
      .map((path) => ({ slug: sample.blueprint.store.slug, path }));

    return [...configuredPages, ...navigationPages];
  });
}

export const dynamicParams = true;
export const dynamic = "force-dynamic";
