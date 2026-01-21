"use client";

import { Product } from "@/types/types";
import ProductCard from "@/components/cards/ProductCard";
import Pagination from "@/components/shared/Pagination";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { revalidateProducts } from "@/lib/react-query/actions/product.action";
import { useSession } from "next-auth/react";
import { io } from "socket.io-client";

interface MyProductsGridProps {
  products: Product[];
  currentPage: number;
  totalPages: number;
  searchParam: string;
  isLoading: boolean;
}

/**
 * MyProductsGrid - Client component for displaying user's products in a grid
 * Separated to enable future Socket.IO integration
 */
export default function MyProductsGrid({
  products,
  currentPage,
  totalPages,
  searchParam,
  isLoading,
}: MyProductsGridProps) {
  const { t, i18n } = useTranslation();
  const session = useSession();

  useEffect(() => {
    revalidateProducts();
  }, [i18n.language]);
  useEffect(() => {
    const socket = io(`${process.env.NEXT_PUBLIC_API}/products` || "", {
      auth: {
        token: session.data?.jwt,
      },
    });
    socket.on("connect", () => {});

    socket.on("productUpdate", async () => {
      await revalidateProducts();
    });

    return () => {
      socket.disconnect();
    };
  }, []);
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-96 bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-xl text-muted-foreground">
          {t("products.noProducts")}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} showActions />
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        searchParam={searchParam}
      />
    </>
  );
}
