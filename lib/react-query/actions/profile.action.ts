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
    const authCheck = await unAuthorized();
    if (authCheck && (authCheck as any).__isError) return authCheck as any;

    let session = await auth();
    const result = await update(
      URLs.UPDATE_PROFILE(session?.user?.id || ""),
      form
    );
    if (result && (result as any).__isError) return result as any;

    return result.data;
  } catch (error) {
    return handleServerError(error) as any;
  }
};
