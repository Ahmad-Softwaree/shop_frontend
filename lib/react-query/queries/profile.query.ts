"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { updateProfile } from "@/lib/react-query/actions/profile.action";
import { useModalStore } from "@/lib/store/modal.store";
import { useSession } from "next-auth/react";

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

  return useMutation({
    mutationFn: (form: { name: string; email: string }) => updateProfile(form),
    onSuccess: async () => {
      toast.success(successMessage || t("profile.updateSuccess"));
      closeModal();
      closeTheModal?.();
      await update();
    },
    onError: (error: Error) => {
      toast.error(error.message || t("profile.updateError"));
    },
  });
};
