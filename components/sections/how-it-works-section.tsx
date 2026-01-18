"use client";

import { useTranslation } from "react-i18next";
import {
  UserPlus,
  Upload,
  Search,
  MessageCircle,
  ArrowRight,
} from "lucide-react";
import { AnimateOnScroll } from "@/components/shared/animate";

const steps = [
  {
    icon: UserPlus,
    key: "step1",
  },
  {
    icon: Upload,
    key: "step2",
  },
  {
    icon: Search,
    key: "step3",
  },
  {
    icon: MessageCircle,
    key: "step4",
  },
];

export default function HowItWorksSection() {
  const { t } = useTranslation();

  return (
    <section className="py-24">
      {/* Section Header */}
      <div className="text-center mb-16 space-y-4">
        <AnimateOnScroll animation="fade-up">
          <h2 className="text-4xl md:text-5xl font-bold">
            {t("howItWorks.title", "How It Works")}
          </h2>
        </AnimateOnScroll>
        <AnimateOnScroll animation="fade-up" delay={0.2}>
          <p className="text-lg text-muted-foreground">
            {t(
              "howItWorks.subtitle",
              "Getting started is simple - join, list, connect, and transact"
            )}
          </p>
        </AnimateOnScroll>
      </div>

      {/* Steps */}
      <div className="relative max-w-6xl mx-auto">
        {/* Connection Line */}
        <div className="hidden md:block absolute top-24 left-[16.66%] right-[16.66%] h-0.5 bg-gradient-to-r from-primary via-primary to-primary opacity-20" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <AnimateOnScroll
                key={step.key}
                animation="fade-up"
                delay={0.15 * index}>
                <div className="relative flex flex-col items-center text-center space-y-6 group">
                  {/* Step Number */}
                  <div className="relative z-10">
                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl group-hover:blur-2xl transition-all" />
                    <div className="relative w-24 h-24 rounded-full bg-background border-4 border-primary flex items-center justify-center">
                      <Icon className="w-10 h-10 text-primary" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="space-y-3">
                    <h3 className="text-xl font-bold">
                      {t(`howItWorks.${step.key}.title` as any)}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {t(`howItWorks.${step.key}.description` as any)}
                    </p>
                  </div>

                  {/* Arrow (hidden on last item and mobile) */}
                  {index < steps.length - 1 && (
                    <ArrowRight className="hidden md:block absolute top-10 -end-8 rtl:rotate-180 w-6 h-6 text-primary/40" />
                  )}
                </div>
              </AnimateOnScroll>
            );
          })}
        </div>
      </div>
    </section>
  );
}
