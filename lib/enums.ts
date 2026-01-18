export const PER_PAGE = 30;

export const ENUMs = {
  PARAMS: {
    SEARCH: "search",
    PAGE: "page",
    LIMIT: "limit",
    EMAIL: "email",
  },
  GLOBAL: {
    DEFAULT_LANG: "en",
    LANG_COOKIE: "language",
    JWT_COOKIE: "shop",
    THEME_COOKIE: "theme",
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
