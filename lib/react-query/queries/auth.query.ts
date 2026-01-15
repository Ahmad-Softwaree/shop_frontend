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
  updateProfile,
  changePassword,
  passwordReset,
  updatePassword,
  getAuth,
  activate2FA,
  deactivate2FA,
  checkLoginOtp,
} from "../actions/auth.action";
import {
  loginMiddleware,
  profileMiddleware,
  registerMiddleware,
} from "../middleware/auth.middleware";
import { ENUMs } from "@/lib/enums";
import { ProfileSchema } from "@/validation/profile.validation";
import { useSession } from "next-auth/react";
import { ChangePasswordSchema } from "@/validation/change_password.validation";
import { PasswordResetSchema } from "@/validation/password_reset.validation";
import { UpdatePasswordSchema } from "@/validation/update_password.validation";
import { QUERY_KEYS } from "../keys";

export const useGetAuth = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.AUTH],
    queryFn: () => getAuth(),
  });
};

export const useRegister = () => {
  const { t, i18n } = useTranslation();

  return useMutation({
    mutationFn: async (data: RegisterSchema) => {
      await registerMiddleware(i18n, data);
      return await register(data);
    },
    onSuccess: () => {
      toast.success(t("messages.registerSuccess"));
    },
    onError: (error: any) => {
      toast.error(t(error.message) || t("errors.register"));
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
      if (data?.requires2FA) {
        toast.info(t("messages.twoFactorAuthRequired"));
        return { requires2FA: true };
      }
      await update();
      toast.success(t("messages.loginSuccess"));
      router.push(ENUMs.PAGES.PROFILE);
      router.refresh();
    },
    onError: (error: any) => {
      toast.error(t(error.message) || t("errors.login"));
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
    onError: (error: any) => {
      toast.error(t(error.message) || t("errors.login"));
    },
  });
};
export const useUpdateProfile = () => {
  const { t, i18n } = useTranslation();

  return useMutation({
    mutationFn: async (data: ProfileSchema) => {
      await profileMiddleware(i18n, data);
      return updateProfile(data);
    },
    onSuccess: () => {
      toast.success(t("profile.updateSuccess"));
    },
    onError: (error: any) => {
      toast.error(t(error.message) || t("profile.updateError"));
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
    onError: (error: any) => {
      toast.error(t(error.message) || t("errors.logout"));
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
    onError: (error: any) => {
      toast.error(t(error.message) || t("changePassword.error"));
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
    onError: (error: any) => {
      toast.error(t(error.message) || t("errors.passwordResetFailed"));
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
    onError: (error: any) => {
      toast.error(t(error.message) || t("errors.passwordUpdateFailed"));
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
    onError: (error: any) => {
      toast.error(t(error.message) || t("errors.activate2FAFailed"));
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
    onError: (error: any) => {
      toast.error(t(error.message) || t("errors.deactivate2FAFailed"));
    },
  });
};
