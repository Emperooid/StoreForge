import { NextResponse } from "next/server";
import { listOwnedStores, createOwnedStore } from "@/lib/supabase/store-repository";
import { validateBlueprint } from "@/lib/blueprint/validate";
import type { Catalog } from "@/lib/samples/catalog";

export async function GET() {
  try {
    return NextResponse.json(await listOwnedStores());
  } catch (error) {
    console.error("Unable to list owned stores.", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to load stores." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as { blueprint?: unknown; catalog?: unknown; status?: "DRAFT" | "PUBLISHED" };
    const blueprint = validateBlueprint(body.blueprint);
    if (!blueprint.ok || !body.catalog) {
      return NextResponse.json({ error: "A valid blueprint and catalog are required." }, { status: 400 });
    }
    return NextResponse.json(await createOwnedStore({
      blueprint: blueprint.blueprint,
      catalog: body.catalog as Catalog,
      status: body.status,
    }), { status: 201 });
  } catch (error) {
    console.error("Unable to create owned store.", error);
    const message = error instanceof Error ? error.message : "Unable to create store.";
    return NextResponse.json({ error: message }, { status: message === "Authentication is required." ? 401 : 500 });
  }
}
