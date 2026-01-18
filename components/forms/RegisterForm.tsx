"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import Link from "next/link";
import { Mail, Lock, Loader2, CheckCircle2, Phone } from "lucide-react";

import { useRegister } from "@/lib/react-query/queries/auth.query";
import {
  getRegisterSchema,
  RegisterSchema,
} from "@/validation/register.validation";

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
import { PasswordInput } from "@/components/ui/password-input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ENUMs } from "@/lib/enums";

const RegisterForm = () => {
  const { t, i18n } = useTranslation();
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<RegisterSchema>({
    resolver: zodResolver(getRegisterSchema(i18n)),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  const { mutateAsync, isPending } = useRegister();

  const onSubmit = async (data: RegisterSchema) => {
    await mutateAsync(data).then(() => {
      form.reset();
      setIsSuccess(true);
    });
  };

  // Show success card if registration was successful
  if (isSuccess) {
    return (
      <Card className="w-full max-w-md mx-auto shadow-lg">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-green-100 dark:bg-green-900/20 p-3">
              <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-500" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center">
            {t("auth.registerSuccessTitle")}
          </CardTitle>
          <CardDescription className="text-center">
            {t("auth.registerSuccessMessage")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild className="w-full" size="lg">
            <Link href={ENUMs.PAGES.LOGIN}>{t("auth.goToLogin")}</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          {t("auth.registerTitle")}
        </CardTitle>
        <CardDescription className="text-center">
          {t("auth.registerSubtitle")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("auth.name")}</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="John Doe"
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
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("auth.username")}</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="johndoe"
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
                        disabled={isPending}
                      />
                    </div>
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
                  <FormLabel>{t("auth.phone")}</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="tel"
                        placeholder="+1234567890"
                        className="pl-10"
                        {...field}
                        disabled={isPending}
                      />
                    </div>
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
                  {t("auth.registerButton")}...
                </>
              ) : (
                t("auth.registerButton")
              )}
            </Button>

            <div className="text-center text-sm">
              <span className="text-muted-foreground">
                {t("auth.haveAccount")}{" "}
              </span>
              <Link
                href={ENUMs.PAGES.LOGIN}
                className="font-medium text-primary hover:underline">
                {t("auth.login")}
              </Link>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default RegisterForm;
