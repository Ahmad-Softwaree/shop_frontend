import { z } from "zod";
import { i18n } from "i18next";

export const getUpdatePasswordSchema = (lang: i18n) => {
  const v = lang.t("validation", { returnObjects: true }) as any;

  return z
    .object({
      password: z
        .string({ message: v.newPasswordRequired })
        .min(1, v.newPasswordRequired)
        .min(8, { message: v.newPasswordMin }),
      confirmPassword: z
        .string({ message: v.confirmPasswordRequired })
        .min(1, v.confirmPasswordRequired),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: v.passwordsNotMatch,
      path: ["confirmPassword"],
    });
};

export type UpdatePasswordSchema = z.infer<
  ReturnType<typeof getUpdatePasswordSchema>
>;
