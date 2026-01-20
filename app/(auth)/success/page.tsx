"use client";

import { useTranslation } from "react-i18next";
import Link from "next/link";
import { CheckCircle, ArrowLeft, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ENUMs } from "@/lib/enums";

export default function SuccessPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-lg w-full shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <CheckCircle className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-2xl">{t("success.title")}</CardTitle>
          <CardDescription className="text-base">
            {t("success.subtitle")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-muted-foreground">
            {t("success.message")}
          </p>
          <p className="text-center text-sm text-muted-foreground">
            {t("success.nextSteps")}
          </p>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Button asChild className="w-full" size="lg">
            <Link href={ENUMs.PAGES.PRODUCTS}>
              <ShoppingBag className="h-4 w-4 mr-2" />
              {t("success.browseProducts")}
            </Link>
          </Button>
          <Button variant="outline" asChild className="w-full">
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t("success.backHome")}
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
