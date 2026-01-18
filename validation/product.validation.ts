import { z } from "zod";
import { i18n } from "i18next";

export const getProductSchema = (lang: i18n) => {
  const v = lang.t("validation", { returnObjects: true }) as any;

  return z.object({
    enName: z
      .string({ message: v.productEnNameRequired })
      .min(2, { message: v.productNameMin }),
    arName: z
      .string({ message: v.productArNameRequired })
      .min(2, { message: v.productNameMin }),
    ckbName: z
      .string({ message: v.productCkbNameRequired })
      .min(2, { message: v.productNameMin }),
    enDesc: z
      .string({ message: v.productEnDescRequired })
      .min(10, { message: v.productDescMin }),
    arDesc: z
      .string({ message: v.productArDescRequired })
      .min(10, { message: v.productDescMin }),
    ckbDesc: z
      .string({ message: v.productCkbDescRequired })
      .min(10, { message: v.productDescMin }),
    price: z
      .number({ message: v.productPriceRequired })
      .positive({ message: v.productPricePositive }),
    image: z.any().optional(),
  });
};

export type ProductSchema = z.infer<ReturnType<typeof getProductSchema>>;
