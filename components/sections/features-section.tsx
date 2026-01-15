"use client";

import { useTranslation } from "react-i18next";
import {
  Shield,
  ShieldCheck,
  CreditCard,
  ShoppingBag,
  ShoppingCart,
  Truck,
  Headphones,
} from "lucide-react";
import { AnimateOnScroll } from "@/components/shared/animate";

const features = [
  {
    icon: Shield,
    key: "secure",
  },
  {
    icon: ShieldCheck,
    key: "twoFactorAuth",
  },
  {
    icon: CreditCard,
    key: "payment",
  },
  {
    icon: ShoppingBag,
    key: "products",
  },
  {
    icon: ShoppingCart,
    key: "cart",
  },
  {
    icon: Truck,
    key: "delivery",
  },
  {
    icon: Headphones,
    key: "support",
  },
];

export default function FeaturesSection() {
  const { t } = useTranslation();

  return (
    <section className="py-24 ">
      <div className="text-center  mb-16 space-y-4">
        <AnimateOnScroll animation="fade-up">
          <h2 className="text-4xl md:text-5xl font-bold">
            {t("features.title")}
          </h2>
        </AnimateOnScroll>
        <AnimateOnScroll animation="fade-up" delay={0.2}>
          <p className="text-lg text-muted-foreground">
            {t("features.subtitle")}
          </p>
        </AnimateOnScroll>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <AnimateOnScroll
              key={feature.key}
              animation="fade-up"
              delay={0.1 * index}>
              <div className="group relative bg-background rounded-xl p-6 border hover:border-primary/50 transition-all duration-300 hover:shadow-lg h-full">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                    <Icon className="w-8 h-8 text-primary group-hover:text-primary-foreground transition-colors" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold">
                      {t(`features.${feature.key}.title` as any)}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {t(`features.${feature.key}.description` as any)}
                    </p>
                  </div>
                </div>
              </div>
            </AnimateOnScroll>
          );
        })}
      </div>
    </section>
  );
}
