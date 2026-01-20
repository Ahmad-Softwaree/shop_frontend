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
    return handleServerError(error);
  }
};
export const unAuthorized = async () => {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return handleServerError({
        message: "errors.unauthorized",
        statusCode: 401,
      });
    }
  } catch (error: any) {
    return handleServerError(error);
  }
};
export const alreadyLoggedIn = async () => {
  try {
    const session = await auth();
    if (session?.user?.id) {
      return handleServerError({
        message: "errors.alreadyLoggedIn",
        statusCode: 400,
      });
    }
  } catch (error: any) {
    return handleServerError(error);
  }
};
export const getAuth = async () => {
  try {
    const authCheck = await unAuthorized();
    if (authCheck && (authCheck as any).__isError) return authCheck;

    const data = await get(URLs.GET_AUTH);
    if (data && (data as any).__isError) return data;
    return data;
  } catch (error: any) {
    return handleServerError(error);
  }
};
export const register = async (data: RegisterSchema) => {
  try {
    const alreadyLogged = await alreadyLoggedIn();
    if (alreadyLogged && (alreadyLogged as any).__isError) return alreadyLogged;

    const response = await post(URLs.REGISTER, data);
    if (response && (response as any).__isError) return response;
    return response;
  } catch (error: any) {
    return handleServerError(error);
  }
};
export const login = async (form: LoginSchema) => {
  try {
    const alreadyLogged = await alreadyLoggedIn();
    if (alreadyLogged && (alreadyLogged as any).__isError) return alreadyLogged;

    const data = await post(URLs.LOGIN, form);
    if (data && (data as any).__isError) return data;

    await saveJWT(data.jwt);
    await signIn("credentials", {
      id: data.user.id.toString(),
      email: data.user.email,
      jwt: data.jwt,
      redirect: false,
    });
    return form;
  } catch (error: any) {
    return handleServerError(error);
  }
};
export const checkLoginOtp = async (form: {
  code: string;
  email: string;
  password: string;
}) => {
  try {
    const alreadyLogged = await alreadyLoggedIn();
    if (alreadyLogged && (alreadyLogged as any).__isError) return alreadyLogged;

    const data = await post(URLs.CHECK_LOGIN_OTP, form);
    if (data && (data as any).__isError) return data;

    await saveJWT(data.jwt);
    await signIn("credentials", {
      id: data.user.id.toString(),
      email: data.user.email,
      jwt: data.jwt,
      redirect: false,
    });
    return data;
  } catch (error: any) {
    return handleServerError(error);
  }
};

export const logout = async () => {
  try {
    const authCheck = await unAuthorized();
    if (authCheck && (authCheck as any).__isError) return authCheck;

    const result = await post(URLs.LOGOUT);
    if (result && (result as any).__isError) return result;

    await signOut({
      redirect: false,
    });
    await removeJWT();
    return true;
  } catch (error: any) {
    return handleServerError(error);
  }
};

export const changePassword = async (form: ChangePasswordSchema) => {
  try {
    const authCheck = await unAuthorized();
    if (authCheck && (authCheck as any).__isError) return authCheck;

    const data = await post(URLs.CHANGE_PASSWORD, form);
    if (data && (data as any).__isError) return data;
    return data;
  } catch (error: any) {
    return handleServerError(error);
  }
};

export const passwordReset = async (form: PasswordResetSchema) => {
  try {
    const alreadyLogged = await alreadyLoggedIn();
    if (alreadyLogged && (alreadyLogged as any).__isError) return alreadyLogged;

    const data = await post(URLs.PASSWORD_RESET, form);
    if (data && (data as any).__isError) return data;
    return data;
  } catch (error: any) {
    return handleServerError(error);
  }
};

export const updatePassword = async (
  form: UpdatePasswordSchema & { token: string }
) => {
  try {
    const alreadyLogged = await alreadyLoggedIn();
    if (alreadyLogged && (alreadyLogged as any).__isError) return alreadyLogged;

    const data = await post(URLs.UPDATE_PASSWORD, form);
    if (data && (data as any).__isError) return data;
    return data;
  } catch (error: any) {
    return handleServerError(error);
  }
};

export const get2FASecret = async () => {
  try {
    const authCheck = await unAuthorized();
    if (authCheck && (authCheck as any).__isError) return authCheck;

    const data = await get(URLs.GET_2FA_SECRET);
    if (data && (data as any).__isError) return data;
    return data.secret;
  } catch (error: any) {
    return handleServerError(error);
  }
};

export const activate2FA = async ({ code }: { code: string }) => {
  try {
    const authCheck = await unAuthorized();
    if (authCheck && (authCheck as any).__isError) return authCheck;

    const data = await post(URLs.ACTIVATE_2FA, { code });
    if (data && (data as any).__isError) return data;
    return data;
  } catch (error: any) {
    return handleServerError(error);
  }
};

export const deactivate2FA = async () => {
  try {
    const authCheck = await unAuthorized();
    if (authCheck && (authCheck as any).__isError) return authCheck;

    const data = await post(URLs.DEACTIVATE_2FA);
    if (data && (data as any).__isError) return data;
    return data;
  } catch (error: any) {
    return handleServerError(error);
  }
};

export const verifyOtp = async (form: { email: string; code: string }) => {
  try {
    const alreadyLogged = await alreadyLoggedIn();
    if (alreadyLogged && (alreadyLogged as any).__isError) return alreadyLogged;

    const data = await post(URLs.VERIFY_OTP, form);
    if (data && (data as any).__isError) return data;
    return data;
  } catch (error: any) {
    return handleServerError(error);
  }
};

export const resendOtp = async (form: { email: string }) => {
  try {
    const alreadyLogged = await alreadyLoggedIn();
    if (alreadyLogged && (alreadyLogged as any).__isError) return alreadyLogged;

    const data = await post(URLs.RESEND_OTP, form);
    if (data && (data as any).__isError) return data;
    return data;
  } catch (error: any) {
    return handleServerError(error);
  }
};

export const verifyResetPasswordToken = async (token: string) => {
  try {
    const alreadyLogged = await alreadyLoggedIn();
    if (alreadyLogged && (alreadyLogged as any).__isError) return alreadyLogged;

    const data = await get(`${URLs.VERIFY_RESET_PASSWORD_TOKEN}/${token}`);
    if (data && (data as any).__isError) return data;
    return data;
  } catch (error: any) {
    return handleServerError(error);
  }
};
