import { notFound } from "next/navigation";
import { samples } from "@/lib/samples/stores";
import { StoredStorePage } from "@/components/store/StoredStorePage";
import { resolveStore } from "@/lib/store-resolver";
import { findPublishedStore } from "@/lib/supabase/store-repository";

/**
 * Multi-tenant store route: /store/<slug>
 *
 * In production this resolves the slug against the database (domain -> storeId
 * -> blueprint + catalog). Here it resolves against the in-memory samples.
 */
export default async function StoreRoute({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let sample = resolveStore(slug);
  try {
    const published = await findPublishedStore(slug);
    if (published) sample = { blueprint: published.blueprint, catalog: published.catalog };
  } catch (error) {
    console.warn("Supabase storefront lookup unavailable; using demo resolver.", error);
  }

  if (!sample) {
    notFound();
  }

  return <StoredStorePage slug={slug} blueprint={sample.blueprint} catalog={sample.catalog} pageSlug="/" />;
}

export function generateStaticParams() {
  return samples.map((s) => ({ slug: s.blueprint.store.slug }));
}

export const dynamicParams = true;
export const dynamic = "force-dynamic";
