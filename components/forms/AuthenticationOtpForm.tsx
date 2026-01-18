"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryState } from "nuqs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { z } from "zod";
import {
  useVerifyOtp,
  useResendOtp,
} from "@/lib/react-query/queries/auth.query";
import { ENUMs } from "@/lib/enums";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getOtpSchema, OtpSchema } from "@/validation/otp.validation";

export default function AuthenticationOtpForm() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const [email] = useQueryState(ENUMs.PARAMS.EMAIL);

  const [canResend, setCanResend] = useState(false);
  const [countdown, setCountdown] = useState(60);

  const form = useForm<OtpSchema>({
    resolver: zodResolver(getOtpSchema(i18n)),
    defaultValues: {
      code: "",
    },
  });

  const verifyMutation = useVerifyOtp({
    successMessage: t("messages.otpVerifySuccess" as any),
    onSuccess: () => {
      setTimeout(() => {
        router.push(ENUMs.PAGES.LOGIN);
      }, 1500);
    },
  });

  const resendMutation = useResendOtp({
    successMessage: t("messages.otpResendSuccess" as any),
    onSuccess: () => {
      setCanResend(false);
      setCountdown(60);
    },
  });

  useEffect(() => {
    if (!email) {
      router.push(ENUMs.PAGES.LOGIN);
      return;
    }

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [email, router]);

  const onSubmit = async (data: OtpSchema) => {
    if (!email) return;
    await verifyMutation.mutateAsync({ email, code: data.code });
  };

  const handleResend = async () => {
    if (canResend && email) {
      await resendMutation.mutateAsync({ email });
    }
  };

  const isLoading = verifyMutation.isPending || resendMutation.isPending;

  if (!email) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">
          {t("auth.verifyAccountTitle")}
        </CardTitle>
        <CardDescription>
          {t("auth.verifyAccountDescription", { email })}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("auth.otpCodeLabel")}</FormLabel>
                  <FormControl>
                    <div className="flex justify-center">
                      <InputOTP maxLength={6} {...field}>
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
                  </FormControl>
                  <FormDescription className="text-center">
                    {t("auth.otpCodeDescription")}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-3">
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
                size="lg">
                {isLoading ? t("common.loading") : t("auth.verifyOtp")}
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleResend}
                disabled={!canResend || isLoading}
                size="lg">
                {canResend
                  ? t("auth.resendOtp")
                  : t("auth.resendOtpCountdown", { seconds: countdown })}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
