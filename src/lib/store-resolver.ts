import { generateBlueprint } from "@/lib/blueprint/generate";
import { makeStarterCatalog, type Catalog } from "@/lib/samples/catalog";
import { samples } from "@/lib/samples/stores";
import type { StoreBlueprint } from "@/lib/blueprint/schema";

export interface ResolvedStore {
  blueprint: StoreBlueprint;
  catalog: Catalog;
}

export function resolveStore(slug: string): ResolvedStore | null {
  const sample = samples.find((candidate) => candidate.blueprint.store.slug === slug);
  if (sample) return sample;

  const name = slug
    .split("-")
    .filter(Boolean)
    .map((word) => word[0]?.toUpperCase() + word.slice(1))
    .join(" ");
  const result = generateBlueprint({
    name: name || "My Store",
    industry: "fashion",
    style: "premium",
  });

  if (!result.ok || result.blueprint.store.slug !== slug) return null;

  return {
    blueprint: result.blueprint,
    catalog: makeStarterCatalog(slug, "fashion"),
  };
}