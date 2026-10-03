"use client";

import { useEffect, useState } from "react";
import type { StoreBlueprint } from "@/lib/blueprint/schema";
import type { Catalog } from "@/lib/samples/catalog";
import { loadStore } from "@/lib/store-storage";
import { StorePage } from "./StorePage";

export function StoredStorePage({
  slug,
  blueprint,
  catalog,
  pageSlug = "/",
}: {
  slug: string;
  blueprint: StoreBlueprint;
  catalog: Catalog;
  pageSlug?: string;
}) {
  const [stored, setStored] = useState<{ blueprint: StoreBlueprint; catalog: Catalog } | null>(null);

  useEffect(() => {
    const saved = loadStore(slug);
    if (saved) setStored({ blueprint: saved.blueprint, catalog: saved.catalog });
  }, [slug]);

  const current = stored ?? { blueprint, catalog };
  return <StorePage blueprint={current.blueprint} catalog={current.catalog} pageSlug={pageSlug} />;
}
