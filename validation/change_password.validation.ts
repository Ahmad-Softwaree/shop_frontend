import { z } from "zod";
import i18n from "@/i18n/i18n";

export const useChangePasswordSchema = () => {
  const v = i18n.t("validation", { returnObjects: true }) as any;
  return z
    .object({
      currentPassword: z.string().min(8, { message: v.currentPasswordMin }),
      password: z.string().min(8, { message: v.newPasswordMin }),
      confirmPassword: z
        .string()
        .min(1, { message: v.confirmPasswordRequired }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: v.passwordsNotMatch,
      path: ["confirmPassword"],
    });
};

export type ChangePasswordSchema = z.infer<
  ReturnType<typeof useChangePasswordSchema>
>;
