import { notFound } from "next/navigation";
import ProductForm from "@/components/forms/ProductForm";
import { getProductById } from "@/lib/actions/product.action";
import { getServerTranslation } from "@/i18n/server";

type EditProductPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditProductPage({
  params,
}: EditProductPageProps) {
  const { t } = await getServerTranslation();
  const { id } = await params;

  let product;
  try {
    product = await getProductById(id);
  } catch (error) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t("products.editProduct")}</h1>
        <p className="text-muted-foreground mt-1">
          {t("products.editProductDescription")}
        </p>
      </div>

      <div className="bg-card rounded-lg border p-6">
        <ProductForm product={product} />
      </div>
    </div>
  );
}
