import { NextResponse } from "next/server";
import { uploadStoreImage } from "@/lib/media/supabase-storage";
import { findOwnedStoreId } from "@/lib/supabase/store-repository";

export async function POST(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const storeId = await findOwnedStoreId((await params).slug);
    if (!storeId) return NextResponse.json({ error: "Store not found." }, { status: 404 });
    const formData = await request.formData();
    const file = formData.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "An image file is required." }, { status: 400 });
    }
    return NextResponse.json({
      url: await uploadStoreImage({ storeId, file, filename: file.name }),
    });
  } catch (error) {
    console.error("Unable to upload store image.", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to upload image." }, { status: 500 });
  }
}
