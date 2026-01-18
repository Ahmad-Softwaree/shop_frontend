"use server";

import { revalidatePath } from "next/cache";
import { del } from "../config/api.config";
import { ENUMs } from "../enums";

export async function deleteOldImage(
  table: string,
  bucket: string,
  id: number
): Promise<{ success: boolean; message?: string }> {
  try {
    await del(
      `/shared/delete_old_image?table=${table}&bucket=${bucket}&id=${id}`,
      ""
    );
    revalidatePath(ENUMs.PAGES.PRODUCTS);
    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to delete image",
    };
  }
}
