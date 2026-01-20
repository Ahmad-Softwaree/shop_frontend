"use client";

import { useTranslation } from "react-i18next";
import Link from "next/link";
import { XCircle, ArrowLeft, ShoppingBag } from "lucide-react";
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

export default function CancelPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-lg w-full shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center">
            <XCircle className="h-10 w-10 text-destructive" />
          </div>
          <CardTitle className="text-2xl">{t("cancel.title")}</CardTitle>
          <CardDescription className="text-base">
            {t("cancel.subtitle")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-muted-foreground">
            {t("cancel.message")}
          </p>
          <p className="text-center text-sm text-muted-foreground">
            {t("cancel.reassurance")}
          </p>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Button asChild className="w-full" size="lg">
            <Link href={ENUMs.PAGES.PRODUCTS}>
              <ShoppingBag className="h-4 w-4 mr-2" />
              {t("cancel.browseProducts")}
            </Link>
          </Button>
          <Button variant="outline" asChild className="w-full">
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t("cancel.backHome")}
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
