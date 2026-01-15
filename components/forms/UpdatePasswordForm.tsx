"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Lock, Loader2 } from "lucide-react";

import {
  getUpdatePasswordSchema,
  UpdatePasswordSchema,
} from "@/validation/update_password.validation";
import { useUpdatePassword } from "@/lib/react-query/queries/auth.query";

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

interface UpdatePasswordFormProps {
  token: string;
}

const UpdatePasswordForm = ({ token }: UpdatePasswordFormProps) => {
  const { t, i18n } = useTranslation();
  const { mutateAsync, isPending } = useUpdatePassword();

  const form = useForm<UpdatePasswordSchema>({
    resolver: zodResolver(getUpdatePasswordSchema(i18n)),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: UpdatePasswordSchema) => {
    await mutateAsync({ ...data, token }).then(() => {
      form.reset();
    });
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          {t("auth.updatePasswordTitle")}
        </CardTitle>
        <CardDescription className="text-center">
          {t("auth.updatePasswordSubtitle")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("auth.password")}</FormLabel>
                  <FormControl>
                    <PasswordInput
                      placeholder="••••••••"
                      leftIcon={<Lock className="h-4 w-4" />}
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
                  <FormLabel>{t("auth.confirmPassword")}</FormLabel>
                  <FormControl>
                    <PasswordInput
                      placeholder="••••••••"
                      leftIcon={<Lock className="h-4 w-4" />}
                      {...field}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={isPending}
              size="lg">
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("auth.updatePasswordButton")}...
                </>
              ) : (
                t("auth.updatePasswordButton")
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default UpdatePasswordForm;
