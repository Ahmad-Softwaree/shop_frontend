export { auth as middleware } from "@/auth";

export const config = {
  matcher: [
    "/profile/:path*",
    "/change-password/:path*",
    "/login",
    "/register",
  ],
};
