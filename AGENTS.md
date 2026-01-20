# 🤖 Agent Instructions & Coding Standards

This file contains **strict coding standards and architecture patterns** for the **Shop** project. All AI agents and developers **MUST** follow these rules to maintain consistency.

## 📚 About Shop

**Shop** is a modern e-commerce web application that provides a seamless online shopping experience. Users can browse products, manage their cart, complete secure purchases with Stripe, and track their orders.

### Core Features:

- 🛍️ **Product Catalog** - Browse thousands of quality products
- 🛒 **Smart Cart** - Easy cart management with saved items
- 💳 **Stripe Payments** - Secure checkout with all major payment methods
- 📦 **Order Tracking** - Real-time delivery tracking
- 🔐 **Secure Authentication** - User accounts with 2FA support
- 👤 **User Profiles** - Manage account settings and order history
- 🌍 **Multi-language Support** - Available in English, Arabic, and Kurdish (CKB)
- 🎨 **Modern UI** - Built with Next.js 16, Tailwind CSS 4, and shadcn/ui

### Homepage Sections:

- **Hero Section** - Eye-catching banner about shopping
- **Features Section** - Highlighting secure shopping, 2FA, Stripe payments, product catalog, smart cart, fast delivery, 24/7 support
- **How It Works** - Simple 3-step process: Browse & Select → Secure Checkout → Track & Receive
- **Header** - Navigation with home, login/register, or profile button
- **Footer** - Links and copyright information

---

## 🚨 CRITICAL: Project Configuration

### 📦 Package Manager

- **ALWAYS use `bun`** - This is the ONLY package manager for this project
- **NEVER use `npm`, `yarn`, or `pnpm`**
- All installation commands MUST use `bun add` or `bun install`

### 🔐 Environment Variables

- **ALWAYS use `.env`** - This is the ONLY environment file
- **NEVER create `.env.local`, `.env.example`, `.env.development`, or any other .env variants**
- All environment variables go in the single `.env` file
- The `.env` file is gitignored and safe for local development

---

## 🚨 CRITICAL: Library Enforcement

**ONLY** use the libraries and tools specified in this document. **DO NOT** introduce any other libraries without explicit approval.

### ✅ APPROVED LIBRARIES & TOOLS

#### **UI & Styling**

- **shadcn/ui** - ONLY UI component library allowed
- **Tailwind CSS 4** - For styling (with CSS variables)
- **Lucide React** - Icon library
- **cn() utility** from `@/lib/utils` - For conditional styling
- **framer-motion** - Animation library (use via reusable components in animate.tsx)

#### **Data Fetching & State Management**

- **Server Actions** (`"use server"`) - For all data mutations and form submissions
- **React Query (@tanstack/react-query)** - Client-side state management (ONLY via Server Actions, never direct API calls)
- **React Server Components (RSC)** - Default for initial data fetching
- **Static Data** - For demo/placeholder content during development

**CRITICAL Server Actions Pattern:**

- Server Actions MUST be in `lib/react-query/actions/*.ts` files
- Server Actions MUST return plain objects (serializable data only)
- Server Actions MUST use error objects with `__isError` flag
- Server Actions MUST check for `__isError` at each async step
- See `docs/data-fetching-error-handling.md` for complete architecture

**CRITICAL React Query Pattern:**

- React Query hooks MUST be in `lib/react-query/queries/*.ts` files
- Mutations MUST use Server Actions as `mutationFn`
- Mutations MUST call `throwIfError(result)` to convert error objects to Error instances
- NEVER make direct fetch/axios calls in mutations
- See `docs/data-fetching-error-handling.md` for examples

#### **Framework & Core**

- **Next.js** - React framework (App Router)
- **React Server Components (RSC)** - Default component pattern
- **TypeScript** - All code must be TypeScript
- **Bun** - Package manager and runtime (ONLY package manager allowed)

#### **Forms & Validation**

- **Zod** - Schema validation (if needed for contact forms)

#### **URL & State Management**

- **nuqs** - Type-safe URL parameter management

#### **Theming**

- **next-themes** - Dark/light mode management

#### **Cookie Management**

- **cookies-next** - Cookie handling for Next.js (client and server)
  - **ALWAYS use `cookies-next`** for all cookie operations
  - **NEVER use** native `document.cookie`, `js-cookie`, or other cookie libraries

#### **Internationalization**

- **i18next** - Translation framework
- **react-i18next** - React bindings for i18next

#### **Authentication**

- **NextAuth.js v5 (Auth.js)** - Authentication and session management
- **bcryptjs** - Password hashing (NOT bcrypt)

