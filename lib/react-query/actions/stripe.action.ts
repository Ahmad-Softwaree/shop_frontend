import { post } from "../../config/api.config";
import { ENUMs } from "../../enums";
import { handleServerError } from "../../error-handler";
import { unAuthorized } from "./auth.action";
import { URLs } from "../../urls";

export const checkout = async (
  productId: number
): Promise<{ url?: string }> => {
  try {
    await unAuthorized();
    const data = await post<{ url?: string }>(
      `${URLs.CHECKOUT}`,
      { productId },
      {
        tags: [ENUMs.TAGS.PRODUCTS],
      }
    );
    return data;
  } catch (error) {
    handleServerError(error);
  }
};
