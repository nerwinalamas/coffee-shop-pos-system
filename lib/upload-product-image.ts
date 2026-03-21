import { SupabaseClient } from "@supabase/supabase-js";
import { compressImage } from "@/lib/compress-image";
import { ProductImage } from "@/types/product.types";

type UploadProductImageOptions = {
  supabase: SupabaseClient;
  file: File;
  businessId: string;
  /** URL of the old image to delete from storage before uploading */
  previousImageUrl?: string;
};

/**
 * Compresses and uploads a product image to Supabase Storage.
 * Returns a ProductImage object to be stored as jsonb on the products table.
 */
export async function uploadProductImage({
  supabase,
  file,
  businessId,
  previousImageUrl,
}: UploadProductImageOptions): Promise<ProductImage> {
  // 1. Delete old image from storage if replacing
  if (previousImageUrl) {
    const marker = "/product_images/";
    const idx = previousImageUrl.indexOf(marker);
    if (idx !== -1) {
      const storagePath = previousImageUrl.slice(idx + marker.length);
      await supabase.storage.from("product_images").remove([storagePath]);
    }
  }

  // 2. Compress
  const compressed = await compressImage(file);

  // 3. Build storage path: {businessId}/{timestamp}-{random}.jpg
  const storagePath = `${businessId}/${Date.now()}-${Math.random()
    .toString(36)
    .substring(7)}.jpg`;

  // 4. Upload to storage
  const { data, error } = await supabase.storage
    .from("product_images")
    .upload(storagePath, compressed, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) throw error;

  // 5. Get public URL
  const {
    data: { publicUrl },
  } = supabase.storage.from("product_images").getPublicUrl(data.path);

  return {
    file_name: file.name,
    file_size: compressed.size,
    mime_type: compressed.type,
    url: publicUrl,
  };
}
