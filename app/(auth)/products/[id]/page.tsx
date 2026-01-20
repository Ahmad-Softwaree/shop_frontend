"use client";

import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getProductById } from "@/lib/react-query/actions/product.action";
import {
  useDeleteProduct,
  useMarkAvailable,
} from "@/lib/react-query/queries/product.query";
import { useCheckout } from "@/lib/react-query/queries/stripe.query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Edit,
  ShoppingCart,
  Trash2,
  CheckCircle,
} from "lucide-react";
import { ENUMs } from "@/lib/enums";
import { imageSrc } from "@/lib/functions";
import { useTranslation } from "react-i18next";
import { useSession } from "next-auth/react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Product } from "@/types/types";

type ProductPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default function ProductPage({ params }: ProductPageProps) {
  const { t, i18n } = useTranslation();
  const { data: session } = useSession();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const deleteProductMutation = useDeleteProduct();
  const markAvailableMutation = useMarkAvailable();
  const checkoutMutation = useCheckout();

  useEffect(() => {
    async function fetchProduct() {
      try {
        const resolvedParams = await params;
        const productData = await getProductById(resolvedParams.id);
        setProduct(productData);
      } catch (error) {
        notFound();
      } finally {
        setIsLoading(false);
      }
    }
    fetchProduct();
  }, [params]);

  const handleBuy = () => {
    if (!product) return;
    // Go straight to checkout
    checkoutMutation.mutate(product.id);
  };

  const handleDelete = () => {
    if (!product) return;
    deleteProductMutation.mutate(product.id.toString(), {
      onSuccess: () => {
        setShowDeleteDialog(false);
      },
    });
  };

  const handleMarkAvailable = () => {
    if (!product) return;
    markAvailableMutation.mutate(product.id.toString(), {
      onSuccess: async () => {
        // Refresh product data
        const productData = await getProductById(product.id.toString());
        setProduct(productData);
      },
    });
  };

  const isDeleting = deleteProductMutation.isPending;
  const isBuying = checkoutMutation.isPending;
  const isMarkingAvailable = markAvailableMutation.isPending;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">{t("common.loading")}</div>
      </div>
    );
  }

  if (!product) {
    notFound();
  }

  const isOwner = session?.user?.id
    ? Number(session.user.id) === product.userId
    : false;

  const currentLang = i18n.language as "en" | "ar" | "ckb";
  const productName =
    currentLang === "en"
      ? product.enName
      : currentLang === "ar"
      ? product.arName
      : product.ckbName;

  const productDesc =
    currentLang === "en"
      ? product.enDesc
      : currentLang === "ar"
      ? product.arDesc
      : product.ckbDesc;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" asChild>
          <Link href={ENUMs.PAGES.PRODUCTS}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t("common.back")}
          </Link>
        </Button>
        <div className="flex gap-2">
          {isOwner && (
            <>
              <Button variant="outline" asChild>
                <Link href={`${ENUMs.PAGES.PRODUCTS}/${product.id}/edit`}>
                  <Edit className="h-4 w-4 mr-2" />
                  {t("common.edit")}
                </Link>
              </Button>
              <Button
                variant="destructive"
                onClick={() => setShowDeleteDialog(true)}>
                <Trash2 className="h-4 w-4 mr-2" />
                {t("common.delete")}
              </Button>
              {product.status === "SOLD_OUT" && (
                <Button
                  variant="secondary"
                  onClick={handleMarkAvailable}
                  disabled={isMarkingAvailable}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  {isMarkingAvailable
                    ? t("common.loading")
                    : t("products.markAvailable")}
                </Button>
              )}
            </>
          )}
          {!isOwner && product.status === "AVAILABLE" && (
            <Button onClick={handleBuy} disabled={isBuying}>
              <ShoppingCart className="h-4 w-4 mr-2" />
              {isBuying ? t("common.loading") : t("products.buy")}
            </Button>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="relative w-full h-96 md:h-[500px] rounded-lg overflow-hidden border">
          <Image
            src={imageSrc(product.image)}
            alt={productName}
            fill
            className="object-cover"
          />
          <Badge
            variant={product.status === "AVAILABLE" ? "default" : "destructive"}
            className="absolute top-4 right-4">
            {product.status === "AVAILABLE"
              ? t("products.status.available")
              : t("products.status.sold_out")}
          </Badge>
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-bold mb-2">{productName}</h1>
            <p className="text-3xl font-bold text-primary">
              ${product.price.toFixed(2)}
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold mb-2">
                {t("products.description")}
              </h2>
              <p className="text-muted-foreground whitespace-pre-wrap">
                {productDesc}
              </p>
            </div>

            {i18n.language !== "en" && (
              <div>
                <h3 className="font-medium mb-1">
                  {t("products.englishName")}
                </h3>
                <p className="text-muted-foreground">{product.enName}</p>
              </div>
            )}

            {i18n.language !== "ar" && (
              <div>
                <h3 className="font-medium mb-1" dir="rtl">
                  {t("products.arabicName")}
                </h3>
                <p className="text-muted-foreground" dir="rtl">
                  {product.arName}
                </p>
              </div>
            )}

            {i18n.language !== "ckb" && (
              <div>
                <h3 className="font-medium mb-1" dir="rtl">
                  {t("products.kurdishName")}
                </h3>
                <p className="text-muted-foreground" dir="rtl">
                  {product.ckbName}
                </p>
              </div>
            )}

            {product.orders && product.orders.length > 0 && (
              <div className="pt-4 border-t">
                <h3 className="font-semibold mb-2">{t("products.buyer")}</h3>
                <div className="bg-muted p-4 rounded-md space-y-1">
                  <p className="font-medium">{product.orders[0].user.name}</p>
                  <p className="text-sm text-muted-foreground">
                    @{product.orders[0].user.username}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {product.orders[0].user.phone}
                  </p>
                </div>
              </div>
            )}

            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                {t("products.createdAt")}:{" "}
                {new Date(product.createdAt).toLocaleDateString(i18n.language, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              {product.updatedAt && (
                <p className="text-sm text-muted-foreground">
                  {t("products.updatedAt")}:{" "}
                  {new Date(product.updatedAt).toLocaleDateString(
                    i18n.language,
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("products.deleteTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("products.deleteDescription")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>
              {t("common.cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {isDeleting ? t("common.loading") : t("common.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
