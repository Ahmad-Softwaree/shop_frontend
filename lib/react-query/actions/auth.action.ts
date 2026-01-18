"use server";
import { auth, signIn, signOut } from "@/auth";
import { ChangePasswordSchema } from "@/validation/change_password.validation";
import { LoginSchema } from "@/validation/login.validation";
import { PasswordResetSchema } from "@/validation/password_reset.validation";
import { RegisterSchema } from "@/validation/register.validation";
import { UpdatePasswordSchema } from "@/validation/update_password.validation";
import { get, post, removeJWT, saveJWT } from "@/lib/config/api.config";
import { URLs } from "@/lib/urls";
import { handleServerError } from "@/lib/error-handler";

export const checkSession = async () => {
  try {
    const session = await auth();
    return !!session?.user;
  } catch (error: any) {
    handleServerError(error);
  }
};
export const unAuthorized = async () => {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("errors.unauthorized");
    }
  } catch (error: any) {
    handleServerError(error);
  }
};
export const alreadyLoggedIn = async () => {
  try {
    const session = await auth();
    if (session?.user?.id) {
      throw new Error("errors.alreadyLoggedIn");
    }
  } catch (error: any) {
    handleServerError(error);
  }
};
export const getAuth = async () => {
  try {
    await unAuthorized();
    const data = await get(URLs.GET_AUTH);
    return data;
  } catch (error: any) {
    handleServerError(error);
  }
};
export const register = async (data: RegisterSchema) => {
  try {
    await alreadyLoggedIn();
    const response = await post(URLs.REGISTER, data);
    return response;
  } catch (error: any) {
    handleServerError(error);
  }
};
export const login = async (form: LoginSchema) => {
  try {
    await alreadyLoggedIn();
    const data = await post(URLs.LOGIN, form);
    await saveJWT(data.jwt);
    await signIn("credentials", {
      id: data.user.id.toString(),
      email: data.user.email,
      jwt: data.jwt,
      redirect: false,
    });
    return form;
  } catch (error: any) {
    handleServerError(error);
  }
};
export const checkLoginOtp = async (form: {
  code: string;
  email: string;
  password: string;
}) => {
  try {
    await alreadyLoggedIn();
    const data = await post(URLs.CHECK_LOGIN_OTP, form);
    console.log(data);
    await saveJWT(data.jwt);
    await signIn("credentials", {
      id: data.user.id.toString(),
      email: data.user.email,
      jwt: data.jwt,
      redirect: false,
    });
    return data;
  } catch (error: any) {
    handleServerError(error);
  }
};

export const logout = async () => {
  try {
    await unAuthorized();
    await post(URLs.LOGOUT);
    await signOut({
      redirect: false,
    });
    await removeJWT();
    return true;
  } catch (error: any) {
    throw error;
  }
};

export const changePassword = async (form: ChangePasswordSchema) => {
  try {
    await unAuthorized();
    const data = await post(URLs.CHANGE_PASSWORD, form);
    return data;
  } catch (error: any) {
    handleServerError(error);
  }
};

export const passwordReset = async (form: PasswordResetSchema) => {
  try {
    await alreadyLoggedIn();
    const data = await post(URLs.PASSWORD_RESET, form);
    return data;
  } catch (error: any) {
    handleServerError(error);
  }
};

export const updatePassword = async (
  form: UpdatePasswordSchema & { token: string }
) => {
  try {
    await alreadyLoggedIn();
    const data = await post(URLs.UPDATE_PASSWORD, form);
    return data;
  } catch (error: any) {
    handleServerError(error);
  }
};

export const get2FASecret = async () => {
  try {
    await unAuthorized();
    const data = await get(URLs.GET_2FA_SECRET);
    return data.secret;
  } catch (error: any) {
    handleServerError(error);
  }
};

export const activate2FA = async ({ code }: { code: string }) => {
  try {
    await unAuthorized();
    const data = await post(URLs.ACTIVATE_2FA, { code });
    return data;
  } catch (error: any) {
    handleServerError(error);
  }
};

export const deactivate2FA = async () => {
  try {
    await unAuthorized();
    const data = await post(URLs.DEACTIVATE_2FA);
    return data;
  } catch (error: any) {
    handleServerError(error);
  }
};

export const verifyOtp = async (form: { email: string; code: string }) => {
  try {
    await alreadyLoggedIn();
    const data = await post(URLs.VERIFY_OTP, form);
    return data;
  } catch (error: any) {
    handleServerError(error);
  }
};

export const resendOtp = async (form: { email: string }) => {
  try {
    await alreadyLoggedIn();
    const data = await post(URLs.RESEND_OTP, form);
    return data;
  } catch (error: any) {
    handleServerError(error);
  }
};

export const verifyResetPasswordToken = async (token: string) => {
  try {
    await alreadyLoggedIn();
    const data = await get(`${URLs.VERIFY_RESET_PASSWORD_TOKEN}/${token}`);
    return data;
  } catch (error: any) {
    handleServerError(error);
  }
};
