"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ENUMs } from "@/lib/enums";
import FilterModal from "./FilterModal";

/**
 * ProductStatusFilter - A specific filter component for filtering products by status
 * Uses the generic FilterModal component for consistent UI
 */
const ProductStatusFilter = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useTranslation();

  const currentStatus = searchParams.get(ENUMs.PARAMS.STATUS) || "";

  const updateStatus = (value: string) => {
    const newParams = new URLSearchParams(searchParams.toString());
    if (value && value !== "ALL") {
      newParams.set(ENUMs.PARAMS.STATUS, value);
    } else {
      newParams.delete(ENUMs.PARAMS.STATUS);
    }
    newParams.set(ENUMs.PARAMS.PAGE, "1"); // Reset pagination
    router.replace(`?${newParams.toString()}`);
  };

  const clearFilters = () => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.delete(ENUMs.PARAMS.STATUS);
    newParams.set(ENUMs.PARAMS.PAGE, "1");
    router.replace(`?${newParams.toString()}`);
  };

  const hasActiveFilters = currentStatus !== "";
  const activeFiltersCount = hasActiveFilters ? 1 : 0;

  return (
    <FilterModal
      title={t("products.filterProducts")}
      description={t("products.filterByStatus")}
      activeFiltersCount={activeFiltersCount}
      hasActiveFilters={hasActiveFilters}
      onClearFilters={clearFilters}>
      <div className="space-y-2">
        <Label>{t("products.productStatus")}</Label>
        <RadioGroup value={currentStatus || "ALL"} onValueChange={updateStatus}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="ALL" id="all" />
            <Label htmlFor="all" className="font-normal cursor-pointer">
              {t("products.allProducts")}
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="AVAILABLE" id="available" />
            <Label htmlFor="available" className="font-normal cursor-pointer">
              {t("products.available")}
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="SOLD_OUT" id="sold_out" />
            <Label htmlFor="sold_out" className="font-normal cursor-pointer">
              {t("products.soldOut")}
            </Label>
          </div>
        </RadioGroup>
      </div>
    </FilterModal>
  );
};

export default ProductStatusFilter;
