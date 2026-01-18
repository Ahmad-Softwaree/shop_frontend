"use client";

import { useTranslation } from "react-i18next";
import { AnimateOnScroll } from "@/components/shared/animate";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Heart, ShoppingCart, TrendingUp } from "lucide-react";

const showcaseProducts = [
  {
    id: 1,
    key: "product1",
    price: 299.99,
    originalPrice: 399.99,
    rating: 4.8,
    reviews: 1234,
    badge: "bestseller",
    image: "🎧",
  },
  {
    id: 2,
    key: "product2",
    price: 199.99,
    originalPrice: 249.99,
    rating: 4.6,
    reviews: 892,
    badge: "new",
    image: "⌚",
  },
  {
    id: 3,
    key: "product3",
    price: 1299.99,
    originalPrice: 1599.99,
    rating: 4.9,
    reviews: 567,
    badge: "trending",
    image: "📷",
  },
];

export default function ProductsShowcaseSection() {
  const { t } = useTranslation();

  return (
    <section className="py-24">
      {/* Section Header */}
      <div className="text-center mb-16 space-y-4">
        <AnimateOnScroll animation="fade-up">
          <h2 className="text-4xl md:text-5xl font-bold">
            {t("productsShowcase.title", "Recent Listings")}
          </h2>
        </AnimateOnScroll>
        <AnimateOnScroll animation="fade-up" delay={0.2}>
          <p className="text-lg text-muted-foreground">
            {t(
              "productsShowcase.subtitle",
              "Browse items listed by our community members"
            )}
          </p>
        </AnimateOnScroll>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
        {showcaseProducts.map((product, index) => (
          <AnimateOnScroll
            key={product.id}
            animation="fade-up"
            delay={0.1 * index}>
            <div className="group relative bg-card rounded-xl border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-xl overflow-hidden h-full">
              {/* Badge */}
              <div className="absolute top-4 ltr:left-4 rtl:right-4 z-10">
                <Badge
                  variant={
                    product.badge === "bestseller"
                      ? "default"
                      : product.badge === "new"
                      ? "secondary"
                      : "outline"
                  }
                  className="uppercase text-xs font-bold">
                  {product.badge === "bestseller" && (
                    <>🏆 {t("productsShowcase.bestseller", "Bestseller")}</>
                  )}
                  {product.badge === "new" && (
                    <>✨ {t("productsShowcase.new", "New")}</>
                  )}
                  {product.badge === "trending" && (
                    <>
                      <TrendingUp className="w-3 h-3 ltr:mr-1 rtl:ml-1" />
                      {t("productsShowcase.trending", "Trending")}
                    </>
                  )}
                </Badge>
              </div>

              {/* Wishlist Button */}
              <button
                className="absolute top-4 ltr:right-4 rtl:left-4 z-10 p-2 rounded-full bg-background/80 backdrop-blur-sm border hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                aria-label={t(
                  "productsShowcase.addToWishlist",
                  "Add to wishlist"
                )}>
                <Heart className="w-4 h-4" />
              </button>

              {/* Product Image */}
              <div className="relative h-64 bg-gradient-to-br from-primary/5 to-primary/10 flex items-center justify-center">
                <span className="text-8xl group-hover:scale-110 transition-transform duration-300">
                  {product.image}
                </span>
              </div>

              {/* Product Info */}
              <div className="p-6 space-y-4 h-full">
                <div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                    {t(
                      `productsShowcase.${product.key}.name` as any,
                      product.key
                    )}
                  </h3>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(product.rating)
                              ? "fill-primary text-primary"
                              : "text-muted-foreground/30"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {product.rating} ({product.reviews})
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-bold text-primary">
                      ${product.price}
                    </span>
                    <span className="text-lg text-muted-foreground line-through">
                      ${product.originalPrice}
                    </span>
                    <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                      {t("productsShowcase.save", "Save")} $
                      {(product.originalPrice - product.price).toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <Button className="w-full mt-auto" size="lg">
                  <ShoppingCart className="w-4 h-4 ltr:mr-2 rtl:ml-2" />
                  {t("productsShowcase.addToCart", "Add to Cart")}
                </Button>
              </div>
            </div>
          </AnimateOnScroll>
        ))}
      </div>

      {/* View All Button */}
      <div className="text-center">
        <AnimateOnScroll animation="fade-up">
          <Button size="lg" variant="outline" className="min-w-48">
            {t("productsShowcase.viewAll", "View All Products")}
          </Button>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
