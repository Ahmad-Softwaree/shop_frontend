"use server";

import { URLs } from "@/lib/urls";
import { handleServerError } from "@/lib/error-handler";
import { get, post, update, del } from "@/lib/config/api.config";
import { revalidatePath } from "next/cache";
import { ENUMs } from "@/lib/enums";
import { unAuthorized } from "./auth.action";
import { NextUrlParams, PaginationObject } from "@/types/global";
import { Product } from "@/types/types";
import { CRUDReturn } from "./profile.action";

export const revalidateProducts = async () => {
  revalidatePath(ENUMs.TAGS.PRODUCTS);
};

export const getProducts = async (
  params?: NextUrlParams
): Promise<PaginationObject<Product>> => {
  try {
    const authCheck = await unAuthorized();
    if (authCheck && (authCheck as any).__isError) return authCheck as any;

    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.search) queryParams.append("search", params.search);
    if (params?.status) queryParams.append("status", params.status);

    const url = `${URLs.PRODUCTS}${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;
    const response = await get<PaginationObject<Product>>(url, {
      tags: [ENUMs.TAGS.PRODUCTS],
      revalidate: 0,
    });
    if (response && (response as any).__isError) return response;
    return response;
  } catch (error) {
    return handleServerError(error) as any;
  }
};

export const getUserProducts = async (
  userId: string,
  params?: NextUrlParams
): Promise<PaginationObject<Product>> => {
  try {
    const authCheck = await unAuthorized();
    if (authCheck && (authCheck as any).__isError) return authCheck as any;

    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.search) queryParams.append("search", params.search);
    if (params?.status) queryParams.append("status", params.status);

    const url = `${URLs.PRODUCTS}/user/${userId}${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;
    const response = await get<PaginationObject<Product>>(url, {
      tags: [ENUMs.TAGS.PRODUCTS],
      revalidate: 0,
    });
    if (response && (response as any).__isError) return response;
    return response;
  } catch (error) {
    return handleServerError(error) as any;
  }
};

export const getProductById = async (id: string): Promise<Product> => {
  try {
    const authCheck = await unAuthorized();
    if (authCheck && (authCheck as any).__isError) return authCheck as any;

    const response = await get<{ message: string; data: Product }>(
      URLs.PRODUCT_BY_ID(id),
      {
        tags: [ENUMs.TAGS.PRODUCTS],
        revalidate: 0,
      }
    );
    if (response && (response as any).__isError) return response as any;
    return response.data;
  } catch (error) {
    return handleServerError(error) as any;
  }
};

export const addProduct = async (formData: FormData): Promise<CRUDReturn> => {
  try {
    const authCheck = await unAuthorized();
    if (authCheck && (authCheck as any).__isError) return authCheck as any;

    const result = await post(URLs.PRODUCTS, formData, {
      tags: [ENUMs.TAGS.PRODUCTS],
    });
    if (result && (result as any).__isError) return result as any;

    revalidatePath(ENUMs.PAGES.PRODUCTS);
    return result.data;
  } catch (error) {
    return handleServerError(error) as any;
  }
};

export const updateProduct = async (
  id: string,
  formData: FormData
): Promise<CRUDReturn> => {
  try {
    const authCheck = await unAuthorized();
    if (authCheck && (authCheck as any).__isError) return authCheck as any;

    const result = await update(URLs.PRODUCT_BY_ID(id), formData, {
      tags: [ENUMs.TAGS.PRODUCTS],
    });
    if (result && (result as any).__isError) return result as any;

    revalidatePath(ENUMs.PAGES.PRODUCTS);
    revalidatePath(`${ENUMs.PAGES.PRODUCTS}/${id}`);
    return result.data;
  } catch (error) {
    return handleServerError(error) as any;
  }
};

export const deleteProduct = async (id: string): Promise<CRUDReturn> => {
  try {
    const authCheck = await unAuthorized();
    if (authCheck && (authCheck as any).__isError) return authCheck as any;

    const result = await del(URLs.PRODUCTS, id, {
      tags: [ENUMs.TAGS.PRODUCTS],
    });
    if (result && (result as any).__isError) return result as any;

    revalidatePath(ENUMs.PAGES.PRODUCTS);
    revalidatePath(`${ENUMs.PAGES.PRODUCTS}/${id}`);
    return result.data;
  } catch (error) {
    return handleServerError(error) as any;
  }
};

export const markAvailable = async (id: string): Promise<CRUDReturn> => {
  try {
    const authCheck = await unAuthorized();
    if (authCheck && (authCheck as any).__isError) return authCheck as any;

    const data = await update(
      `${URLs.MARK_AVAILABLE(id)}`,
      {},
      {
        tags: [ENUMs.TAGS.PRODUCTS],
      }
    );
    if (data && (data as any).__isError) return data as any;

    revalidatePath(ENUMs.PAGES.PRODUCTS);
    revalidatePath(`${ENUMs.PAGES.PRODUCTS}/${id}`);
    return data;
  } catch (error) {
    return handleServerError(error) as any;
  }
};
