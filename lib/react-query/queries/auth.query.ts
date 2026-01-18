"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";

import { RegisterSchema } from "@/validation/register.validation";
import { LoginSchema } from "@/validation/login.validation";
import {
  login,
  logout,
  register,
  changePassword,
  passwordReset,
  updatePassword,
  getAuth,
  activate2FA,
  deactivate2FA,
  checkLoginOtp,
  verifyOtp,
  resendOtp,
} from "../actions/auth.action";
import {
  loginMiddleware,
  registerMiddleware,
} from "../middleware/auth.middleware";
import { ENUMs } from "@/lib/enums";
import { useSession } from "next-auth/react";
import { ChangePasswordSchema } from "@/validation/change_password.validation";
import { PasswordResetSchema } from "@/validation/password_reset.validation";
import { UpdatePasswordSchema } from "@/validation/update_password.validation";
import { QUERY_KEYS } from "../keys";
import { handleMutationError } from "@/lib/error-handler";

export const useGetAuth = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.AUTH],
    queryFn: () => getAuth(),
  });
};

export const useRegister = () => {
  const { t, i18n } = useTranslation();
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: RegisterSchema) => {
      await registerMiddleware(i18n, data);
      return await register(data);
    },
    onSuccess: (data, variables) => {
      toast.success(t("messages.registerSuccess"));
      // Redirect to authentication page with email parameter
      router.push(
        `${ENUMs.PAGES.AUTHENTICATION}?${ENUMs.PARAMS.EMAIL}=${variables.email}`
      );
    },
    onError: (error: Error) => {
      handleMutationError(error, t, "errors.register", (msg) =>
        toast.error(msg)
      );
    },
  });
};

export const useLogin = () => {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const { update } = useSession();

  return useMutation({
    mutationFn: async (data: LoginSchema) => {
      await loginMiddleware(i18n, data);
      return await login(data);
    },
    onSuccess: async (data: any) => {
      await update();
      toast.success(t("messages.loginSuccess"));
      router.push(ENUMs.PAGES.PROFILE);
      router.refresh();
    },
    onError: (error: any, variables) => {
      const errorMsg = JSON.parse(error.message);

      // Handle specific error codes
      if (errorMsg.message === "ACCOUNT_NOT_VERIFIED") {
        toast.info(t("messages.accountNotVerified"));
        router.push(
          `${ENUMs.PAGES.AUTHENTICATION}?${ENUMs.PARAMS.EMAIL}=${variables.email}`
        );
        return;
      }

      if (errorMsg.message === "TWO_FACTOR_AUTHENTICATION_REQUIRED") {
        toast.info(t("messages.twoFactorAuthRequired"));
        return;
      }

      // Default error handling
      if (
        errorMsg.message != "TWO_FACTOR_AUTHENTICATION_REQUIRED" &&
        errorMsg.message != "ACCOUNT_NOT_VERIFIED"
      ) {
        handleMutationError(error, t, "errors.login", (msg) =>
          toast.error(msg)
        );
      }
    },
  });
};
export const useCheckLoginOtp = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { update } = useSession();

  return useMutation({
    mutationFn: async (data: {
      code: string;
      email: string;
      password: string;
    }) => {
      return await checkLoginOtp(data);
    },
    onSuccess: async () => {
      await update();
      toast.success(t("messages.loginSuccess"));
      router.push(ENUMs.PAGES.PROFILE);
      router.refresh();
    },
    onError: (error: Error) => {
      handleMutationError(error, t, "errors.loginOTPFailed", (msg) =>
        toast.error(msg)
      );
    },
  });
};

export const useLogout = () => {
  const { t } = useTranslation();
  return useMutation({
    mutationFn: async () => {
      return await logout();
    },
    onSuccess: () => {
      toast.success(t("messages.logoutSuccess"));
      window.location.href = ENUMs.PAGES.LOGIN;
    },
    onError: (error: Error) => {
      handleMutationError(error, t, "errors.logout", (msg) => toast.error(msg));
    },
  });
};

export const useChangePassword = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { update } = useSession();
  return useMutation({
    mutationFn: async (data: ChangePasswordSchema) => {
      return await changePassword(data);
    },
    onSuccess: async () => {
      toast.success(t("changePassword.success"));
      await update();

      router.push(ENUMs.PAGES.PROFILE);
    },
    onError: (error: Error) => {
      handleMutationError(error, t, "changePassword.error", (msg) =>
        toast.error(msg)
      );
    },
  });
};
export const usePasswordReset = () => {
  const { t } = useTranslation();
  return useMutation({
    mutationFn: async (data: PasswordResetSchema) => {
      return await passwordReset(data);
    },
    onSuccess: async () => {
      toast.success(t("messages.passwordResetSuccess"));
    },
    onError: (error: Error) => {
      handleMutationError(error, t, "errors.passwordResetFailed", (msg) =>
        toast.error(msg)
      );
    },
  });
};

export const useUpdatePassword = () => {
  const { t } = useTranslation();
  return useMutation({
    mutationFn: async (data: UpdatePasswordSchema & { token: string }) => {
      return await updatePassword(data);
    },
    onSuccess: () => {
      toast.success(t("messages.updatePasswordSuccess"));
      window.location.href = ENUMs.PAGES.LOGIN;
    },
    onError: (error: Error) => {
      handleMutationError(error, t, "errors.passwordUpdateFailed", (msg) =>
        toast.error(msg)
      );
    },
  });
};

export const useActivate2FA = () => {
  const { t } = useTranslation();
  const { update } = useSession();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (form: { code: string }) => {
      return await activate2FA(form);
    },
    onSuccess: async () => {
      toast.success(t("messages.activate2FASuccess"));
      await update();
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.AUTH] });
    },
    onError: (error: Error) => {
      handleMutationError(error, t, "errors.activate2FAFailed", (msg) =>
        toast.error(msg)
      );
    },
  });
};
export const useDisable2FA = () => {
  const { t } = useTranslation();
  const { update } = useSession();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      return await deactivate2FA();
    },
    onSuccess: async () => {
      toast.success(t("messages.deactivate2FASuccess"));
      await update();
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.AUTH] });
    },
    onError: (error: Error) => {
      handleMutationError(error, t, "errors.deactivate2FAFailed", (msg) =>
        toast.error(msg)
      );
    },
  });
};

export const useVerifyOtp = (options?: {
  successMessage?: string;
  onSuccess?: () => void;
}) => {
  const { t } = useTranslation();
  return useMutation({
    mutationFn: async (data: { email: string; code: string }) => {
      return await verifyOtp(data);
    },
    onSuccess: async () => {
      toast.success(
        options?.successMessage || t("messages.otpVerifySuccess" as any)
      );
      options?.onSuccess?.();
    },
    onError: (error: Error) => {
      handleMutationError(error, t, "errors.otpVerifyFailed", (msg) =>
        toast.error(msg)
      );
    },
  });
};

export const useResendOtp = (options?: {
  successMessage?: string;
  onSuccess?: () => void;
}) => {
  const { t } = useTranslation();
  return useMutation({
    mutationFn: async (data: { email: string }) => {
      return await resendOtp(data);
    },
    onSuccess: async () => {
      toast.success(
        options?.successMessage || t("messages.otpResendSuccess" as any)
      );
      options?.onSuccess?.();
    },
    onError: (error: Error) => {
      handleMutationError(error, t, "errors.otpResendFailed", (msg) =>
        toast.error(msg)
      );
    },
  });
};
