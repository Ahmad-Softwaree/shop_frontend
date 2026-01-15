# 🔐 Authentication

This document outlines the authentication architecture and standards for the **Learning Tracker** project using **NextAuth.js v5** (Auth.js).

---

## 🚨 CRITICAL: Authentication Library

- **ONLY use NextAuth.js v5** (also known as Auth.js)
- **DO NOT use** other authentication libraries (Clerk, Supabase Auth, Firebase Auth, etc.)
- **DO NOT** implement custom JWT/session management

---

## 📁 File Structure

```
project/
├── auth.ts                           # NextAuth configuration (ROOT LEVEL)
├── middleware.ts                     # Route protection (ROOT LEVEL)
├── app/
│   └── api/
│       └── auth/
│           └── [...nextauth]/
│               └── route.ts          # Auth API handlers
├── lib/
│   └── react-query/
│       ├── actions/
│       │   └── auth.action.ts        # Server actions (register, login)
│       ├── middleware/
│       │   └── auth.middleware.ts    # Validation middleware
│       └── queries/
│           └── auth.query.ts         # Auth-related queries
└── validation/
    ├── login.validation.ts
    └── register.validation.ts
```

---

## 🔧 Core Configuration

### 1️⃣ NextAuth Configuration (`auth.ts`)

**Location:** Root level (`/auth.ts`)

**Required Setup:**

```typescript
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { db } from "./lib/db/client";
import { userSchema } from "./lib/db/schemas";
import { eq } from "drizzle-orm";
import { compare } from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        // Validate credentials against database
        const [user] = await db
          .select()
          .from(userSchema)
          .where(eq(userSchema.email, credentials.email as string));

        if (!user) {
          throw new Error("Invalid Credentials");
        }

        const comparePassword = await compare(
          credentials.password as string,
          user.password
        );

        if (!comparePassword) {
          throw new Error("Invalid Credentials");
        }

        return {
          id: user.id.toString(),
          email: user.email,
        };
      },
    }),
  ],
});
```

**Key Rules:**

- ✅ Use `Credentials` provider for email/password auth
- ✅ Use `bcryptjs` for password hashing (NOT `bcrypt`)
- ✅ Export: `handlers`, `signIn`, `signOut`, `auth`
- ❌ DO NOT add JWT/session callbacks unless absolutely necessary
- ❌ DO NOT store sensitive data in session

---

### 2️⃣ Middleware (`middleware.ts`)

**Location:** Root level (`/middleware.ts`)

**Required Setup:**

```typescript
export { auth as middleware } from "@/auth";
```

**Key Rules:**

- ✅ Keep it simple - just export `auth` as `middleware`
- ✅ NextAuth handles route protection automatically
- ❌ DO NOT add custom middleware logic here
- ❌ DO NOT use `matcher` config (let NextAuth handle it)

---

### 3️⃣ API Route Handler (`app/api/auth/[...nextauth]/route.ts`)

**Location:** `app/api/auth/[...nextauth]/route.ts`

**Required Setup:**

```typescript
import { handlers } from "@/auth";

export const { GET, POST } = handlers;
```

**Key Rules:**

- ✅ Export `GET` and `POST` from NextAuth handlers
- ✅ Use catch-all route: `[...nextauth]`
- ❌ DO NOT add custom logic here

---

## 🔐 Authentication Actions

### Server Actions (`lib/react-query/actions/auth.action.ts`)

**Always mark with:** `"use server"`

#### Registration

```typescript
"use server";
import { hash } from "bcryptjs";
import { db } from "@/lib/db/client";
import { userSchema } from "@/lib/db/schemas";
import { RegisterSchema } from "@/validation/register.validation";

export const register = async (data: RegisterSchema) => {
  try {
    const hashedPassword = await hash(
      data.password,
      parseInt(process.env.HASH_PASSWORD_SALT_ROUNDS || "10")
    );

    await db.insert(userSchema).values({
      ...data,
      password: hashedPassword,
    });

    return true;
  } catch (error: any) {
    // Handle duplicate email error
    if (error.cause.code === "23505") {
      throw new Error("errors.emailInUse");
    }
    throw error;
  }
};
```

#### Login

