import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function uploadStoreImage(input: {
  storeId: string;
  file: File;
  filename: string;
}) {
  if (!input.file.type.startsWith("image/")) throw new Error("Only image uploads are supported.");
  if (input.file.size > 5 * 1024 * 1024) throw new Error("Images must be 5 MB or smaller.");

  const supabase = createSupabaseAdminClient();
  const path = `${input.storeId}/${crypto.randomUUID()}-${input.filename.replace(/[^a-zA-Z0-9._-]/g, "-")}`;
  const { error } = await supabase.storage.from("store-media").upload(path, input.file, {
    contentType: input.file.type,
    upsert: false,
  });
  if (error) throw new Error(`Image upload failed: ${error.message}`);
  const { data } = supabase.storage.from("store-media").getPublicUrl(path);
  return data.publicUrl;
}
