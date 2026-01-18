import { z } from "zod";
import { i18n } from "i18next";

export const getRegisterSchema = (lang: i18n) => {
  const v = lang.t("validation", { returnObjects: true }) as any;

  return z
    .object({
      name: z
        .string({ message: v.nameRequired })
        .min(2, { message: v.nameMin }),
      username: z
        .string({ message: v.usernameRequired })
        .min(3, { message: v.usernameMin })
        .max(20, { message: v.usernameMax })
        .regex(/^[a-zA-Z0-9_]+$/, { message: v.usernameInvalid }),
      email: z
        .string({ message: v.emailRequired })
        .min(1, v.emailRequired)
        .email({ message: v.emailInvalid }),
      phone: z
        .string({ message: v.phoneRequired })
        .min(10, { message: v.phoneMin })
        .max(20, { message: v.phoneMax })
        .regex(/^[+]?[\d\s()-]+$/, { message: v.phoneInvalid }),
      password: z
        .string({ message: v.passwordRequired })
        .min(1, v.passwordRequired)
        .min(8, { message: v.passwordMin }),
      confirmPassword: z
        .string({ message: v.confirmPasswordRequired })
        .min(1, v.confirmPasswordRequired),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: v.passwordsNotMatch,
      path: ["confirmPassword"],
    });
};

export type RegisterSchema = z.infer<ReturnType<typeof getRegisterSchema>>;
