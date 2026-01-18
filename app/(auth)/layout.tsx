"use client";
import { ENUMs } from "@/lib/enums";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useAuthStore } from "@/lib/store/auth.store";
import { useGetAuth } from "@/lib/react-query/queries/auth.query";

const layout = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession();
  const { data: user } = useGetAuth();
  const { setUser } = useAuthStore();

  useEffect(() => {
    if (status === "unauthenticated" || !session) {
      redirect(ENUMs.PAGES.LOGIN);
    }
  }, [status, session]);

  useEffect(() => {
    if (user) {
      setUser(user);
    }
  }, [user]);

  return <div className="container mx-auto px-4 py-8">{children}</div>;
};

export default layout;