```typescript
export const login = async (data: LoginSchema) => {
  try {
    const user = await db.query.userSchema.findFirst({
      where: eq(userSchema.email, data.email),
    });

    if (!user) {
      throw new Error("errors.invalidCredentials");
    }

    if (!(await bcrypt.compare(data.password, user.password))) {
      throw new Error("errors.invalidCredentials");
    }

    await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    return user;
  } catch (error: any) {
    throw error;
  }
};
```

**Key Rules:**

- ✅ Use `"use server"` directive
- ✅ Hash passwords with `bcryptjs` (salt rounds from env: `HASH_PASSWORD_SALT_ROUNDS`)
- ✅ Use i18n error keys (e.g., `"errors.invalidCredentials"`)
- ✅ Set `redirect: false` in `signIn()`
- ❌ DO NOT return sensitive user data (passwords, tokens)
- ❌ DO NOT use generic error messages

---

## 🛡️ Validation Middleware

**Location:** `lib/react-query/middleware/auth.middleware.ts`

```typescript
import { getLoginSchema, LoginSchema } from "@/validation/login.validation";
import { i18n } from "i18next";

export const loginMiddleware = async (lang: i18n, data: LoginSchema) => {
  try {
    let schema = getLoginSchema(lang);
    let validation = schema.safeParse(data);

    if (!validation.success) {
      throw new Error(validation.error.issues[0].message);
    }
  } catch (error) {
    throw error;
  }
};
```

**Key Rules:**

- ✅ Use Zod for validation
- ✅ Pass language parameter for i18n errors
- ✅ Use `safeParse()` for validation
- ❌ DO NOT validate in components

---

## 🔒 Protecting Routes

### Server Components (Recommended)

```typescript
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return <div>Protected Content</div>;
}
```

### Client Components

```typescript
"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ClientProtectedComponent() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") return <div>Loading...</div>;

  return <div>Protected Content</div>;
}
```

**Key Rules:**

- ✅ Prefer server-side protection (using `auth()`)
- ✅ Use `redirect()` for server components
- ✅ Use `useSession()` + `useRouter()` for client components
- ❌ DO NOT rely solely on client-side protection

---

## 🔑 Environment Variables

**Required in `.env`:**

```env
AUTH_SECRET=your-secret-key-here
HASH_PASSWORD_SALT_ROUNDS=10
```

**Key Rules:**

- ✅ Use `AUTH_SECRET` for NextAuth (auto-generated or custom)
- ✅ Set `HASH_PASSWORD_SALT_ROUNDS` (default: 10)
- ❌ DO NOT commit `.env` to version control
- ❌ DO NOT use weak secrets in production

---

## 📋 Checklist

Before implementing authentication:

- [ ] `auth.ts` configured at root level
- [ ] `middleware.ts` exports `auth as middleware`
- [ ] API route handler at `app/api/auth/[...nextauth]/route.ts`
- [ ] Server actions in `lib/react-query/actions/auth.action.ts`
- [ ] Validation middleware in `lib/react-query/middleware/auth.middleware.ts`
- [ ] Validation schemas in `validation/` folder
- [ ] Environment variables set in `.env`
- [ ] Protected routes using `auth()` or `useSession()`

---

## ❌ Common Mistakes

- ❌ Using `bcrypt` instead of `bcryptjs` (causes issues in serverless)
- ❌ Not using `"use server"` in server actions
- ❌ Returning passwords or tokens in API responses
- ❌ Using custom JWT logic instead of NextAuth sessions
- ❌ Not handling database errors (e.g., duplicate email)
- ❌ Using generic error messages instead of i18n keys
- ❌ Protecting routes only on client side

---

## 🎯 Quick Reference

| Task                   | File                                            | Key Function        |
| ---------------------- | ----------------------------------------------- | ------------------- |
| Configure auth         | `auth.ts`                                       | `NextAuth()`        |
| Protect routes         | `middleware.ts`                                 | `export auth`       |
| API handlers           | `app/api/auth/[...nextauth]/route.ts`           | `handlers`          |
| Register user          | `lib/react-query/actions/auth.action.ts`        | `register()`        |
| Login user             | `lib/react-query/actions/auth.action.ts`        | `login()`           |
| Validate input         | `lib/react-query/middleware/auth.middleware.ts` | `loginMiddleware()` |
| Check session (server) | Component                                       | `await auth()`      |
| Check session (client) | Component                                       | `useSession()`      |

---

**Remember:** Keep authentication simple, secure, and consistent. Always use NextAuth.js for all auth-related functionality.
