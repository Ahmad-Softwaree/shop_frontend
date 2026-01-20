# 🛒 Shop - Modern E-Commerce Platform

A modern, secure online shopping platform built with Next.js 16, featuring seamless product browsing, secure Stripe payments, and multi-language support.

## ✨ Features

- 🛍️ **Product Catalog** - Browse thousands of quality products
- 🔐 **Secure Authentication** - User accounts with NextAuth.js and 2FA
- 💳 **Stripe Integration** - Fast and secure payment processing
- 🛒 **Smart Shopping Cart** - Easy cart management and checkout
- 🚚 **Order Tracking** - Real-time delivery tracking
- 🌍 **Multi-language** - English, Arabic, and Kurdish support
- 🎨 **Modern UI** - Beautiful, responsive design with Tailwind CSS 4
- 🌙 **Dark Mode** - Seamless theme switching

## 🚀 Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (v1.0 or higher)
- Node.js 18+ (for compatibility)

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd shop/client
```

2. Install dependencies:

```bash
bun install
```

3. Set up environment variables:
   Create a `.env` file in the root directory with the required variables (see `.env.example`)

4. Run the development server:

```bash
bun dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **UI Components:** shadcn/ui
- **Authentication:** NextAuth.js v5
- **Data Fetching:** Server Actions + React Query
- **Payment:** Stripe
- **i18n:** i18next + react-i18next
- **Icons:** Lucide React
- **Animations:** Framer Motion
- **Package Manager:** Bun
- **Error Handling:** Custom serializable error system

## 📁 Project Structure

```
client/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Protected routes
│   │   ├── profile/       # User profile
│   │   └── change-password/
│   ├── (root)/            # Public routes
│   │   ├── login/
│   │   ├── register/
│   │   ├── password-reset/
│   │   └── update-password/
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── forms/            # Form components
│   ├── layouts/          # Layout components
│   ├── sections/         # Homepage sections
│   ├── shared/           # Shared/reusable components
│   └── ui/               # shadcn/ui components
├── i18n/                 # Internationalization
│   └── locales/          # Translation files
├── lib/                  # Utility functions
│   ├── react-query/      # Server actions
│   └── store/            # State management
├── types/                # TypeScript types
└── validation/           # Zod schemas
```

## 🔐 Authentication

The app uses NextAuth.js v5 for authentication with the following features:

- Email/Password login
- Two-Factor Authentication (2FA)
- Password reset via email
- Secure session management

## 🌐 Internationalization

Supported languages:

- English (en)
- Arabic (ar)
- Kurdish (ckb)

Use i18next for all text translations.

## � Data Fetching & Error Handling

This project uses a **unique architecture** combining Server Actions with React Query:

- **Server Actions** (`"use server"`) - Server-side data mutations
- **React Query** - Client-side state management and caching
- **Serializable Error Pattern** - Production-ready error handling with `__isError` flag
- **throwIfError()** - Client-side error throwing for proper React Query integration

**Key Files:**

- `lib/config/api.config.ts` - Fetch wrappers with error serialization
- `lib/error-handler.ts` - Error processing and `throwIfError()` helper
- `lib/react-query/actions/*.ts` - Server Actions that return error objects
- `lib/react-query/queries/*.ts` - React Query hooks that throw errors

**See:** [docs/data-fetching-error-handling.md](docs/data-fetching-error-handling.md) for complete architecture explanation.

## 📚 Documentation

### Core Architecture

- **[Data Fetching & Error Handling](docs/data-fetching-error-handling.md)** - Server Actions, React Query, and error management
- **[Component Organization](docs/component-organization.md)** - Component structure and folder organization
- **[UI Components](docs/ui-components.md)** - shadcn/ui component usage
- **[Authentication](docs/authentication.md)** - NextAuth.js setup and patterns
- **[Cookie Management](docs/cookie-management.md)** - cookies-next usage
- **[Internationalization](docs/internationalization.md)** - i18next setup
- **[Theme (Dark/Light Mode)](docs/theme-dark-light-mode.md)** - next-themes configuration
- **[Backend Token Setup](docs/backend-token-setup.md)** - JWT token handling
- **[Backend Token Usage](docs/backend-token-usage.md)** - Token usage patterns

## �📝 License

This project is private and proprietary.

## 🤝 Contributing

Please read [AGENTS.md](./AGENTS.md) for detailed coding standards and contribution guidelines.
