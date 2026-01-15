"use client";

import { Github, LogIn, UserPlus, LayoutDashboard } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ENUMs } from "@/lib/enums";

export default function Footer() {
  const { t } = useTranslation();
  const { data: session } = useSession();
  const pathname = usePathname();
  const isInDashboard =
    pathname?.startsWith("/dashboard") ||
    pathname?.startsWith("/profile") ||
    pathname?.startsWith("/courses");
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background py-8">
      <Separator className="mb-6" />

      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground text-center md:text-left">
          © {currentYear} {t("header.projectName")}. {t("footer.rights")}.
        </p>

        {/* Links */}
        <div className="flex items-center gap-6">
          {/* Auth Buttons - Hidden on small screens, shown on md+ */}
          {!session && (
            <div className="hidden md:flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href={ENUMs.PAGES.LOGIN}>
                  <LogIn className="h-4 w-4 mr-2" />
                  {t("auth.login")}
                </Link>
              </Button>
              <Button size="sm" asChild>
                <Link href={ENUMs.PAGES.REGISTER}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  {t("auth.register")}
                </Link>
              </Button>
            </div>
          )}

          {/* Mobile Auth Buttons - Icon only */}
          {!session && (
            <div className="flex md:hidden items-center gap-1">
              <Button variant="ghost" size="icon" asChild>
                <Link href={ENUMs.PAGES.LOGIN} aria-label={t("auth.login")}>
                  <LogIn className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="default" size="icon" asChild>
                <Link
                  href={ENUMs.PAGES.REGISTER}
                  aria-label={t("auth.register")}>
                  <UserPlus className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          )}

          <a
            href="https://github.com/Ahmad-Softwaree"
            target="_blank"
            rel="noopener noreferrer"
            className="english_font flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
            <Github className="h-4 w-4" />
            {t("footer.github")}
          </a>
          <a
            href="https://ahmad-software.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground hover:text-primary transition-colors">
            {t("footer.portfolio")}
          </a>
        </div>
      </div>
    </footer>
  );
}
