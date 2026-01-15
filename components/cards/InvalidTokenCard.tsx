"use client";

import { useTranslation } from "react-i18next";
import Link from "next/link";
import { XCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ENUMs } from "@/lib/enums";

const InvalidTokenCard = () => {
  const { t } = useTranslation();

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg">
      <CardHeader className="space-y-1 text-center">
        <div className="flex justify-center mb-4">
          <XCircle className="h-12 w-12 text-destructive" />
        </div>
        <CardTitle className="text-2xl font-bold">
          {t("auth.invalidTokenTitle")}
        </CardTitle>
        <CardDescription className="text-center">
          {t("auth.invalidTokenDescription")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <Button asChild className="w-full" size="lg">
            <Link href={ENUMs.PAGES.PASSWORD_RESET}>
              {t("auth.requestNewLink")}
            </Link>
          </Button>
          <div className="text-center text-sm">
            <Link
              href={ENUMs.PAGES.LOGIN}
              className="font-medium text-primary hover:underline">
              {t("auth.backToLogin")}
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InvalidTokenCard;
