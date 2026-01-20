import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "@/lib/store/auth.store";
import { getUserProducts } from "@/lib/react-query/actions/product.action";
import MyProductsGrid from "@/components/sections/MyProductsGrid";
import Search from "@/components/shared/Search";
import ProductStatusFilter from "@/components/shared/ProductStatusFilter";
import { useSearchParams } from "next/navigation";
import { Product } from "@/types/types";
import { ENUMs } from "@/lib/enums";

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
  const status = searchParams.get(ENUMs.PARAMS.STATUS) || "";

  useEffect(() => {
    async function fetchUserProducts() {
      if (!user?.id) return;

      setIsLoading(true);
      try {
        const data = await getUserProducts(user.id.toString(), {
          page,
          limit: ENUMs.GLOBAL.PER_PAGE,
          search,
          status,
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
  }, [user?.id, page, search, status]);

  const searchParam = [
    search && `search=${search}`,
    status && `status=${status}`,
  ]
    .filter(Boolean)
    .join("&");

  return (
    <div className="space-y-6">
      <div className="w-full max-w-md flex gap-2">
        <div className="flex-1">
          <Search placeholder={t("products.searchPlaceholder")} />
        </div>
        <ProductStatusFilter />
      </div>

      <MyProductsGrid
        products={products}
        currentPage={currentPage}
        totalPages={totalPages}
        searchParam={searchParam}
        isLoading={isLoading}
      />
    </div>
  );
}
