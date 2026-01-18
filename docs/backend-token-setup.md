# Backend JWT Token Integration - Quick Start

## ✅ What Was Done

Your NestJS backend JWT token is now fully integrated with NextAuth. Here's what was implemented:

### 1. **Type Definitions** (`next-auth.d.ts`)

Extended NextAuth types to include `jwt`:

- `Session.jwt` - Available in session object
- `User.jwt` - Passed from authorize() callback
- `JWT.jwt` - Stored in NextAuth JWT

### 2. **Auth Configuration** (`auth.ts`)

Updated NextAuth callbacks:

- **authorize()**: Receives token from backend, attaches to user object
- **jwt()**: Stores `jwt` in NextAuth JWT
- **session()**: Exposes `jwt` in session, stores in cookie

### 3. **API Configuration** (`lib/config/api.config.ts`)

Updated axios interceptors:

- `authApi` dynamically reads token from cookie
- Token automatically attached to all `authApi` requests
- Language header also automatically included

### 4. **Helper Functions** (`lib/helpers/token.ts`)

Created utility functions:

- `getBackendToken()` - Get token server-side
- `getClientBackendToken()` - Get token client-side
- `isAuthenticated()` - Check authentication status

## 🚀 How to Use

### Option 1: Using `authApi` (Easiest - Recommended)

```tsx
import { authApi } from "@/lib/config/api.config";

// Token is automatically attached from cookie
const { data } = await authApi.get("/users/me");
const { data } = await authApi.put("/users/update", { name: "New Name" });
```

### Option 2: Server Components

```tsx
import { auth } from "@/auth";

export default async function Page() {
  const session = await auth();
  const token = session?.jwt;

  const response = await fetch(`${process.env.API}/endpoint`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}
```

### Option 3: Client Components

```tsx
"use client";
import { useSession } from "next-auth/react";

export function Component() {
  const { data: session } = useSession();
  const token = session?.jwt;

  // Use token in API calls
}
```

### Option 4: Helper Functions

```tsx
import { getBackendToken } from "@/lib/helpers/token";

const token = await getBackendToken();
```

## 📦 What Gets Stored Where

| Location         | Value          | Encrypted         | Accessible      |
| ---------------- | -------------- | ----------------- | --------------- |
| NextAuth JWT     | `token.jwt`    | ✅ Yes            | Server only     |
| NextAuth Session | `session.jwt`  | ❌ No             | Server & Client |
| Cookie           | Full JWT token | Depends on config | Server & Client |

## 🔄 Token Flow

```
Login → Backend
  ↓
Backend returns: { token: "jwt...", user: {...} }
  ↓
authorize() receives token
  ↓
jwt() stores in token.jwt
  ↓
session() exposes in session.jwt
  ↓
Also stored in cookie for authApi
  ↓
Available everywhere!
```

## 📝 Complete Examples

See detailed examples in:

- `docs/backend-token-usage.md` - Full documentation
- `docs/token-usage-examples.tsx` - Code examples

## 🔧 Files Modified

1. ✅ `auth.ts` - Updated callbacks to handle backend token
2. ✅ `next-auth.d.ts` - Added TypeScript types
3. ✅ `lib/config/api.config.ts` - Updated axios interceptors
4. ✅ `lib/helpers/token.ts` - Created helper functions

## 🎯 Common Use Cases

### Make an authenticated API call

```tsx
import { authApi } from "@/lib/config/api.config";

// Token automatically included
const { data } = await authApi.get("/protected-endpoint");
```

### Check if user has valid token

```tsx
const session = await auth();
if (session?.jwt) {
  // User is authenticated with backend token
}
```

### Get token in Server Component

```tsx
import { getBackendToken } from "@/lib/helpers/token";

const token = await getBackendToken();
```

### Get token in Client Component

```tsx
import { useSession } from "next-auth/react";

const { data: session } = useSession();
const token = session?.jwt;
```

## 🔒 Security Notes

- ✅ Token is encrypted in NextAuth JWT (server-side)
- ✅ Token is automatically attached to API calls via interceptor
- ✅ Token is cleared on logout via `signOut()`
- ⚠️ Token in session is not encrypted (visible to client)
- ⚠️ Never log the token in production
- ⚠️ Always use HTTPS in production

## 🐛 Troubleshooting

**Token not available in session?**

1. Check backend returns `token` field in login response
2. Verify `authorize()` returns `jwt` in user object
3. Check `jwt()` callback stores `token.jwt`
4. Ensure `session()` callback returns `session.jwt`

**authApi requests failing?**

1. Verify cookie is set (check DevTools → Application → Cookies)
2. Check axios interceptor is working
3. Ensure using `authApi` (not `api`)

**Token expired errors?**

1. Implement token refresh in backend
2. Add refresh logic to NextAuth callbacks
3. Handle 401 responses and re-authenticate

## ✨ Summary

Your backend JWT token is now:

- ✅ Stored in NextAuth session
- ✅ Stored in NextAuth JWT
- ✅ Stored in cookie
- ✅ Automatically attached to `authApi` requests
- ✅ Accessible in all components (server & client)
- ✅ Type-safe with TypeScript
- ✅ Easy to use with helper functions

**Recommended approach**: Use `authApi` for all authenticated API calls - the token is automatically included!
