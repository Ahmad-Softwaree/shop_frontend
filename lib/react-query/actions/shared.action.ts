"use server";

import { del } from "../../config/api.config";
import { TAGs } from "../../enums";
import { handleServerError } from "../../error-handler";
import { URLs } from "../../urls";

export async function deleteOldImage(
  table: string,
  bucket: string,
  id: number,
  tags: TAGs[]
): Promise<{ success: boolean; message?: string }> {
  try {
    const result = await del(
      `${URLs.DELETE_OLD_IMAGE}?table=${table}&bucket=${bucket}&id=${id}`,
      "",
      { tags }
    );
    if (result && (result as any).__isError) return result as any;
    return { success: true };
  } catch (error: any) {
    return handleServerError(error) as any;
  }
}
