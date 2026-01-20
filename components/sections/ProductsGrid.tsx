"use client";

import { Product } from "@/types/types";
import ProductCard from "@/components/cards/ProductCard";
import Pagination from "@/components/shared/Pagination";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { ENUMs } from "@/lib/enums";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { io } from "socket.io-client";
import { useSession } from "next-auth/react";
import { revalidateProducts } from "@/lib/react-query/actions/product.action";

interface ProductsGridProps {
  products: Product[];
  currentPage: number;
  totalPages: number;
  searchParam: string;
}

/**
 * ProductsGrid - Client component for displaying products in a grid
 * Separated to enable future Socket.IO integration
 */
export default function ProductsGrid({
  products,
  currentPage,
  totalPages,
  searchParam,
}: ProductsGridProps) {
  const { t } = useTranslation();
  const session = useSession();

  useEffect(() => {
    const socket = io(`${process.env.NEXT_PUBLIC_API}/products` || "", {
      auth: {
        token: session.data?.jwt,
      },
    });
    socket.on("connect", () => {
      console.log("Connected to WebSocket server");
    });
    console.log(socket);

    socket.on("productUpdate", async () => {
      console.log("WebSocket connection established");
      await revalidateProducts();
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  if (products.length === 0) {
    return (
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
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
