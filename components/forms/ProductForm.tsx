"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { useState, useTransition } from "react";
import Image from "next/image";
import { Upload, X } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  ProductSchema,
  getProductSchema,
} from "@/validation/product.validation";
import {
  useAddProduct,
  useUpdateProduct,
} from "@/lib/react-query/queries/product.query";
import { toast } from "sonner";
import { ENUMs } from "@/lib/enums";
import { imageSrc, buildFormData } from "@/lib/functions";
import { deleteOldImage } from "@/lib/react-query/actions/shared.action";
import { Product } from "@/types/types";

type ProductFormProps = {
  product?: Product;
};

export default function ProductForm({ product }: ProductFormProps) {
  const { t, i18n } = useTranslation();
  const [isPending, startTransition] = useTransition();
  const [imagePreview, setImagePreview] = useState<string | null>(
    product?.image ? imageSrc(product.image) : null
  );

  const addProductMutation = useAddProduct();
  const updateProductMutation = useUpdateProduct();

  const form = useForm<ProductSchema>({
    resolver: zodResolver(getProductSchema(i18n)),
    defaultValues: {
      enName: product?.enName || "",
      arName: product?.arName || "",
      ckbName: product?.ckbName || "",
      enDesc: product?.enDesc || "",
      arDesc: product?.arDesc || "",
      ckbDesc: product?.ckbDesc || "",
      price: product?.price || 0,
      image: undefined,
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      form.setValue("image", file);
    }
  };

  const removeImage = async () => {
    // If editing existing product with an image, delete it from server
    if (product?.id && product?.image) {
      startTransition(async () => {
        const result = await deleteOldImage("product", "products", product.id, [
          ENUMs.TAGS.PRODUCTS,
        ]);
        if (result.success) {
          setImagePreview(null);
          form.setValue("image", undefined);
          toast.success(t("products.imageDeleted"));
        } else {
          toast.error(result.message || t("common.error"));
        }
      });
    } else {
      setImagePreview(null);
      form.setValue("image", undefined);
    }
  };

  const onSubmit = async (data: ProductSchema) => {
    const formData = buildFormData(data);

    if (product) {
      updateProductMutation.mutate({ id: product.id.toString(), formData });
    } else {
      addProductMutation.mutate(formData);
    }
  };

  const isLoading =
    addProductMutation.isPending || updateProductMutation.isPending;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Image Upload */}
        <FormField
          control={form.control}
          name="image"
          render={({ field: { value, onChange, ...field } }) => (
            <FormItem>
              <FormLabel>{t("products.form.imageLabel")}</FormLabel>
              <FormControl>
                <div className="space-y-4">
                  {imagePreview ? (
                    <div className="relative w-full h-64 rounded-lg overflow-hidden border">
                      <Image
                        src={imagePreview}
                        alt="Product preview"
                        fill
                        className="object-cover"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={removeImage}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer hover:bg-accent transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-10 h-10 mb-3 text-muted-foreground" />
                        <p className="mb-2 text-sm text-muted-foreground">
                          <span className="font-semibold">
                            {t("products.form.uploadImage")}
                          </span>{" "}
                          {t("products.form.orDragDrop")}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          PNG, JPG, WEBP
                        </p>
                      </div>
                      <Input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageChange}
                        {...field}
                      />
                    </label>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* English Name */}
        <FormField
          control={form.control}
          name="enName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("products.form.enNameLabel")}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t("products.form.enNamePlaceholder")}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Arabic Name */}
        <FormField
          control={form.control}
          name="arName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("products.form.arNameLabel")}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t("products.form.arNamePlaceholder")}
                  {...field}
                  dir="rtl"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Kurdish Name */}
        <FormField
          control={form.control}
          name="ckbName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("products.form.ckbNameLabel")}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t("products.form.ckbNamePlaceholder")}
                  {...field}
                  dir="rtl"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Price */}
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("products.form.priceLabel")}</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  placeholder={t("products.form.pricePlaceholder")}
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* English Description */}
        <FormField
          control={form.control}
          name="enDesc"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("products.form.enDescLabel")}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t("products.form.enDescPlaceholder")}
                  className="min-h-32"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Arabic Description */}
        <FormField
          control={form.control}
          name="arDesc"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("products.form.arDescLabel")}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t("products.form.arDescPlaceholder")}
                  className="min-h-32"
                  {...field}
                  dir="rtl"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Kurdish Description */}
        <FormField
          control={form.control}
          name="ckbDesc"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("products.form.ckbDescLabel")}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t("products.form.ckbDescPlaceholder")}
                  className="min-h-32"
                  {...field}
                  dir="rtl"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => window.history.back()}
            disabled={isLoading}>
            {t("common.cancel")}
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading
              ? t("common.loading")
              : product
              ? t("products.form.updateButton")
              : t("products.form.createButton")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
