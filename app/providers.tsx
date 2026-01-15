import { auth } from "@/auth";
import LanguageProvider from "@/providers/language-provider";
import { QueryProvider } from "@/providers/query-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { SessionProvider } from "next-auth/react";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Toaster } from "sonner";
import React from "react";

const Providers = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <QueryProvider>
        <NuqsAdapter>
          <LanguageProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange>
              {children}
              <Toaster richColors position="top-right" />
            </ThemeProvider>
          </LanguageProvider>
        </NuqsAdapter>
      </QueryProvider>
    </SessionProvider>
  );
};

export default Providers;
