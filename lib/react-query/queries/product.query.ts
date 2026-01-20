"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import {
  addProduct,
  updateProduct,
  deleteProduct,
  markAvailable,
} from "../actions/product.action";
import { QUERY_KEYS } from "../keys";
import { handleMutationError, throwIfError } from "@/lib/error-handler";
import { ENUMs } from "@/lib/enums";

export const useAddProduct = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const result = await addProduct(formData);
      return throwIfError(result);
    },
    onSuccess: () => {
      toast.success(t("products.createSuccess"));
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PRODUCTS] });
      router.push(ENUMs.PAGES.PRODUCTS);
    },
    onError: (error: Error) => {
      handleMutationError(error, t, "errors.productCreate", (msg) =>
        toast.error(msg)
      );
    },
  });
};

export const useUpdateProduct = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      formData,
    }: {
      id: string;
      formData: FormData;
    }) => {
      const result = await updateProduct(id, formData);
      return throwIfError(result);
    },
    onSuccess: (_, variables) => {
      toast.success(t("products.updateSuccess"));
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PRODUCTS] });
      router.push(`${ENUMs.PAGES.PRODUCTS}/${variables.id}`);
    },
    onError: (error: Error) => {
      handleMutationError(error, t, "errors.productUpdate", (msg) =>
        toast.error(msg)
      );
    },
  });
};

export const useDeleteProduct = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const result = await deleteProduct(id);
      return throwIfError(result);
    },
    onSuccess: () => {
      toast.success(t("products.deleteSuccess"));
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PRODUCTS] });
      router.push(ENUMs.PAGES.PRODUCTS);
    },
    onError: (error: Error) => {
      handleMutationError(error, t, "errors.productDelete", (msg) =>
        toast.error(msg)
      );
    },
  });
};

export const useMarkAvailable = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const result = await markAvailable(id);
      return throwIfError(result);
    },
    onSuccess: () => {
      toast.success(t("products.markAvailableSuccess"));
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PRODUCTS] });
    },
    onError: (error: Error) => {
      handleMutationError(error, t, "errors.productMarkAvailable", (msg) =>
        toast.error(msg)
      );
    },
  });
};
