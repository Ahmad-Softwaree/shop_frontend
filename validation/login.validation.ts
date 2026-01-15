import { z } from "zod";
import { i18n } from "i18next";

export const getLoginSchema = (lang: i18n) => {
  const v = lang.t("validation", { returnObjects: true }) as any;

  return z.object({
    email: z
      .string({ message: v.emailRequired })
      .min(1, v.emailRequired)
      .email({ message: v.emailInvalid }),
    password: z
      .string({ message: v.passwordRequired })
      .min(1, v.passwordRequired)
      .min(8, { message: v.passwordMin }),
  });
};

export type LoginSchema = z.infer<ReturnType<typeof getLoginSchema>>;
