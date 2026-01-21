"use client";

import { useTranslation } from "react-i18next";
import { AnimateOnScroll } from "@/components/shared/animate";
import { Button } from "@/components/ui/button";
import { ShoppingBag, TrendingUp, Shield } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { ENUMs } from "@/lib/enums";

export default function HeroSection() {
  const { t } = useTranslation();
  const session = useSession();

  return (
    <section className="min-h-[85vh] flex items-center justify-center py-20 ">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/5" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />

      {/* Content */}
      <div className="relative z-10">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          <AnimateOnScroll animation="fade-down">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <TrendingUp className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                {t("hero.badge", "Your Community Marketplace")}
              </span>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll animation="fade-down">
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              {t("hero.title", "Buy & Sell Locally, Connect Directly")}
            </h1>
          </AnimateOnScroll>

          <AnimateOnScroll animation="fade-up" delay={0.2}>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {t(
                "hero.description",
                "Join our community shop where anyone can list items for sale and buyers connect directly with sellers. Simple, safe, and social."
              )}
            </p>
          </AnimateOnScroll>

          <AnimateOnScroll animation="fade-up" delay={0.4}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
              <Button size="lg" className="min-w-48">
                <Link
                  href={
                    session?.data?.user
                      ? ENUMs.PAGES.PRODUCTS
                      : ENUMs.PAGES.LOGIN
                  }>
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  {t("hero.browseItems", "Browse Items")}
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="min-w-48">
                <Link
                  href={
                    session?.data?.user
                      ? ENUMs.PAGES.PROFILE
                      : ENUMs.PAGES.LOGIN
                  }>
                  {t("hero.listItem", "List Your Item")}
                </Link>
              </Button>
            </div>
          </AnimateOnScroll>

          {/* Trust Indicators */}
          <AnimateOnScroll animation="fade-up" delay={0.6}>
            <div className="flex flex-wrap justify-center items-center gap-8 mt-12 pt-12 border-t">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Shield className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">
                  {t("hero.secure", "Secure Payments")}
                </span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <span className="text-2xl">💳</span>
                <span className="text-sm font-medium">
                  {t("hero.payment", "Online & Cash")}
                </span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <span className="text-2xl">👥</span>
                <span className="text-sm font-medium">
                  {t("hero.community", "Active Community")}
                </span>
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  );
}
