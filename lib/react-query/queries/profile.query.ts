"use client";

import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { updateProfile } from "@/lib/react-query/actions/profile.action";
import { useModalStore } from "@/lib/store/modal.store";
import { useSession } from "next-auth/react";
import { handleMutationError } from "@/lib/error-handler";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "../keys";

export const useUpdateProfile = ({
  closeTheModal,
  successMessage,
}: {
  closeTheModal?: () => void;
  successMessage?: string;
}) => {
  const { t } = useTranslation();
  const { closeModal } = useModalStore();
  const { update } = useSession();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (form: { name: string; email: string }) => updateProfile(form),
    onSuccess: async () => {
      toast.success(successMessage || t("profile.updateSuccess"));
      closeModal();
      closeTheModal?.();
      await update();
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.AUTH] });
    },
    onError: (error: Error) => {
      handleMutationError(error, t, "profile.updateError", (msg) =>
        toast.error(msg)
      );
    },
  });
};
