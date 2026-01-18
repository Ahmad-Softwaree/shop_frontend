import { z } from "zod";
import { i18n } from "i18next";

export const getProfileSchema = (lang: i18n) => {
  const v = lang.t("validation", { returnObjects: true }) as any;

  return z.object({
    name: z.string({ message: v.nameRequired }).min(2, { message: v.nameMin }),
    username: z
      .string({ message: v.usernameRequired })
      .min(3, { message: v.usernameMin })
      .max(20, { message: v.usernameMax })
      .regex(/^[a-zA-Z0-9_]+$/, { message: v.usernameInvalid }),
    email: z
      .string({ message: v.emailRequired })
      .email({ message: v.emailInvalid }),
    phone: z
      .string({ message: v.phoneRequired })
      .min(10, { message: v.phoneMin })
      .max(20, { message: v.phoneMax })
      .regex(/^[+]?[\d\s()-]+$/, { message: v.phoneInvalid }),
  });
};

export type ProfileSchema = z.infer<ReturnType<typeof getProfileSchema>>;
