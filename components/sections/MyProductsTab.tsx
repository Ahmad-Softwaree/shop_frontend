"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "@/lib/store/auth.store";
import { getUserProducts, Product } from "@/lib/actions/product.action";
import ProductCard from "@/components/cards/ProductCard";
import Search from "@/components/shared/Search";
import Pagination from "@/components/shared/Pagination";
import { PER_PAGE } from "@/lib/enums";
import { useSearchParams } from "next/navigation";

export default function MyProductsTab() {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const page = Number(searchParams.get("page")) || 1;
  const search = searchParams.get("search") || "";

  useEffect(() => {
    async function fetchUserProducts() {
      if (!user?.id) return;

      setIsLoading(true);
      try {
        const data = await getUserProducts(user.id.toString(), {
          page,
          limit: PER_PAGE,
          search,
        });

        setProducts(data.data || []);
        setTotalPages(data.total_page || 1);
        setCurrentPage(data.page || 1);
      } catch (error) {
        console.error("Error fetching user products:", error);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchUserProducts();
  }, [user?.id, page, search]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-96 bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="w-full max-w-md">
        <Search placeholder={t("products.searchPlaceholder")} />
      </div>

      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-xl text-muted-foreground">
            {t("products.noProducts")}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} showActions />
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            searchParams={search ? `search=${search}` : ""}
          />
        </>
      )}
    </div>
  );
}
