"use client";

import { useTranslation } from "react-i18next";
import { User, Mail, KeyRound, AtSign, Phone, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/store/auth.store";
import { useSearchParams } from "next/navigation";
import MyProductsTab from "@/components/sections/MyProductsTab";

export default function ProfilePage() {
  const { t } = useTranslation();
  const { modal, openModal } = useModalStore();
  const { user } = useAuthStore();
  const searchParams = useSearchParams();
  const [twoFactorAuthEnabled, setTwoFactorAuthEnabled] = useState<boolean>(
    user?.twoFactorAuthEnabled || false
  );
  const defaultTab = searchParams.get("tab") || "profile";

  useEffect(() => {
    setTwoFactorAuthEnabled(user?.twoFactorAuthEnabled || false);
  }, [user]);
  return (
    <AnimateOnScroll animation="fade-up">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent">
              {t("profile.title")}
            </h1>
            <p className="text-muted-foreground mt-2">
              {t("profile.form.update_description")}
            </p>
          </div>

          <Tabs defaultValue={defaultTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                {t("profile.title")}
              </TabsTrigger>
              <TabsTrigger value="products" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                {t("products.myProducts")}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
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
                          {user?.name || "N/A"}
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
                          {user?.email || "N/A"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <AtSign className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-muted-foreground">
                          {t("profile.username")}
                        </p>
                        <p className="text-lg font-semibold truncate">
                          {user?.username || "N/A"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Phone className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-muted-foreground">
                          {t("profile.phone")}
                        </p>
                        <p className="text-lg font-semibold truncate">
                          {user?.phone || "N/A"}
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

                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full"
                      asChild>
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
                <TwoFactorAuthForm
                  twoFactorAuthEnabled={twoFactorAuthEnabled}
                />
              </div>
            </TabsContent>

            <TabsContent value="products">
              <MyProductsTab />
            </TabsContent>
          </Tabs>
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
