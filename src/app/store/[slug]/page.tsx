import { notFound } from "next/navigation";
import { samples } from "@/lib/samples/stores";
import { StoredStorePage } from "@/components/store/StoredStorePage";
import { resolveStore } from "@/lib/store-resolver";

/**
 * Multi-tenant store route: /store/<slug>
 *
 * In production this resolves the slug against the database (domain -> storeId
 * -> blueprint + catalog). Here it resolves against the in-memory samples.
 */
export default async function StoreRoute({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const sample = resolveStore(slug);

  if (!sample) {
    notFound();
  }

  return <StoredStorePage slug={slug} blueprint={sample.blueprint} catalog={sample.catalog} pageSlug="/" />;
}

export function generateStaticParams() {
  return samples.map((s) => ({ slug: s.blueprint.store.slug }));
}

export const dynamicParams = true;
