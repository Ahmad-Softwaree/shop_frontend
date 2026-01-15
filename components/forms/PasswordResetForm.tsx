"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { Mail, CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";

import {
  getPasswordResetSchema,
  PasswordResetSchema,
} from "@/validation/password_reset.validation";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ENUMs } from "@/lib/enums";
import { useAppQueryParams } from "@/hooks/useAppQuery";
import { usePasswordReset } from "@/lib/react-query/queries/auth.query";

const PasswordResetForm = () => {
  const { t, i18n } = useTranslation();
  const { queries } = useAppQueryParams();
  const emailFromQuery = queries.email || "";
  const { mutateAsync, isPending, isSuccess } = usePasswordReset();
  const [submittedEmail, setSubmittedEmail] = useState<string>("");

  const form = useForm<PasswordResetSchema>({
    resolver: zodResolver(getPasswordResetSchema(i18n)),
    defaultValues: {
      email: emailFromQuery,
    },
  });

  // Update email field when query parameter changes
  useEffect(() => {
    if (emailFromQuery) {
      form.setValue("email", emailFromQuery);
    }
  }, [emailFromQuery, form]);

  const onSubmit = async (data: PasswordResetSchema) => {
    setSubmittedEmail(data.email);
    await mutateAsync(data);
  };

  // Show success card if email was sent
  if (isSuccess && submittedEmail) {
    return (
      <Card className="w-full max-w-md mx-auto shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle2 className="h-12 w-12 text-green-500" />
          </div>
          <CardTitle className="text-2xl font-bold">
            {t("auth.passwordResetSuccessTitle")}
          </CardTitle>
          <CardDescription className="text-center">
            {t("auth.passwordResetSuccessDescription")}{" "}
            <span className="font-semibold text-primary">{submittedEmail}</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <Button asChild className="w-full" size="lg">
              <Link href={ENUMs.PAGES.LOGIN}>{t("auth.backToLogin")}</Link>
            </Button>
            <div className="text-center text-sm">
              <span className="text-muted-foreground">
                {t("auth.noAccount")}{" "}
              </span>
              <Link
                href={ENUMs.PAGES.REGISTER}
                className="font-medium text-primary hover:underline">
                {t("auth.register")}
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          {t("auth.passwordResetTitle")}
        </CardTitle>
        <CardDescription className="text-center">
          {t("auth.passwordResetSubtitle")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("auth.email")}</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="email"
                        placeholder="example@email.com"
                        className="pl-10"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              disabled={isPending}
              type="submit"
              className="w-full"
              size="lg">
              {t("auth.passwordResetButton")}
            </Button>

            <div className="flex items-center justify-between gap-4 text-sm">
              <div className="text-center">
                <Link
                  href={ENUMs.PAGES.LOGIN}
                  className="font-medium text-primary hover:underline">
                  {t("auth.backToLogin")}
                </Link>
              </div>
              <div className="text-center">
                <span className="text-muted-foreground">
                  {t("auth.noAccount")}{" "}
                </span>
                <Link
                  href={ENUMs.PAGES.REGISTER}
                  className="font-medium text-primary hover:underline">
                  {t("auth.register")}
                </Link>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default PasswordResetForm;
