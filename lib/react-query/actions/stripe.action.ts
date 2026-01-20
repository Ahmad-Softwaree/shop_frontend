"use server";
import { post } from "../../config/api.config";
import { ENUMs } from "../../enums";
import { handleServerError } from "../../error-handler";
import { unAuthorized } from "./auth.action";
import { URLs } from "../../urls";

export const checkout = async (
  productId: number
): Promise<{ url?: string }> => {
  try {
    const authCheck = await unAuthorized();
    if (authCheck && (authCheck as any).__isError) return authCheck as any;

    const data = await post<{ url?: string }>(
      `${URLs.CHECKOUT}`,
      { productId },
      {
        tags: [ENUMs.TAGS.PRODUCTS],
      }
    );
    if (data && (data as any).__isError) return data;
    return data;
  } catch (error) {
    return handleServerError(error) as any;
  }
};
