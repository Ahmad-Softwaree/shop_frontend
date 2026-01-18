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
  const isHomePage = pathname === ENUMs.PAGES.HOME;
  const isAuthPage =
    pathname?.startsWith(ENUMs.PAGES.PROFILE) ||
    pathname?.startsWith(ENUMs.PAGES.PRODUCTS) ||
    pathname?.startsWith(ENUMs.PAGES.CHANGE_PASSWORD);
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
          ) : null}

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
          ) : null}

          <div className="w-px h-6 bg-border mx-1" />

          {/* Show profile and logout icons for logged in users */}
          {session && (
            <>
              {/* Products link - only shown on auth pages */}
              {isAuthPage && (
                <Button variant="outline" size="icon" asChild>
                  <Link
                    href={ENUMs.PAGES.PRODUCTS}
                    aria-label={t("header.products")}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round">
                      <path d="m7.5 4.27 9 5.15" />
                      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
                      <path d="m3.3 7 8.7 5 8.7-5" />
                      <path d="M12 22V12" />
                    </svg>
                  </Link>
                </Button>
              )}
              <Button
                variant="outline"
                size="icon"
                className="rounded-full"
                asChild>
                <Link
                  href={ENUMs.PAGES.PROFILE}
                  aria-label={t("header.profile")}>
                  <User className="h-5 w-5" />
                </Link>
              </Button>
              <Button
                variant="destructive"
                size="icon"
                className="rounded-full"
                onClick={handleLogout}
                disabled={isPending}
                aria-label={t("profile.logout")}>
                <LogOut className="h-5 w-5" />
              </Button>
            </>
          )}

          <Button
            variant="outline"
            size="icon"
            className="rounded-full"
            asChild>
            <Link href={ENUMs.PAGES.HOME} aria-label={t("header.home")}>
              <Home className="h-5 w-5" />
            </Link>
          </Button>
          {isHomePage && (
            <Button variant="ghost" size="icon" asChild>
              <a
                href="https://github.com/Ahmad-Softwaree"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub Profile">
                <Github className="h-5 w-5" />
              </a>
            </Button>
          )}
          <ThemeToggle />
          <LangToggle />
        </div>
      </div>
    </header>
  );
}
