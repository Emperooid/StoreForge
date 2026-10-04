import type { StoreBlueprint } from "@/lib/blueprint/schema";
import type { Catalog } from "@/lib/samples/catalog";
import { validateBlueprint } from "@/lib/blueprint/validate";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export interface ServerStore {
  id: string;
  ownerId: string;
  slug: string;
  name: string;
  description: string | null;
  industry: string;
  status: "DRAFT" | "PUBLISHED" | "SUSPENDED";
  blueprint: StoreBlueprint;
  catalog: Catalog;
  createdAt: string;
  updatedAt: string;
}

type StoreRow = {
  id: string;
  owner_id: string;
  slug: string;
  name: string;
  description: string | null;
  industry: string;
  status: "DRAFT" | "PUBLISHED" | "SUSPENDED";
  blueprint: unknown;
  catalog: unknown;
  created_at: string;
  updated_at: string;
};

function parseStore(row: StoreRow): ServerStore {
  const result = validateBlueprint(row.blueprint);
  if (!result.ok || !row.catalog) {
    throw new Error("Stored store data failed blueprint validation.");
  }
  return {
    id: row.id,
    ownerId: row.owner_id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    industry: row.industry,
    status: row.status,
    blueprint: result.blueprint,
    catalog: row.catalog as Catalog,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function listOwnedStores() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("stores")
    .select("*")
    .order("updated_at", { ascending: false });
  if (error) throw new Error(`Unable to load stores: ${error.message}`);
  return (data ?? []).map(parseStore);
}

export async function findOwnedStore(slug: string) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("stores")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw new Error(`Unable to load store: ${error.message}`);
  return data ? parseStore(data) : null;
}

export async function findOwnedStoreId(slug: string) {
  const store = await findOwnedStore(slug);
  return store?.id ?? null;
}

export async function findPublishedStore(slug: string) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("stores")
    .select("*")
    .eq("slug", slug)
    .eq("status", "PUBLISHED")
    .maybeSingle();
  if (error) throw new Error(`Unable to load storefront: ${error.message}`);
  return data ? parseStore(data) : null;
}

export async function createOwnedStore(input: {
  blueprint: StoreBlueprint;
  catalog: Catalog;
  status?: "DRAFT" | "PUBLISHED";
}) {
  const supabase = await createSupabaseServerClient();
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData.user) throw new Error("Authentication is required.");
  const { data, error } = await supabase
    .from("stores")
    .insert({
      owner_id: authData.user.id,
      slug: input.blueprint.store.slug,
      name: input.blueprint.store.name,
      description: input.blueprint.store.description ?? null,
      industry: input.blueprint.store.industry,
      status: input.status ?? "DRAFT",
      blueprint: input.blueprint,
      catalog: input.catalog,
    })
    .select("*")
    .single();
  if (error) throw new Error(`Unable to create store: ${error.message}`);
  return parseStore(data);
}

export async function updateOwnedStore(
  slug: string,
  input: Partial<Pick<ServerStore, "name" | "description" | "status">> & {
    blueprint?: StoreBlueprint;
    catalog?: Catalog;
  },
) {
  const supabase = await createSupabaseServerClient();
  const update: Record<string, unknown> = {};
  if (input.name !== undefined) update.name = input.name;
  if (input.description !== undefined) update.description = input.description;
  if (input.status !== undefined) update.status = input.status;
  if (input.blueprint !== undefined) {
    update.blueprint = input.blueprint;
    update.name = input.blueprint.store.name;
    update.description = input.blueprint.store.description ?? null;
    update.industry = input.blueprint.store.industry;
  }
  if (input.catalog !== undefined) update.catalog = input.catalog;

  const { data, error } = await supabase
    .from("stores")
    .update(update)
    .eq("slug", slug)
    .select("*")
    .single();
  if (error) throw new Error(`Unable to update store: ${error.message}`);
  return parseStore(data);
}

export async function deleteOwnedStore(slug: string) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("stores").delete().eq("slug", slug);
  if (error) throw new Error(`Unable to delete store: ${error.message}`);
}
