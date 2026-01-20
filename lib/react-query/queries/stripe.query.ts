"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { checkout } from "../actions/stripe.action";
import { handleMutationError, throwIfError } from "@/lib/error-handler";

export const useCheckout = () => {
  const { t } = useTranslation();

  return useMutation({
    mutationFn: async (productId: number) => {
      const result = await checkout(productId);
      return throwIfError(result);
    },
    onSuccess: (data: { url?: string }) => {
      toast.success(t("messages.checkoutSuccess"));
      if (data?.url) {
        window.location.href = data.url;
      }
    },
    onError: (error: Error) => {
      handleMutationError(error, t, "errors.checkout", (msg) =>
        toast.error(msg)
      );
    },
  });
};
