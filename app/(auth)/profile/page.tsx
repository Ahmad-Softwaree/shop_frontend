"use client";

import { useSession } from "next-auth/react";
import { useTranslation } from "react-i18next";
import { User, Mail, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useModalStore } from "@/lib/store/modal.store";
import Modal from "@/components/shared/Modal";
import ProfileForm from "@/components/forms/ProfileForm";
import TwoFactorAuthForm from "@/components/forms/TwoFactorAuthForm";
import { AnimateOnScroll } from "@/components/shared/animate";
import Link from "next/link";
import { ENUMs } from "@/lib/enums";
import { useGetAuth } from "@/lib/react-query/queries/auth.query";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const { data: session } = useSession();
  const { t } = useTranslation();
  const { modal, openModal } = useModalStore();
  const { data: authData } = useGetAuth();
  let [twoFactorAuthEnabled, setTwoFactorAuthEnabled] = useState<boolean>(
    authData?.twoFactorAuthEnabled || false
  );

  useEffect(() => {
    setTwoFactorAuthEnabled(authData?.twoFactorAuthEnabled || false);
  }, [authData]);

  return (
    <AnimateOnScroll animation="fade-up">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent">
              {t("profile.title")}
            </h1>
            <p className="text-muted-foreground mt-2">
              {t("profile.form.update_description")}
            </p>
          </div>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                {t("profile.title")}
              </CardTitle>
              <CardDescription>
                {t("profile.form.update_description")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-muted-foreground">
                      {t("profile.name")}
                    </p>
                    <p className="text-lg font-semibold truncate">
                      {session?.user?.name || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-muted-foreground">
                      {t("profile.email")}
                    </p>
                    <p className="text-lg font-semibold truncate">
                      {session?.user?.email || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <Button
                  onClick={() => openModal({ type: "update" })}
                  className="w-full"
                  size="lg">
                  {t("profile.updateButton")}
                </Button>

                <Button variant="outline" size="lg" className="w-full" asChild>
                  <Link
                    href={ENUMs.PAGES.CHANGE_PASSWORD}
                    className="flex items-center gap-2">
                    <KeyRound className="h-4 w-4" />
                    {t("profile.changePassword")}
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Two-Factor Authentication Card */}
          <div className="mt-6">
            <TwoFactorAuthForm twoFactorAuthEnabled={twoFactorAuthEnabled} />
          </div>
        </div>

        {modal == "update" && (
          <Modal
            title={t("profile.form.update_title")}
            description={t("profile.form.update_description")}>
            <ProfileForm />
          </Modal>
        )}
      </div>
    </AnimateOnScroll>
  );
}
