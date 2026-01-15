"use client";

import Link from "next/link";
import Image from "next/image";
import { Github, Home, LogIn, UserPlus, User, LogOut } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { LangToggle } from "@/components/lang-toggle";
import { Button } from "@/components/ui/button";
import { ENUMs } from "@/lib/enums";
import { useLogout } from "@/lib/react-query/queries/auth.query";

export default function Header() {
  const { t } = useTranslation();
  const { data: session } = useSession();
  const pathname = usePathname();
  const isInProfile =
    pathname?.startsWith("/profile") ||
    pathname?.startsWith("/change-password");
  const { mutateAsync: logoutMutation, isPending } = useLogout();

  const handleLogout = async () => {
    await logoutMutation();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className=" flex h-16 items-center justify-between ">
        {/* Logo and Project Name */}
        <Link
          href={ENUMs.PAGES.HOME}
          className="flex items-center gap-2 md:gap-3 group">
          <div className="relative w-8 h-8 md:w-10 md:h-10 transition-transform group-hover:scale-110">
            <Image
              src="/logo.png"
              alt="Shop Logo"
              fill
              className="object-contain rounded-full"
            />
          </div>
          <span className="text-base md:text-xl font-bold text-primary hidden sm:inline">
            {t("header.projectName")}
          </span>
        </Link>

        <div className="flex items-center gap-1 md:gap-2">
          {/* Auth Buttons - Hidden on small screens, shown on md+ */}
          {!session ? (
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
          ) : isInProfile ? (
            <div className="hidden md:flex items-center gap-2">
              <Button
                variant="destructive"
                size="sm"
                onClick={handleLogout}
                disabled={isPending}>
                <LogOut className="h-4 w-4 mr-2" />
                {t("profile.logout")}
              </Button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href={ENUMs.PAGES.PROFILE}>
                  <User className="h-4 w-4 mr-2" />
                  {t("header.profile")}
                </Link>
              </Button>
            </div>
          )}

          {/* Mobile Auth Buttons - Icon only */}
          {!session ? (
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
          ) : isInProfile ? (
            <div className="flex md:hidden items-center gap-1">
              <Button
                variant="destructive"
                size="icon"
                onClick={handleLogout}
                disabled={isPending}
                aria-label={t("profile.logout")}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex md:hidden items-center gap-1">
              <Button variant="ghost" size="icon" asChild>
                <Link
                  href={ENUMs.PAGES.PROFILE}
                  aria-label={t("header.profile")}>
                  <User className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          )}

          <div className="w-px h-6 bg-border mx-1" />

          <Button
            variant="outline"
            size="icon"
            className="rounded-full"
            asChild>
            <Link href={ENUMs.PAGES.HOME} aria-label={t("header.home")}>
              <Home className="h-5 w-5" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <a
              href="https://github.com/Ahmad-Softwaree"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub Profile">
              <Github className="h-5 w-5" />
            </a>
          </Button>
          <ThemeToggle />
          <LangToggle />
        </div>
      </div>
    </header>
  );
}
