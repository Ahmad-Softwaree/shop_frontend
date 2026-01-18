"use server";

import { URLs } from "@/lib/urls";
import { handleServerError } from "@/lib/error-handler";
import { get, post, update, del } from "@/lib/config/api.config";
import { revalidatePath } from "next/cache";
import { ENUMs } from "@/lib/enums";
import { unAuthorized } from "../react-query/actions/auth.action";

export type CRUDReturn = { message: string; data?: any };

export type Product = {
  id: number;
  enName: string;
  arName: string;
  ckbName: string;
  enDesc: string;
  arDesc: string;
  ckbDesc: string;
  image: string;
  price: number;
  status: "AVAILABLE" | "SOLD_OUT";
  userId: number;
  createdAt: string;
  updatedAt: string | null;
  user?: {
    name: string;
    username: string;
    phone: string;
  };
  orders?: Array<{
    id: number;
    userId: number;
    productId: number;
    createdAt: string;
    user: {
      id: number;
      name: string;
      username: string;
      phone: string;
    };
  }>;
};

export type PaginatedProducts = {
  data: Product[];
  next: boolean;
  total: number;
  total_page: number;
  page: number;
  limit: number;
};

const PRODUCT_TAG = "products";

export const getProducts = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
}): Promise<PaginatedProducts> => {
  try {
    await unAuthorized();
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.search) queryParams.append("search", params.search);

    const url = `${URLs.PRODUCTS}${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;
    const response = await get<PaginatedProducts>(url, {
      tags: [PRODUCT_TAG],
      revalidate: 0,
    });
    console.log(response);
    return response;
  } catch (error) {
    handleServerError(error);
  }
};

export const getUserProducts = async (
  userId: string,
  params?: {
    page?: number;
    limit?: number;
    search?: string;
  }
): Promise<PaginatedProducts> => {
  try {
    await unAuthorized();
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.search) queryParams.append("search", params.search);

    const url = `${URLs.PRODUCTS}/user/${userId}${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;
    const response = await get<PaginatedProducts>(url, {
      tags: [PRODUCT_TAG, `user-products-${userId}`],
      revalidate: 0,
    });
    return response;
  } catch (error) {
    handleServerError(error);
  }
};

export const getProductById = async (id: string): Promise<Product> => {
  try {
    await unAuthorized();
    const response = await get<{ message: string; data: Product }>(
      URLs.PRODUCT_BY_ID(id),
      {
        tags: [`product-${id}`],
        revalidate: 0,
      }
    );
    return response.data;
  } catch (error) {
    handleServerError(error);
  }
};

export const addProduct = async (formData: FormData): Promise<CRUDReturn> => {
  try {
    await unAuthorized();

    const { data } = await post(URLs.PRODUCTS, formData, {
      tags: [PRODUCT_TAG],
    });

    revalidatePath(ENUMs.PAGES.PRODUCTS);
    return data;
  } catch (error) {
    handleServerError(error);
  }
};

export const updateProduct = async (
  id: string,
  formData: FormData
): Promise<CRUDReturn> => {
  try {
    await unAuthorized();

    const { data } = await update(URLs.PRODUCT_BY_ID(id), formData, {
      tags: [PRODUCT_TAG, `product-${id}`],
    });

    revalidatePath(ENUMs.PAGES.PRODUCTS);
    revalidatePath(`${ENUMs.PAGES.PRODUCTS}/${id}`);
    return data;
  } catch (error) {
    handleServerError(error);
  }
};

export const deleteProduct = async (id: string): Promise<CRUDReturn> => {
  try {
    await unAuthorized();
    const { data } = await del(URLs.PRODUCTS, id, {
      tags: [PRODUCT_TAG, `product-${id}`],
    });

    revalidatePath(ENUMs.PAGES.PRODUCTS);
    revalidatePath(`${ENUMs.PAGES.PRODUCTS}/${id}`);
    return data;
  } catch (error) {
    handleServerError(error);
  }
};

export const buyProduct = async (id: string): Promise<CRUDReturn> => {
  try {
    await unAuthorized();
    const data = await post(
      `${URLs.PRODUCTS}/${id}/buy`,
      {},
      {
        tags: [PRODUCT_TAG, `product-${id}`],
      }
    );

    revalidatePath(ENUMs.PAGES.PRODUCTS);
    revalidatePath(`${ENUMs.PAGES.PRODUCTS}/${id}`);
    return data;
  } catch (error) {
    handleServerError(error);
  }
};

export const markAvailable = async (id: string): Promise<CRUDReturn> => {
  try {
    await unAuthorized();
    const data = await update(
      `${URLs.PRODUCTS}/${id}/mark-available`,
      {},
      {
        tags: [PRODUCT_TAG, `product-${id}`],
      }
    );

    revalidatePath(ENUMs.PAGES.PRODUCTS);
    revalidatePath(`${ENUMs.PAGES.PRODUCTS}/${id}`);
    return data;
  } catch (error) {
    handleServerError(error);
  }
};
