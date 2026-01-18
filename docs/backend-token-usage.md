# Backend JWT Token Usage Guide

## Overview

The backend JWT token from your NestJS API is now fully integrated with NextAuth and available throughout your Next.js application.

## Token Flow

```
1. User Login → NestJS Backend
   ↓
2. Backend returns: { token: "jwt...", user: {...} }
   ↓
3. NextAuth authorize() receives token
   ↓
4. Token stored in:
   - NextAuth JWT (server-side)
   - NextAuth Session (server & client)
   - Cookie (for axios interceptors)
   ↓
5. Token available everywhere in your app
```

## Storage Locations

### 1. NextAuth JWT (Server-Side)

- **Location**: `token.jwt` in JWT callback
- **Encrypted**: Yes, by NextAuth
- **Accessible**: Server-side only
- **Usage**: Internal NextAuth state

### 2. NextAuth Session

- **Location**: `session.jwt`
- **Accessible**: Both server and client
- **Usage**: Primary access point for the token

### 3. Cookie

- **Name**: Defined in `ENUMs.GLOBAL.COOKIE_NAME`
- **Set**: During login and session callback
- **Usage**: Axios interceptors automatically attach to API calls

## Usage Examples

### Server Components

```tsx
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.jwt) {
    redirect("/login");
  }

  // Option 1: Use the token directly
  const token = session.jwt;
  const response = await fetch(`${process.env.API}/users/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  // Option 2: Use helper function
  const token = await getBackendToken();

  return <div>Profile Page</div>;
}
```

### Client Components

```tsx
"use client";
import { useSession } from "next-auth/react";
import { getClientBackendToken } from "@/lib/helpers/token";

export function ProfileClient() {
  const { data: session, status } = useSession();
  const token = getClientBackendToken(session);

  const updateProfile = async (data: any) => {
    if (!token) {
      console.error("No backend token available");
      return;
    }

    const response = await fetch(`${process.env.API}/users/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
  };

  if (status === "loading") return <div>Loading...</div>;
  if (!session?.jwt) return <div>Not authenticated</div>;

  return <div>Profile: {session.user.name}</div>;
}
```

### Server Actions

```tsx
"use server";
import { auth } from "@/auth";
import { authApi } from "@/lib/config/api.config";

export async function updateUserProfile(formData: FormData) {
  const session = await auth();

  if (!session?.jwt) {
    throw new Error("Unauthorized");
  }

  // Option 1: Use authApi (token automatically from cookie)
  const { data } = await authApi.put("/users/update", {
    name: formData.get("name"),
  });

  // Option 2: Manual fetch with token
  const response = await fetch(`${process.env.API}/users/update`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.jwt}`,
    },
    body: JSON.stringify({ name: formData.get("name") }),
  });

  return data;
}
```

### Axios API Calls (Recommended)

The `authApi` instance automatically includes the token from the cookie:

```tsx
"use client";
import { authApi } from "@/lib/config/api.config";

export function useProfile() {
  const fetchProfile = async () => {
    // Token automatically attached via interceptor
    const { data } = await authApi.get("/users/me");
    return data;
  };

  const updateProfile = async (updates: any) => {
    // Token automatically attached via interceptor
    const { data } = await authApi.put("/users/update", updates);
    return data;
  };

  return { fetchProfile, updateProfile };
}
```

### Middleware (Route Protection)

The token is available in middleware through the `auth()` function:

```tsx
// middleware.ts (already configured)
import { auth } from "@/auth";

export default auth((req) => {
  const token = req.auth?.jwt;

  // Use token for additional checks if needed
  if (req.nextUrl.pathname.startsWith("/admin") && token) {
    // Verify admin role from token payload
  }
});
```

### React Query Hooks

```tsx
"use client";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { authApi } from "@/lib/config/api.config";

export function useUserProfile() {
  const { data: session } = useSession();

  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      // authApi automatically uses token from cookie
      const { data } = await authApi.get("/users/me");
      return data;
    },
    enabled: !!session?.jwt,
  });
}

export function useUpdateProfile() {
  return useMutation({
    mutationFn: async (updates: any) => {
      // authApi automatically uses token from cookie
      const { data } = await authApi.put("/users/update", updates);
      return data;
    },
  });
}
```

## Token Verification

### Check Token in Component

```tsx
"use client";
import { useSession } from "next-auth/react";

export function TokenStatus() {
  const { data: session } = useSession();

  if (!session) {
    return <div>Not logged in</div>;
  }

  if (!session.jwt) {
    return <div>No backend token available</div>;
  }

  // Optional: Decode token to check expiration
  const tokenParts = session.jwt.split(".");
  if (tokenParts.length === 3) {
    try {
      const payload = JSON.parse(atob(tokenParts[1]));
      const isExpired = payload.exp * 1000 < Date.now();

      if (isExpired) {
        return <div>Token expired, please login again</div>;
      }
    } catch (e) {
      console.error("Failed to decode token", e);
    }
  }

  return <div>Authenticated with valid token</div>;
}
```

## Important Notes

### 1. Cookie vs Session

- **Cookie**: Used by axios interceptors for automatic token attachment
- **Session**: Used by Next.js components and server actions
- Both are set during login and kept in sync

### 2. Token Refresh

If your backend implements token refresh:

```tsx
// Add to auth.ts jwt callback
jwt({ token, user, trigger }) {
  if (trigger === "update") {
    // Handle token refresh
    // You can update the token here
  }
  return token;
}
```

### 3. Logout

The token is automatically cleared when calling `signOut()`:

```tsx
import { signOut } from "next-auth/react";

// This will clear the session and cookies
await signOut({ callbackUrl: "/login" });
```

### 4. Security Best Practices

- ✅ Token is encrypted in NextAuth JWT
- ✅ Token is httpOnly in cookie (if configured)
- ✅ Token is transmitted over HTTPS in production
- ✅ Token expiration should match backend JWT expiration
- ❌ Never log the token to console in production
- ❌ Never store token in localStorage

## TypeScript Support

Full type safety is provided via `next-auth.d.ts`:

```typescript
// session.jwt is typed as string
const session = await auth();
const token: string = session.jwt; // ✅ Type-safe

// Token available in useSession
const { data: session } = useSession();
const token: string = session?.jwt; // ✅ Type-safe
```

## Troubleshooting

### Token not available in session

1. Check login response includes `token` field
2. Verify `jwt` is returned from `authorize()`
3. Check `jwt()` callback stores `token.jwt`
4. Ensure `session()` callback returns `session.jwt`

### Token not attached to API calls

1. Verify cookie is set: Check browser DevTools → Application → Cookies
2. Check axios interceptor is setting Authorization header
3. Ensure `authApi` is used (not `api`)

### Token expired

1. Implement token refresh in backend
2. Add refresh logic to `jwt()` callback
3. Handle 401 responses and trigger re-authentication

## Summary

Your backend JWT token is now available in:

- ✅ `session.jwt` (server components)
- ✅ `session.jwt` (client components via `useSession()`)
- ✅ Cookie (automatic axios attachment)
- ✅ Helper functions (`getBackendToken()`, etc.)

All API calls using `authApi` automatically include the token. You can also access it directly from the session when needed.
