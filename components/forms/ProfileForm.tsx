"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { useModalStore } from "@/lib/store/modal.store";
import { useUpdateProfile } from "@/lib/react-query/queries/profile.query";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  ProfileSchema,
  getProfileSchema,
} from "@/validation/profile.validation";
import { useAuthStore } from "@/lib/store/auth.store";

export default function ProfileForm() {
  const { t, i18n } = useTranslation();
  const { closeModal } = useModalStore();
  const { user } = useAuthStore();

  const form = useForm<ProfileSchema>({
    resolver: zodResolver(getProfileSchema(i18n)),
    defaultValues: {
      name: user?.name || "",
      username: user?.username || "",
      email: user?.email || "",
      phone: user?.phone || "",
    },
  });

  const updateMutation = useUpdateProfile({
    successMessage: t("profile.updateSuccess"),
  });

  const onSubmit = async (data: ProfileSchema) => {
    await updateMutation.mutateAsync(data).then(() => {
      form.reset();
    });
  };

  const isLoading = updateMutation.isPending;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("profile.form.nameLabel")}</FormLabel>
              <FormControl>
                <Input placeholder={t("profile.name")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("profile.form.usernameLabel")}</FormLabel>
              <FormControl>
                <Input placeholder={t("profile.username")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("profile.form.emailLabel")}</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder={t("profile.email")}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("profile.form.phoneLabel")}</FormLabel>
              <FormControl>
                <Input type="tel" placeholder={t("profile.phone")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={closeModal}
            disabled={isLoading}>
            {t("confirm.cancel")}
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "..." : t("profile.form.submitButton")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
