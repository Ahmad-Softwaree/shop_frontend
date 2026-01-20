"use server";
import { cookies } from "next/headers";
import { deleteCookie, getCookie, setCookie } from "cookies-next/server";
import { ENUMs, TAGs } from "../enums";
import { isFileForm, buildFormData } from "../functions";

const baseURL = process.env.NEXT_PUBLIC_API || "/";

export async function saveJWT(token: string): Promise<void> {
  const maxAge =
    parseInt(process.env.NEXT_PUBLIC_JWT_EXPIRY_DAYS || "30") * 24 * 60 * 60;
  setCookie(process.env.NEXT_PUBLIC_COOKIE_NAME as string, token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge,
    path: "/",
    cookies,
  });
}

export async function removeJWT(): Promise<void> {
  deleteCookie(process.env.NEXT_PUBLIC_COOKIE_NAME as string, { cookies });
}

export async function saveLang(lang: string): Promise<void> {
  setCookie(ENUMs.GLOBAL.LANG_COOKIE as string, lang, {
    maxAge: 365 * 24 * 60 * 60,
    path: "/",
    sameSite: "lax",
    cookies,
  });
}

export async function getLang(): Promise<string> {
  let cookie = await getCookie(ENUMs.GLOBAL.LANG_COOKIE as string, { cookies });
  return cookie ?? "en";
}

async function getHeaders(isFormData: boolean = false): Promise<HeadersInit> {
  const jwt = await getCookie(process.env.NEXT_PUBLIC_COOKIE_NAME as string, {
    cookies,
  });
  const lang =
    (await getCookie(ENUMs.GLOBAL.LANG_COOKIE as string, { cookies })) ?? "en";
  const cookieName = process.env.NEXT_PUBLIC_COOKIE_NAME as string;

  const headers: HeadersInit = {
    "x-lang": lang,
  };

  // Don't set Content-Type for FormData, browser will set it with boundary
  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  if (jwt) {
    headers.Cookie = `${cookieName}=${jwt}`;
  }

  return headers;
}

export async function get<T = any>(
  path: string,
  options?: { tags?: TAGs[]; revalidate?: number | false }
): Promise<T> {
  const headers = await getHeaders(false);
  const response = await fetch(`${baseURL}${path}`, {
    method: "GET",
    credentials: "include",
    headers,
    next: options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: response.statusText,
    }));
    throw new Error(error.message || "Request failed");
  }

  return response.json();
}

export async function post<T = any>(
  path: string,
  data?: any,
  options?: { tags?: TAGs[]; revalidate?: number | false }
): Promise<T> {
  const hasFiles = isFileForm(data);
  const formData = hasFiles ? buildFormData(data) : data;
  const isFormDataInstance = formData instanceof FormData;
  const headers = await getHeaders(isFormDataInstance);
  const response = await fetch(`${baseURL}${path}`, {
    method: "POST",
    credentials: "include",
    headers,
    body: isFormDataInstance
      ? formData
      : formData
      ? JSON.stringify(formData)
      : undefined,
    next: options,
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: response.statusText,
    }));
    throw error;
  }

  return response.json();
}

export async function update<T = any>(
  path: string,
  data?: any,
  options?: { tags?: TAGs[]; revalidate?: number | false }
): Promise<T> {
  const hasFiles = isFileForm(data);
  const formData = hasFiles ? buildFormData(data) : data;
  const isFormDataInstance = formData instanceof FormData;
  const headers = await getHeaders(isFormDataInstance);

  const response = await fetch(`${baseURL}${path}`, {
    method: "PUT",
    credentials: "include",
    headers,
    body: isFormDataInstance
      ? formData
      : formData
      ? JSON.stringify(formData)
      : undefined,
    next: options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: response.statusText,
    }));
    throw new Error(error.message || "Request failed");
  }

  return response.json();
}

export async function del<T = any>(
  path: string,
  id: string | number,
  options?: { tags?: TAGs[]; revalidate?: number | false }
): Promise<T> {
  const headers = await getHeaders(false);
  const response = await fetch(`${baseURL}${path}/${id}`, {
    method: "DELETE",
    credentials: "include",
    headers,
    next: options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: response.statusText,
    }));
    throw new Error(error.message || "Request failed");
  }

  return response.json();
}
