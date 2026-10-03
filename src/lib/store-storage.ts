import type { StoreBlueprint } from "@/lib/blueprint/schema";
import type { Catalog } from "@/lib/samples/catalog";
import { validateBlueprint } from "@/lib/blueprint/validate";

const STORAGE_PREFIX = "storeforge:store:";

export interface StoredStore {
  blueprint: StoreBlueprint;
  catalog: Catalog;
  savedAt: string;
  status: "DRAFT" | "PUBLISHED";
}

function storageKey(slug: string) {
  return `${STORAGE_PREFIX}${slug}`;
}

export function listStoredStores(): StoredStore[] {
  if (typeof window === "undefined") return [];

  const stores: StoredStore[] = [];
  try {
    for (let index = 0; index < localStorage.length; index += 1) {
      const key = localStorage.key(index);
      if (!key?.startsWith(STORAGE_PREFIX)) continue;

      const raw = localStorage.getItem(key);
      if (!raw) continue;
      const parsed = JSON.parse(raw) as Partial<StoredStore>;
      const blueprintResult = validateBlueprint(parsed.blueprint);
      if (blueprintResult.ok && parsed.catalog && parsed.savedAt) {
        stores.push({ ...parsed, blueprint: blueprintResult.blueprint, status: parsed.status === "PUBLISHED" ? "PUBLISHED" : "DRAFT" } as StoredStore);
      }
    }
  } catch (error) {
    console.error("Unable to list generated stores from local storage.", error);
  }

  return stores.sort((a, b) => b.savedAt.localeCompare(a.savedAt));
}

export function deleteStore(slug: string): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(storageKey(slug));
}

export function saveStore(store: Omit<StoredStore, "savedAt">): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(
      storageKey(store.blueprint.store.slug),
      JSON.stringify({ ...store, savedAt: new Date().toISOString(), status: store.status ?? "DRAFT" }),
    );
  } catch (error) {
    console.error("Unable to save generated store locally.", error);
  }
}

export function loadStore(slug: string): StoredStore | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem(storageKey(slug));
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Partial<StoredStore>;
    const blueprintResult = validateBlueprint(parsed.blueprint);
    if (!blueprintResult.ok || !parsed.catalog) return null;
    return { ...parsed, blueprint: blueprintResult.blueprint, status: parsed.status === "PUBLISHED" ? "PUBLISHED" : "DRAFT" } as StoredStore;
  } catch (error) {
    console.error(`Unable to load generated store "${slug}" from local storage.`, error);
    return null;
  }
}

export function exportStore(store: StoredStore): void {
    if (typeof window === "undefined") return;
    const blob = new Blob([JSON.stringify(store, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${store.blueprint.store.slug}.storeforge.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

export async function importStore(file: File): Promise<StoredStore> {
    const parsed = JSON.parse(await file.text()) as Partial<StoredStore>;
    const blueprintResult = validateBlueprint(parsed.blueprint);
    if (!blueprintResult.ok || !parsed.catalog) {
      throw new Error("This file is not a valid StoreForge store export.");
    }
    const store: StoredStore = {
      blueprint: blueprintResult.blueprint,
      catalog: parsed.catalog,
      savedAt: new Date().toISOString(),
      status: parsed.status === "PUBLISHED" ? "PUBLISHED" : "DRAFT",
    };
    saveStore(store);
    return store;
}
