import { getCookie, setCookie } from "cookies-next/client";

const LIMIT_COOKIE_NAME = "pagination_limit";
const DEFAULT_LIMIT = 100;

export function getLimitFromCookie(): number {
  const savedLimit = getCookie(LIMIT_COOKIE_NAME);
  return savedLimit ? parseInt(savedLimit, 10) : DEFAULT_LIMIT;
}

export function setLimitCookie(limit: number): void {
  setCookie(LIMIT_COOKIE_NAME, limit.toString());
}
