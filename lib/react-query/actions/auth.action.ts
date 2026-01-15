"use server";
import { auth, signIn, signOut } from "@/auth";
import { ChangePasswordSchema } from "@/validation/change_password.validation";
import { LoginSchema } from "@/validation/login.validation";
import { PasswordResetSchema } from "@/validation/password_reset.validation";
import { ProfileSchema } from "@/validation/profile.validation";
import { RegisterSchema } from "@/validation/register.validation";
import { UpdatePasswordSchema } from "@/validation/update_password.validation";
import bcrypt, { hash } from "bcryptjs";
import { randomBytes } from "crypto";
import { Resend } from "resend";
import { toast } from "sonner";
import { generateSecret, generate, verify, generateURI } from "otplib";
export const getAuth = async () => {
  try {
    let session = await auth();
    if (!session?.user?.id) {
      throw new Error("errors.unauthorized");
    }
    // TODO: implement axios backend request here
    // const user = await axios.get(`/api/users/${session.user.id}`);
    // return user.data;
    return { twoFactorAuthEnabled: false };
    throw new Error("Not implemented");
  } catch (error: any) {
    throw toast.error("errors.unauthorized");
  }
};
export const register = async (data: RegisterSchema) => {
  try {
    // TODO: implement axios backend request here
    // const response = await axios.post('/api/auth/register', data);
    // return response.data;
    throw new Error("Not implemented");
  } catch (error: any) {
    if (error.response?.status === 409) {
      throw new Error("errors.emailInUse");
    }
    throw error;
  }
};
export const login = async (data: LoginSchema) => {
  try {
    // TODO: implement axios backend request here
    // const response = await axios.post('/api/auth/login', data);
    // const user = response.data;
    // if (user.twoFactorAuthEnabled) {
    //   return { requires2FA: true };
    // }
    // await signIn("credentials", {
    //   email: data.email,
    //   password: data.password,
    //   redirect: false,
    // });
    // return user;
    throw new Error("Not implemented");
  } catch (error: any) {
    throw error;
  }
};
export const checkLoginOtp = async (form: {
  code: string;
  email: string;
  password: string;
}) => {
  try {
    // TODO: implement axios backend request here
    // const response = await axios.post('/api/auth/verify-2fa', form);
    // const user = response.data;
    // await signIn("credentials", {
    //   email: form.email,
    //   password: form.password,
    //   token: form.code,
    //   redirect: false,
    // });
    // return user;
    throw new Error("Not implemented");
  } catch (error: any) {
    throw error;
  }
};

export const updateProfile = async (data: ProfileSchema) => {
  try {
    let session = await auth();
    // TODO: implement axios backend request here
    // const response = await axios.put(`/api/users/${session?.user?.id}`, data);
    // return response.data;
    throw new Error("Not implemented");
  } catch (error: any) {
    throw error;
  }
};
export const logout = async () => {
  try {
    await signOut({
      redirect: false,
    });
    return true;
  } catch (error: any) {
    throw error;
  }
};

export const changePassword = async (
  form: ChangePasswordSchema
): Promise<{ message: string; data?: any }> => {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      throw new Error("errors.unauthorized");
    }

    // TODO: implement axios backend request here
    // const response = await axios.post('/api/auth/change-password', form);
    // return response.data;
    throw new Error("Not implemented");
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("errors.passwordChangeFailed");
  }
};

export const passwordReset = async (form: PasswordResetSchema) => {
  try {
    let session = await auth();
    if (!!session?.user?.id) {
      throw new Error("errors.alreadyLoggedIn");
    }

    // TODO: implement axios backend request here
    // const response = await axios.post('/api/auth/password-reset', form);
    // return response.data;
    return true;
  } catch (error: any) {
    throw error;
  }
};

export const updatePassword = async (
  form: UpdatePasswordSchema & { token: string }
) => {
  try {
    // TODO: implement axios backend request here
    // const response = await axios.post('/api/auth/update-password', form);
    // return response.data;
    throw new Error("Not implemented");
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("errors.updatePasswordFailed");
  }
};

export const get2FASecret = async () => {
  try {
    let session = await auth();
    if (!session?.user?.id) {
      throw new Error("errors.unauthorized");
    }
    // TODO: implement axios backend request here
    // const response = await axios.get('/api/auth/2fa/secret');
    // return response.data.secret;
    throw new Error("Not implemented");
  } catch (error: any) {
    throw toast.error("errors.unauthorized");
  }
};

export const activate2FA = async ({ code }: { code: string }) => {
  try {
    let session = await auth();
    if (!session?.user?.id) {
      throw new Error("errors.unauthorized");
    }
    // TODO: implement axios backend request here
    // const response = await axios.post('/api/auth/2fa/activate', { code });
    // return response.data;
    throw new Error("Not implemented");
  } catch (error: any) {
    throw toast.error("errors.unauthorized");
  }
};

export const deactivate2FA = async () => {
  try {
    let session = await auth();
    if (!session?.user?.id) {
      throw new Error("errors.unauthorized");
    }
    // TODO: implement axios backend request here
    // const response = await axios.post('/api/auth/2fa/deactivate');
    // return response.data;
    throw new Error("Not implemented");
  } catch (error: any) {
    throw toast.error("errors.unauthorized");
  }
};
