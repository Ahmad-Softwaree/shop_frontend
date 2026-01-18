export { auth as middleware } from "@/auth";

export const config = {
  matcher: [
    "/products/:path*",
    "/profile/:path*",
    "/change-password/:path*",
    "/login",
    "/register",
    "/authentication",
  ],
};
