import { Suspense } from "react";
import { getProducts } from "@/lib/actions/product.action";
import ProductCard from "@/components/cards/ProductCard";
import Search from "@/components/shared/Search";
import Pagination from "@/components/shared/Pagination";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { ENUMs, PER_PAGE } from "@/lib/enums";
import { getServerTranslation } from "@/i18n/server";

type ProductsPageProps = {
  searchParams: Promise<{
    search?: string;
    page?: string;
  }>;
};

async function ProductsContent({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; page?: string }>;
}) {
  const { t } = await getServerTranslation();
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const search = params.search || "";
  console.log(search);
  const productsData = await getProducts({
    page,
    limit: PER_PAGE,
    search,
  });

  const products = productsData?.data || [];
  const totalPages = productsData?.total_page || 1;
  const currentPage = productsData?.page || 1;

  return (
    <>
      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-xl text-muted-foreground mb-4">
            {t("products.noProducts")}
          </p>
          <Button asChild>
            <Link href={`${ENUMs.PAGES.PRODUCTS}/add`}>
              <Plus className="h-4 w-4 mr-2" />
              {t("products.addProduct")}
            </Link>
          </Button>
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
    </>
  );
}

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
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

      <div className="w-full max-w-md">
        <Search placeholder={t("products.searchPlaceholder")} />
      </div>

      <Suspense
        key={`${params.search || ""}-${params.page || "1"}`}
        fallback={
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-96 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        }>
        <ProductsContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
