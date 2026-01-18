"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { Mail, Lock, Loader2, ShieldCheck } from "lucide-react";

import {
  useLogin,
  useCheckLoginOtp,
} from "@/lib/react-query/queries/auth.query";
import { getLoginSchema, LoginSchema } from "@/validation/login.validation";

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
import { useState } from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

const LoginForm = () => {
  const { t, i18n } = useTranslation();
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState<string>("");
  const [credentials, setCredentials] = useState<LoginSchema | null>(null);

  const form = useForm<LoginSchema>({
    resolver: zodResolver(getLoginSchema(i18n)),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutateAsync: loginMutate, isPending: isLoginPending } = useLogin();
  const { mutateAsync: otpMutate, isPending: isOtpPending } =
    useCheckLoginOtp();

  const onSubmit = async (data: LoginSchema) => {
    await loginMutate(data)
      .then(() => {
        form.reset();
      })
      .catch((error: any) => {
        const errorData = JSON.parse(error.message);
        if (errorData?.message === "TWO_FACTOR_AUTHENTICATION_REQUIRED") {
          setCredentials(data);
          setShowOtp(true);
        }
      });
  };

  const handleOtpSubmit = async () => {
    if (!credentials || otp.length !== 6) return;

    await otpMutate({
      code: otp,
      email: credentials.email,
      password: credentials.password,
    });

    form.reset();
    setOtp("");
    setShowOtp(false);
    setCredentials(null);
  };

  const handleCancelOtp = () => {
    setShowOtp(false);
    setOtp("");
    setCredentials(null);
  };

  // Get current email value for password reset link
  const currentEmail = form.watch("email");

  // If showing OTP input
  if (showOtp) {
    return (
      <Card className="w-full max-w-md mx-auto shadow-lg">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <ShieldCheck className="h-6 w-6 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center">
            {t("auth.enterLoginOTP")}
          </CardTitle>
          <CardDescription className="text-center">
            {t("auth.enterLoginOTPDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col items-center gap-4">
            <div dir="ltr">
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={(value) => setOtp(value)}
                disabled={isOtpPending}>
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>

            <div className="flex gap-3 w-full">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={handleCancelOtp}
                disabled={isOtpPending}>
                {t("auth.cancelSetup")}
              </Button>
              <Button
                type="button"
                className="flex-1"
                onClick={handleOtpSubmit}
                disabled={otp.length !== 6 || isOtpPending}>
                {isOtpPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("auth.verifyOTP")}...
                  </>
                ) : (
                  t("auth.verifyOTP")
                )}
              </Button>
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
          {t("auth.loginTitle")}
        </CardTitle>
        <CardDescription className="text-center">
          {t("auth.loginSubtitle")}
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
                        disabled={isLoginPending}
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
                      disabled={isLoginPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={isLoginPending}
              size="lg">
              {isLoginPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("auth.loginButton")}...
                </>
              ) : (
                t("auth.loginButton")
              )}
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

            <div className="text-center text-sm">
              <span className="text-muted-foreground">
                {t("auth.passwordReset")}{" "}
              </span>
              <Link
                href={
                  currentEmail
                    ? `${ENUMs.PAGES.PASSWORD_RESET}?email=${encodeURIComponent(
                        currentEmail
                      )}`
                    : ENUMs.PAGES.PASSWORD_RESET
                }
                className="font-medium text-primary hover:underline">
                {t("auth.passwordResetLink")}
              </Link>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default LoginForm;
