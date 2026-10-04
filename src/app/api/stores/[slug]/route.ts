import { NextResponse } from "next/server";
import { deleteOwnedStore, findOwnedStore, updateOwnedStore } from "@/lib/supabase/store-repository";
import { validateBlueprint } from "@/lib/blueprint/validate";
import type { Catalog } from "@/lib/samples/catalog";

type Context = { params: Promise<{ slug: string }> };

export async function GET(_request: Request, { params }: Context) {
  try {
    const store = await findOwnedStore((await params).slug);
    if (!store) return NextResponse.json({ error: "Store not found." }, { status: 404 });
    return NextResponse.json(store);
  } catch (error) {
    console.error("Unable to load owned store.", error);
    const message = error instanceof Error ? error.message : "Unable to load store.";
    return NextResponse.json({ error: message }, { status: message === "Authentication is required." ? 401 : 500 });
  }
}

export async function PATCH(request: Request, { params }: Context) {
  try {
    const { slug } = await params;
    const body = await request.json() as {
      blueprint?: unknown;
      catalog?: unknown;
      name?: string;
      description?: string | null;
      status?: "DRAFT" | "PUBLISHED" | "SUSPENDED";
    };
    const update: Parameters<typeof updateOwnedStore>[1] = {
      name: body.name,
      description: body.description,
      status: body.status,
    };
    if (body.blueprint !== undefined) {
      const result = validateBlueprint(body.blueprint);
      if (!result.ok) return NextResponse.json({ error: "Invalid blueprint." }, { status: 400 });
      update.blueprint = result.blueprint;
    }
    if (body.catalog !== undefined) update.catalog = body.catalog as Catalog;
    return NextResponse.json(await updateOwnedStore(slug, update));
  } catch (error) {
    console.error("Unable to update owned store.", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to update store." }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: Context) {
  try {
    await deleteOwnedStore((await params).slug);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Unable to delete owned store.", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to delete store." }, { status: 500 });
  }
}
