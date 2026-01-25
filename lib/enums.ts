export const ENUMs = {
  PARAMS: {
    SEARCH: "search",
    PAGE: "page",
    LIMIT: "limit",
    EMAIL: "email",
    STATUS: "status",
  },
  GLOBAL: {
    DEFAULT_LANG: "en",
    LANG_COOKIE: "language",
    JWT_COOKIE: "shop",
    THEME_COOKIE: "theme",
    PER_PAGE: 30,
  },
  TAGS: {
    PRODUCTS: "products",
    USERS: "users",
    ORDERS: "orders",
  },
  PAGES: {
    HOME: "/",
    LOGIN: "/login",
    REGISTER: "/register",
    PROFILE: "/profile",
    PRODUCTS: "/products",
    CHANGE_PASSWORD: "/change-password",
    PASSWORD_RESET: "/password-reset",
    UPDATE_PASSWORD: "/update-password",
    AUTHENTICATION: "/authentication",
  },
} as const;

export type ENUMSs = typeof ENUMs;

export type TAGs = ENUMSs["TAGS"][keyof ENUMSs["TAGS"]];
