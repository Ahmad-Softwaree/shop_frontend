/**
 * Helper utilities for accessing the backend JWT token
 *
 * The backend token flows through NextAuth as follows:
 * 1. Login: Backend returns { token, user }
 * 2. authorize(): Returns user with jwt
 * 3. jwt(): Stores jwt in NextAuth JWT
 * 4. session(): Exposes jwt in session object
 * 5. Cookie: Token is also stored in cookie for API calls
 */

import { auth } from "@/auth";
import { Session } from "next-auth";

/**
 * Get backend JWT token from server-side session
 * Use this in Server Components, Server Actions, Route Handlers, or Middleware
 *
 * @example
 * ```tsx
 * // In a Server Component
 * import { getBackendToken } from "@/lib/helpers/token";
 *
 * export default async function ProfilePage() {
 *   const token = await getBackendToken();
 *   if (!token) redirect("/login");
 *
 *   // Use token for server-side API calls
 *   const response = await fetch(`${process.env.API}/users/me`, {
 *     headers: { Authorization: `Bearer ${token}` }
 *   });
 *   return <div>...</div>;
 * }
 * ```
 */
export async function getBackendToken(): Promise<string | null> {
  const session = await auth();
  return session?.jwt ?? null;
}

/**
 * Get backend JWT token from client-side session
 * Use this in Client Components
 *
 * @example
 * ```tsx
 * // In a Client Component
 * "use client";
 * import { useSession } from "next-auth/react";
 * import { getClientBackendToken } from "@/lib/helpers/token";
 *
 * export function ProfileClient() {
 *   const { data: session } = useSession();
 *   const token = getClientBackendToken(session);
 *
 *   // Use token for client-side API calls
 *   const fetchData = async () => {
 *     if (!token) return;
 *     const response = await fetch(`${process.env.API}/users/me`, {
 *       headers: { Authorization: `Bearer ${token}` }
 *     });
 *   };
 *
 *   return <div>...</div>;
 * }
 * ```
 */
export function getClientBackendToken(session: Session | null): string | null {
  return session?.jwt ?? null;
}

/**
 * Check if user is authenticated with a valid backend token
 * Use this in Server Components or Server Actions
 *
 * @example
 * ```tsx
 * import { isAuthenticated } from "@/lib/helpers/token";
 *
 * export default async function ProtectedPage() {
 *   const authenticated = await isAuthenticated();
 *   if (!authenticated) {
 *     redirect("/login");
 *   }
 *   return <div>Protected Content</div>;
 * }
 * ```
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await auth();
  return !!(session?.user && session?.jwt);
}
