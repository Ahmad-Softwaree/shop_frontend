import { auth } from "@/auth";
import { ENUMs } from "@/lib/enums";
import { redirect } from "next/navigation";
import React from "react";

const layout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();
  if (!!session?.user?.id) {
    redirect(ENUMs.PAGES.PROFILE);
  }
  return children;
};

export default layout;
