import { Suspense } from "react";
import { getProducts } from "@/lib/react-query/actions/product.action";
import ProductsGrid from "@/components/sections/ProductsGrid";
import Search from "@/components/shared/Search";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { ENUMs } from "@/lib/enums";
import { getServerTranslation } from "@/i18n/server";
import { NextAsyncUrlParams, NextUrlParams } from "@/types/global";
import ProductStatusFilter from "@/components/shared/ProductStatusFilter";

async function ProductsContent({
  searchParams,
}: {
  searchParams: NextUrlParams;
}) {
  const productsData = await getProducts(searchParams);
  const products = productsData?.data || [];
  const totalPages = productsData?.total_page || 1;
  const currentPage = productsData?.page || 1;

  const searchParam = [
    searchParams.search && `search=${searchParams.search}`,
    searchParams.status && `status=${searchParams.status}`,
  ]
    .filter(Boolean)
    .join("&");

  return (
    <ProductsGrid
      products={products}
      currentPage={currentPage}
      totalPages={totalPages}
      searchParam={searchParam}
    />
  );
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: NextAsyncUrlParams;
}) {
  const { t } = await getServerTranslation();
  const params = await searchParams;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t("products.title")}</h1>
          <p className="text-muted-foreground mt-1">
            {t("products.description")}
          </p>
        </div>
        <Button asChild>
          <Link href={`${ENUMs.PAGES.PRODUCTS}/add`}>
            <Plus className="h-4 w-4 mr-2" />
            {t("products.addProduct")}
          </Link>
        </Button>
      </div>

      <div className="w-full max-w-md flex gap-2">
        <div className="flex-1">
          <Search placeholder={t("products.searchPlaceholder")} />
        </div>
        <ProductStatusFilter />
      </div>

      <Suspense
        key={`${params.search || ""}-${params.page || "1"}-${
          params.status || ""
        }`}
        fallback={
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-96 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        }>
        <ProductsContent searchParams={params} />
      </Suspense>
    </div>
  );
}
