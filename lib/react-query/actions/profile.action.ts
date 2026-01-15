"use server";

import { auth } from "@/auth";

export type CRUDReturn = { message: string; data?: any };

export const updateProfile = async (form: {
  name: string;
  email: string;
}): Promise<CRUDReturn> => {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      throw new Error("errors.unauthorized");
    }

    // TODO: implement axios backend request here
    // const response = await axios.put(`/api/users/${session.user.id}`, form);
    // return response.data;
    throw new Error("Not implemented");
  } catch (error) {
    throw new Error("errors.profileUpdateFailed");
  }
};
