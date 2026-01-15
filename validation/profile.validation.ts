import { z } from "zod";
import { i18n } from "i18next";

export const getProfileSchema = (lang: i18n) => {
  const v = lang.t("validation", { returnObjects: true }) as any;

  return z.object({
    name: z.string().min(2, { message: v.nameMin }),
    email: z.string().email({ message: v.emailInvalid }),
  });
};

export type ProfileSchema = z.infer<ReturnType<typeof getProfileSchema>>;
