"use client";

import AuthenticationOtpForm from "@/components/forms/AuthenticationOtpForm";
import { AnimateOnScroll } from "@/components/shared/animate";

export default function AuthenticationPage() {
  return (
    <div className="flex items-center justify-center p-4 min-h-screen">
      <div className="w-full max-w-md space-y-6">
        <AnimateOnScroll animation="fade-up">
          <AuthenticationOtpForm />
        </AnimateOnScroll>
      </div>
    </div>
  );
}
