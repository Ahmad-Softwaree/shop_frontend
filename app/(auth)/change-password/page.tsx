"use client";

import ChangePasswordForm from "@/components/forms/ChangePasswordForm";
import { AnimateOnScroll } from "@/components/shared/animate";

export default function page() {
  return (
    <div className="flex items-center justify-center p-4 min-h-screen">
      <div className="w-full max-w-md space-y-6">
        <AnimateOnScroll animation="fade-up">
          <ChangePasswordForm />
        </AnimateOnScroll>
      </div>
    </div>
  );
}
