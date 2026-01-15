"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { KeyRound } from "lucide-react";
import {
  ChangePasswordSchema,
  useChangePasswordSchema,
} from "@/validation/change_password.validation";
import { useChangePassword } from "@/lib/react-query/queries/auth.query";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { PasswordInput } from "@/components/ui/password-input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ChangePasswordForm() {
  const { t } = useTranslation();
  const { mutateAsync, isPending } = useChangePassword();

  const form = useForm<ChangePasswordSchema>({
    resolver: zodResolver(useChangePasswordSchema()),
    defaultValues: {
      currentPassword: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: ChangePasswordSchema) => {
    await mutateAsync(data);
  };

  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl flex items-center gap-2">
          <KeyRound className="h-6 w-6" />
          {t("changePassword.title")}
        </CardTitle>
        <CardDescription>{t("changePassword.subtitle")}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("changePassword.currentPassword")}</FormLabel>
                  <FormControl>
                    <PasswordInput
                      placeholder="********"
                      {...field}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("changePassword.newPassword")}</FormLabel>
                  <FormControl>
                    <PasswordInput
                      placeholder="********"
                      {...field}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("changePassword.confirmPassword")}</FormLabel>
                  <FormControl>
                    <PasswordInput
                      placeholder="********"
                      {...field}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isPending}>
              {t("changePassword.submitButton")}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
