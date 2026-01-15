import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { verify } from "otplib";

export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnProfile = nextUrl.pathname.startsWith("/profile");
      const isOnChangePassword =
        nextUrl.pathname.startsWith("/change-password");
      const isOnAuthPage =
        nextUrl.pathname.startsWith("/login") ||
        nextUrl.pathname.startsWith("/register");

      // Redirect authenticated users away from auth pages
      if (isLoggedIn && isOnAuthPage) {
        return Response.redirect(new URL("/profile", nextUrl));
      }

      // Protect authenticated routes
      if ((isOnProfile || isOnChangePassword) && !isLoggedIn) {
        return Response.redirect(new URL("/login", nextUrl));
      }

      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      // TODO: implement axios backend request here
      // Re-fetch fresh user data from backend
      // const response = await axios.get(`/api/users/${token.id}`);
      // const dbUser = response.data;
      // if (dbUser) {
      //   session.user.id = dbUser.id;
      //   session.user.name = dbUser.name;
      //   session.user.email = dbUser.email;
      // }

      // For now, use token data
      if (token.id) {
        session.user.id = token.id as string;
      }

      return session;
    },
  },
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
        token: {},
      },
      async authorize(credentials) {
        // TODO: implement axios backend request here
        // const response = await axios.post('/api/auth/validate', credentials);
        // const user = response.data;
        // return {
        //   id: user.id.toString(),
        //   email: user.email,
        //   name: user.name,
        // };
        throw new Error("Not implemented");
      },
    }),
  ],
});