#### **File Uploads** (if needed)

- **uploadthing** - File upload service (already integrated)

### ❌ FORBIDDEN LIBRARIES

**DO NOT USE:**
Other form libraries: Formik (use react-hook-form with shadcn/ui Form)

- ❌ Custom HTTP clients: axios, fetch wrappers (use Server Actions instead)
- ❌ State management: Redux, Zustand, Jotai, Recoil, etc.
- ❌ CSS frameworks: Bootstrap, Bulma, Foundation, etc.
- ❌ Icon libraries: Font Awesome, React Icons, Heroicons (use Lucide only)
- ❌ Other validation: Yup, Joi, class-validator (use Zod only)
- ❌ Cookie libraries: js-cookie, universal-cookie, react-cookie, or native document.cookie (use cookies-next only)
- ❌ Raw URL params: searchParams, useSearchParams, URLSearchParams (use nuq
  Before adding ANY new library:

1. Check if it's in the APPROVED list
2. Check if existing approved libraries can solve the problem
3. If not listed, **ASK FOR PERMISSION** - do not proceed

---

## 📚 Architecture Guidelines

### 1️⃣ Component Organization

**See:** [docs/component-organization.md](docs/component-organization.md)

**Key Rules:**

- ✅ Extract components when pages exceed ~100 lines
- ✅ Organize by type: `ui/`, `cards/`, `forms/`, `layouts/`, `sections/`, `dashboard/`, `shared/`
- ❌ NO massive page files with hundreds of lines of JSX
- ❌ NO mixing unrelated components in the same file

**Folder Structure:**

```
components/
├── ui/          # shadcn/ui primitives ONLY
├── cards/       # Card components
├── forms/       # Form components
├── layouts/     # Layout components
├── sections/    # Page sections
├── dashboard/   # Dashboard-specific
└── shared/      # Globally shared
```

### 2️⃣ UI Components (shadcn/ui)

**See:** [docs/ui-components.md](docs/ui-components.md)

**Key Rules:**

- ✅ **ONLY use shadcn/ui** for all UI elements
- ✅ Install with: `npx shadcn@latest add <component>`
- ✅ Style: **New York**
- ✅ Icons: **Lucide React ONLY**
- ❌ **NO custom components** that replicate shadcn/ui functionality
- ❌ **NO other UI libraries**

**Installation:**

```bash
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add dialog
```

---

## 🔄 Data Fetching & Error Handling Architecture

**See:** [docs/data-fetching-error-handling.md](docs/data-fetching-error-handling.md)

This project uses a **unique three-layer architecture** for data fetching:

1. **API Layer** (`lib/config/api.config.ts`) - Fetch wrappers that return error objects
2. **Server Actions Layer** (`lib/react-query/actions/*.ts`) - Server-side mutations with `"use server"`
3. **React Query Layer** (`lib/react-query/queries/*.ts`) - Client-side hooks that throw errors

### Critical Rules:

**Server Actions (`lib/react-query/actions/*.ts`):**

- ✅ MUST have `"use server"` directive at the top
- ✅ MUST return plain objects only (no Error instances)
- ✅ MUST check for `__isError` flag at each async operation
- ✅ MUST return error objects with `__isError: true` on failure
- ❌ NEVER throw errors in Server Actions (not serializable)
- ❌ NEVER use try/catch in Server Actions (return error objects instead)

**React Query Mutations (`lib/react-query/queries/*.ts`):**

- ✅ MUST use Server Actions as `mutationFn`
- ✅ MUST call `throwIfError(result)` after Server Action returns
- ✅ MUST import `throwIfError` from `@/lib/error-handler`
- ✅ MUST use `onError` handler to show toast notifications
- ❌ NEVER make direct fetch/axios calls
- ❌ NEVER handle errors in Server Actions (handle in React Query)

**Example Pattern:**

```typescript
// ❌ WRONG - Server Action
"use server";
export async function login(data: LoginFormData) {
  const result = await post(URLs.LOGIN, data);
  if (result.__isError) {
    throw new Error(result.message); // ❌ Can't serialize Error!
  }
  return result;
}

// ✅ CORRECT - Server Action
("use server");
export async function login(data: LoginFormData) {
  const result = await post(URLs.LOGIN, data);
  if (result && (result as any).__isError) {
    return result; // ✅ Return error object
  }
  return result;
}

// ✅ CORRECT - React Query Hook
export const useLogin = () => {
  const { i18n } = useTranslation();
  return useMutation({
    mutationFn: async (data: LoginFormData) => {
      await loginMiddleware(i18n, data);
      const result = await login(data);
      return throwIfError(result); // ✅ Throw here (client-side)
    },
    onError: (error: ApiError) => {
      showToast("error", error.message); // ✅ Toast works!
    },
  });
};
```

---

## ✅ Pre-Flight Checklist

Before writing ANY code:

### Libraries

- [ ] Am I using ONLY approved libraries?
- [ ] Do I need to install a new shadcn/ui component?
- [ ] Am I using NextAuth.js for authentication?
- [ ] Am I using Server Actions + React Query for data mutations?

### Data Fetching

- [ ] Is this a Server Action? Does it have `"use server"`?
- [ ] Am I returning error objects with `__isError` flag?
- [ ] Am I using `throwIfError()` in React Query mutations?
- [ ] Did I check for `__isError` at each async step?

### Components

- [ ] Is this component in the correct folder?
- [ ] Is the page file under ~100 lines?
- [ ] Am I using shadcn/ui components (not custom)?

### Authentication

- [ ] Did I use `auth.ts` at root level for NextAuth config?
- [ ] Did I export `auth as middleware` in `middleware.ts`?
- [ ] Did I create server actions with `'use server'`?
- [ ] Did I protect routes using `auth()` or `useSession()`?
- [ ] Did I use `bcryptjs` for password hashing?

### Data Fetching

- [ ] Did I create action file in `lib/react-query/actions/`?
- [ ] Did I create query hooks in `lib/react-query/queries/`?
- [ ] Did I add query keys to `lib/react-query/keys.ts`?
- [ ] Did I add URLs to `lib/constants/urls.ts` (if needed)?

### Code Quality

- [ ] All files are TypeScript (`.ts` or `.tsx`)?
- [ ] Server actions marked with `'use server'`?
- [ ] Client components marked with `'use client'`?
- [ ] Using `cn()` for conditional Tailwind classes?

---

## 🎯 Quick Reference

| Need          | Use                   | Location                              |
| ------------- | --------------------- | ------------------------------------- | --- | ------- | ------------ | ----------------------------- | --- | ----------- | ------- | ----------------------- |
| Button        | `shadcn/ui`           | `npx shadcn@latest add button`        |
| Icons         | Lucide React          | `import { Icon } from "lucide-react"` |
| Styling       | Tailwind CSS + `cn()` | `className={cn("...")}`               |
| Page sections | Extract to component  | `components/sections/`                |
| URL params    | nuqs                  | Direct usage in components            |
| Theme         | next-themes           | `providers/theme-provider.tsx`        |     | Cookies | cookies-next | `getCookie()` / `setCookie()` |     | Translation | i18next | `useTranslation()` hook |
| Auth config   | NextAuth.js           | `auth.ts` (root level)                |
| Route protect | NextAuth middleware   | `await auth()` or `useSession()`      |
| Password hash | bcryptjs              | `hash()` and `compare()`              |

---

## 📖 Documentation

### Core Architecture

- **[Component Organization](docs/component-organization.md)** - Component structure, folder organization, and file naming
- **[UI Components](docs/ui-components.md)** - shadcn/ui component usage and styling
- **[Authentication](docs/authentication.md)** - NextAuth.js setup, route protection, and security patterns
- **[Cookie Management](docs/cookie-management.md)** - cookies-next usage for client and server cookies
- **[Internationalization](docs/internationalization.md)** - i18next setup and translation patterns
- **[Theme (Dark/Light Mode)](docs/theme-dark-light-mode.md)** - next-themes configuration
- **[URL Parameters](docs/url-parameters.md)** - nuqs for type-safe URL state management
- **[Motion/Animations](docs/motion.md)** - framer-motion animation patterns
- **[Package Management](docs/package-management.md)** - Bun package manager guidelines
- **[Folder & File Conventions](docs/folder-file-conventions.md)** - Naming and organization standards
- **[Documentation Standards](docs/documentation-standards.md)** - How to write documentation

### Components

- [ ] Is the page file under ~100 lines?
- [ ] Am I using shadcn/ui components (not custom)?

### Code Quality

- [ ] All files are TypeScript (`.ts` or `.tsx`)?
- [ ] Client components marked with `'use client'`?
- [ ] Using `cn()` for conditional Tailwind classes?
- [ ] Using i18next for all text content

3. Ask for clarification - do NOT improvise

**Remember:** Consistency is key to maintainability. Follow the patterns, use the approved tools, and keep the codebase clean.
