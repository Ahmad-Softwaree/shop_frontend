import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { URLs } from "./lib/urls";

const authorizedRoutes = ["/profile", "/change-password", "/products"];
const notAuthorizedRoutes = ["/login", "/register", "/authentication"];

export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;

      if (
        isLoggedIn &&
        notAuthorizedRoutes.some((route) => nextUrl.pathname.startsWith(route))
      ) {
        return Response.redirect(new URL("/profile", nextUrl));
      }
      if (
        authorizedRoutes.some((route) => nextUrl.pathname.startsWith(route)) &&
        !isLoggedIn
      ) {
        return Response.redirect(new URL("/login", nextUrl));
      }

      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        if (user.jwt) {
          token.jwt = user.jwt;
        }
      }
      return token;
    },
    async session({ session, token }) {
      try {
        const cookieName = process.env.NEXT_PUBLIC_COOKIE_NAME as string;
        const res = await fetch(URLs.GET_AUTH, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Cookie: `${cookieName}=${token.jwt}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          session.user.id = data.id as string;
          session.user.email = data.email as string;
        } else {
          session.user.id = token.id as string;
          session.user.email = token.email as string;
        }
      } catch {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
      }

      if (token.jwt) {
        session.jwt = token.jwt as string;
      }

      return session;
    },
  },
  providers: [
    Credentials({
      credentials: {
        id: {},
        email: {},
        token: {},
        jwt: {},
      },
      async authorize(credentials) {
        return {
          id: credentials.id as string,
          email: credentials.email as string,
          jwt: credentials.jwt as string,
        };
      },
    }),
  ],
});
