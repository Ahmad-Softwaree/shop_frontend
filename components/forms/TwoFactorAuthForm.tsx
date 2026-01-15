"use client";

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { QRCodeSVG } from "qrcode.react";
import { Shield, ShieldCheck, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { get2FASecret } from "@/lib/react-query/actions/auth.action";
import {
  useActivate2FA,
  useDisable2FA,
} from "@/lib/react-query/queries/auth.query";
import { toast } from "sonner";

interface TwoFactorAuthFormProps {
  twoFactorAuthEnabled: boolean;
}

const TwoFactorAuthForm = ({
  twoFactorAuthEnabled,
}: TwoFactorAuthFormProps) => {
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [qrCode, setQrCode] = useState("");
  const [otp, setOtp] = useState("");
  const { mutateAsync: activate2FA, isPending: isActivating } =
    useActivate2FA();
  const { mutateAsync: disable2FA, isPending: isDisabling } = useDisable2FA();

  const handleEnable2FA = async () => {
    try {
      const secret = await get2FASecret();
      const issuer = process.env.NEXT_PUBLIC_APP_NAME || "Learning Tracker";
      const qrCodeUrl = `otpauth://totp/${issuer}?secret=${secret}&issuer=${issuer}`;
      setQrCode(qrCodeUrl);
      setStep(2);
    } catch (error: any) {
      toast.error(t(error.message) || t("errors.2FASetupFailed"));
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      toast.error(t("errors.invalid2FACode"));
      return;
    }
    await activate2FA({ code: otp }).then(() => {
      setStep(1);
      setOtp("");
      setQrCode("");
    });
  };

  const handleDisable2FA = async () => {
    await disable2FA().then(() => {
      setStep(1);
      setOtp("");
      setQrCode("");
    });
  };

  const handleCancelSetup = () => {
    setStep(step === 3 ? 2 : 1);
    if (step === 1) {
      setOtp("");
      setQrCode("");
    }
  };

  // Step 1 & 2: Not enabled yet
  if (!twoFactorAuthEnabled) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            {t("auth.twoFactorAuth")}
          </CardTitle>
          <CardDescription>
            {t("auth.twoFactorAuthDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {step === 1 && (
            <Button
              onClick={handleEnable2FA}
              className="w-full"
              size="lg"
              variant="outline">
              <Shield className="mr-2 h-4 w-4" />
              {t("auth.enable2FA")}
            </Button>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center space-y-4">
                <p className="text-sm font-medium">{t("auth.scanQRCode")}</p>
                <p className="text-xs text-muted-foreground">
                  {t("auth.qrCodeInstructions")}
                </p>
                <div className="flex justify-center p-4 bg-white rounded-lg">
                  <QRCodeSVG value={qrCode} size={200} />
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleCancelSetup}
                  variant="outline"
                  className="flex-1">
                  {t("auth.cancelSetup")}
                </Button>
                <Button onClick={() => setStep(3)} className="flex-1">
                  {t("auth.continueSetup")}
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="space-y-4">
                <p className="text-sm font-medium text-center">
                  {t("auth.enterOTP")}
                </p>
                <div className="flex justify-center" dir="ltr">
                  <InputOTP maxLength={6} value={otp} onChange={setOtp}>
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
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleCancelSetup}
                  variant="outline"
                  className="flex-1">
                  {t("auth.cancelSetup")}
                </Button>
                <Button
                  onClick={handleVerifyOTP}
                  disabled={otp.length !== 6 || isActivating}
                  className="flex-1">
                  {isActivating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t("auth.verifyOTP")}
                    </>
                  ) : (
                    t("auth.verifyOTP")
                  )}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  // 2FA is enabled
  return (
    <Card className="shadow-lg border-green-200 dark:border-green-900">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-600 dark:text-green-400">
          <ShieldCheck className="h-5 w-5" />
          {t("auth.twoFactorEnabled")}
        </CardTitle>
        <CardDescription>
          {t("auth.twoFactorEnabledDescription")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          onClick={handleDisable2FA}
          disabled={isDisabling}
          variant="destructive"
          className="w-full"
          size="lg">
          {isDisabling ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t("auth.disable2FA")}
            </>
          ) : (
            t("auth.disable2FA")
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default TwoFactorAuthForm;
