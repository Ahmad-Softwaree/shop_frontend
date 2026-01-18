import { z } from "zod";
import { i18n } from "i18next";

export const getOtpSchema = (lang: i18n) => {
  const v = lang.t("validation", { returnObjects: true }) as any;

  return z.object({
    code: z
      .string()
      .min(1, { message: v.otp.code.required })
      .length(6, { message: v.otp.code.length }),
  });
};

export type OtpSchema = z.infer<ReturnType<typeof getOtpSchema>>;
