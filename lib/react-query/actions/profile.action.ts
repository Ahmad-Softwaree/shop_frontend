"use server";

import { auth } from "@/auth";
import { URLs } from "@/lib/urls";
import { handleServerError } from "@/lib/error-handler";
import { unAuthorized } from "./auth.action";
import { update } from "@/lib/config/api.config";

export type CRUDReturn = { message: string; data?: any };

export const updateProfile = async (form: {
  name: string;
  email: string;
}): Promise<CRUDReturn> => {
  try {
    await unAuthorized();
    let session = await auth();
    const { data } = await update(
      URLs.UPDATE_PROFILE(session?.user?.id || ""),
      form
    );
    return data;
  } catch (error) {
    handleServerError(error);
  }
};
