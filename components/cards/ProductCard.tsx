"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Edit, Trash2, ShoppingCart, CheckCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import {
  Product,
  deleteProduct,
  buyProduct,
  markAvailable,
} from "@/lib/actions/product.action";
import { toast } from "sonner";
import { ENUMs } from "@/lib/enums";
import { useSession } from "next-auth/react";
import { imageSrc } from "@/lib/functions";

type ProductCardProps = {
  product: Product;
  showActions?: boolean;
};

export default function ProductCard({
  product,
  showActions = false,
}: ProductCardProps) {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const { data: session } = useSession();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isBuying, setIsBuying] = useState(false);
  const [isMarkingAvailable, setIsMarkingAvailable] = useState(false);

  const isOwner = session?.user?.id
    ? Number(session.user.id) === product.userId
    : false;
  const shouldShowActions = showActions && isOwner;
  const buyer = product.orders?.[0]?.user;

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

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteProduct(product.id.toString());
      toast.success(t("products.deleteSuccess"));
      router.refresh();
    } catch (error: any) {
      toast.error(error?.message || t("common.error"));
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const handleBuy = async () => {
    setIsBuying(true);
    try {
      await buyProduct(product.id.toString());
      toast.success(t("products.buySuccess"));
      router.refresh();
    } catch (error: any) {
      toast.error(error?.message || t("common.error"));
    } finally {
      setIsBuying(false);
    }
  };

  const handleMarkAvailable = async () => {
    setIsMarkingAvailable(true);
    try {
      await markAvailable(product.id.toString());
      toast.success(t("products.markAvailableSuccess"));
      router.refresh();
    } catch (error: any) {
      toast.error(error?.message || t("common.error"));
    } finally {
      setIsMarkingAvailable(false);
    }
  };

  return (
    <>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <Link href={`${ENUMs.PAGES.PRODUCTS}/${product.id}`}>
          <div className="relative w-full h-48">
            <Image
              src={imageSrc(product.image)}
              alt={productName}
              fill
              className="object-cover"
            />
            <Badge
              variant={
                product.status === "AVAILABLE" ? "default" : "destructive"
              }
              className="absolute top-2 right-2">
              {product.status === "AVAILABLE"
                ? t("products.status.available")
                : t("products.status.sold_out")}
            </Badge>
          </div>
        </Link>

        <CardHeader>
          <CardTitle className="line-clamp-1">{productName}</CardTitle>
          <CardDescription className="line-clamp-2">
            {productDesc}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-primary">
              ${product.price.toFixed(2)}
            </span>
          </div>
          {buyer && (
            <div className="mt-3 p-2 bg-muted rounded-md text-sm">
              <p className="font-semibold">{t("products.buyer")}:</p>
              <p className="text-muted-foreground">
                {buyer.name} (@{buyer.username})
              </p>
              <p className="text-muted-foreground text-xs">{buyer.phone}</p>
            </div>
          )}
        </CardContent>

        {shouldShowActions && (
          <CardFooter className="gap-2 flex-col">
            <div className="flex gap-2 w-full">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() =>
                  router.push(`${ENUMs.PAGES.PRODUCTS}/${product.id}/edit`)
                }>
                <Edit className="h-4 w-4 mr-2" />
                {t("common.edit")}
              </Button>
              <Button
                variant="destructive"
                size="sm"
                className="flex-1"
                onClick={() => setShowDeleteDialog(true)}>
                <Trash2 className="h-4 w-4 mr-2" />
                {t("common.delete")}
              </Button>
            </div>
            {product.status === "SOLD_OUT" && (
              <Button
                variant="secondary"
                size="sm"
                className="w-full"
                onClick={handleMarkAvailable}
                disabled={isMarkingAvailable}>
                <CheckCircle className="h-4 w-4 mr-2" />
                {isMarkingAvailable
                  ? t("common.loading")
                  : t("products.markAvailable")}
              </Button>
            )}
          </CardFooter>
        )}

        {!isOwner && product.status === "AVAILABLE" && (
          <CardFooter>
            <Button
              variant="default"
              size="sm"
              className="w-full"
              onClick={handleBuy}
              disabled={isBuying}>
              <ShoppingCart className="h-4 w-4 mr-2" />
              {isBuying ? t("common.loading") : t("products.buy")}
            </Button>
          </CardFooter>
        )}
      </Card>

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
    </>
  );
}
