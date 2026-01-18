import ProductForm from "@/components/forms/ProductForm";
import { getServerTranslation } from "@/i18n/server";

export default async function AddProductPage() {
  const { t } = await getServerTranslation();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t("products.addProduct")}</h1>
        <p className="text-muted-foreground mt-1">
          {t("products.addProductDescription")}
        </p>
      </div>

      <div className="bg-card rounded-lg border p-6">
        <ProductForm />
      </div>
    </div>
  );
}
