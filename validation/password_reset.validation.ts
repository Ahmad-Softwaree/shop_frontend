import { z } from "zod";
import { i18n } from "i18next";

export const getPasswordResetSchema = (lang: i18n) => {
  const v = lang.t("validation", { returnObjects: true }) as any;

  return z.object({
    email: z
      .string({ message: v.emailRequired })
      .min(1, v.emailRequired)
      .email({ message: v.emailInvalid }),
  });
};

export type PasswordResetSchema = z.infer<
  ReturnType<typeof getPasswordResetSchema>
>;
