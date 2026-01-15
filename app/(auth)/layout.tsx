"use client";
import { ENUMs } from "@/lib/enums";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated" || !session) {
      redirect(ENUMs.PAGES.LOGIN);
    }
  }, [status, session]);

  return <div className="container mx-auto px-4 py-8">{children}</div>;
};

export default layout;
