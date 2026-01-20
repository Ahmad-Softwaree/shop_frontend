/**
 * EXAMPLE: How to create new filter components using the generic FilterModal
 *
 * The FilterModal component is a reusable UI shell that can be used for any type of filtering.
 * Here are examples of how to create new filter components:
 */

// ============================================
// Example 1: Order Status Filter
// ============================================

"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import FilterModal from "./FilterModal";

const OrderStatusFilter = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get current filters from URL
  const statusParams = searchParams.get("orderStatus")?.split(",") || [];

  const updateStatus = (status: string, checked: boolean) => {
    const newParams = new URLSearchParams(searchParams.toString());
    let statuses = [...statusParams];

    if (checked) {
      statuses.push(status);
    } else {
      statuses = statuses.filter((s) => s !== status);
    }

    if (statuses.length > 0) {
      newParams.set("orderStatus", statuses.join(","));
    } else {
      newParams.delete("orderStatus");
    }
    newParams.set("page", "1");
    router.replace(`?${newParams.toString()}`);
  };

  const clearFilters = () => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.delete("orderStatus");
    newParams.set("page", "1");
    router.replace(`?${newParams.toString()}`);
  };

  const hasActiveFilters = statusParams.length > 0;

  return (
    <FilterModal
      title="Filter Orders"
      description="Filter orders by their status"
      activeFiltersCount={statusParams.length}
      hasActiveFilters={hasActiveFilters}
      onClearFilters={clearFilters}>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Order Status</Label>
          <div className="space-y-2">
            {["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"].map(
              (status) => (
                <div key={status} className="flex items-center space-x-2">
                  <Checkbox
                    id={status}
                    checked={statusParams.includes(status)}
                    onCheckedChange={(checked) =>
                      updateStatus(status, checked as boolean)
                    }
                  />
                  <Label
                    htmlFor={status}
                    className="font-normal cursor-pointer">
                    {status}
                  </Label>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </FilterModal>
  );
};

// ============================================
// Example 2: Date Range Filter
// ============================================

import { Input } from "@/components/ui/input";

const DateRangeFilter = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const fromDate = searchParams.get("from") || "";
  const toDate = searchParams.get("to") || "";

  const updateDateRange = (from: string, to: string) => {
    const newParams = new URLSearchParams(searchParams.toString());

    if (from) newParams.set("from", from);
    else newParams.delete("from");

    if (to) newParams.set("to", to);
    else newParams.delete("to");

    newParams.set("page", "1");
    router.replace(`?${newParams.toString()}`);
  };

  const clearFilters = () => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.delete("from");
    newParams.delete("to");
    newParams.set("page", "1");
    router.replace(`?${newParams.toString()}`);
  };

  const hasActiveFilters = fromDate !== "" || toDate !== "";
  const activeFiltersCount = (fromDate ? 1 : 0) + (toDate ? 1 : 0);

  return (
    <FilterModal
      title="Filter by Date"
      description="Select a date range"
      activeFiltersCount={activeFiltersCount}
      hasActiveFilters={hasActiveFilters}
      onClearFilters={clearFilters}>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="from">From Date</Label>
          <Input
            id="from"
            type="date"
            value={fromDate}
            onChange={(e) => updateDateRange(e.target.value, toDate)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="to">To Date</Label>
          <Input
            id="to"
            type="date"
            value={toDate}
            onChange={(e) => updateDateRange(fromDate, e.target.value)}
          />
        </div>
      </div>
    </FilterModal>
  );
};

// ============================================
// Example 3: Price Range Filter with Select
// ============================================

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const PriceRangeFilter = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const priceRange = searchParams.get("priceRange") || "";

  const updatePriceRange = (value: string) => {
    const newParams = new URLSearchParams(searchParams.toString());

    if (value && value !== "all") {
      newParams.set("priceRange", value);
    } else {
      newParams.delete("priceRange");
    }

    newParams.set("page", "1");
    router.replace(`?${newParams.toString()}`);
  };

  const clearFilters = () => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.delete("priceRange");
    newParams.set("page", "1");
    router.replace(`?${newParams.toString()}`);
  };

  const hasActiveFilters = priceRange !== "";

  return (
    <FilterModal
      title="Filter by Price"
      description="Select a price range"
      activeFiltersCount={hasActiveFilters ? 1 : 0}
      hasActiveFilters={hasActiveFilters}
      onClearFilters={clearFilters}>
      <div className="space-y-2">
        <Label>Price Range</Label>
        <Select value={priceRange || "all"} onValueChange={updatePriceRange}>
          <SelectTrigger>
            <SelectValue placeholder="Select price range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Prices</SelectItem>
            <SelectItem value="0-50">$0 - $50</SelectItem>
            <SelectItem value="50-100">$50 - $100</SelectItem>
            <SelectItem value="100-500">$100 - $500</SelectItem>
            <SelectItem value="500+">$500+</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </FilterModal>
  );
};

// ============================================
// KEY FEATURES OF THE GENERIC FilterModal:
// ============================================
/**
 * 1. title: Custom dialog title
 * 2. description: Custom dialog description
 * 3. activeFiltersCount: Number to show in badge (e.g., "3" for 3 active filters)
 * 4. hasActiveFilters: Boolean to show/hide the badge and clear button
 * 5. onClearFilters: Callback when user clicks "Clear Filters"
 * 6. children: Your custom filter UI (radio buttons, checkboxes, inputs, etc.)
 * 7. trigger: Optional custom trigger button (defaults to filter icon with badge)
 * 8. open: Optional controlled state for dialog
 * 9. onOpenChange: Optional callback for dialog state changes
 */

// ============================================
// USAGE IN YOUR PAGES:
// ============================================

// Simply import and use any filter component:
// import ProductStatusFilter from "@/components/shared/ProductStatusFilter";
// import OrderStatusFilter from "@/components/shared/OrderStatusFilter";
// import DateRangeFilter from "@/components/shared/DateRangeFilter";
// import PriceRangeFilter from "@/components/shared/PriceRangeFilter";

// Then in your page:
// <div className="flex gap-2">
//   <Search />
//   <ProductStatusFilter />
//   <PriceRangeFilter />
//   <DateRangeFilter />
// </div>

export {};
