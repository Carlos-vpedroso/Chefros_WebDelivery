"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import Header from "./_components/Header";
import Categories from "./_components/Categories";
import ProductGrid from "./_components/ProductGrid";
import FloatingCartButton from "./_components/FloatingCartButton";
import CartSheet from "./_components/CartSheet";
import { BusinessContext } from "@/contexts/BusinessContext";
import { Category, Combo, Product } from "@/types/product&category";
import { productService } from "@/services/product.service";
import { categoryService } from "@/services/category.service";
import { Skeleton } from "@/components/ui/skeleton";
import { comboAndPromoService } from "@/services/comboAndPromo.service";
import { isBusinessOpen } from "@/lib/utils";
import CombosGrid from "./_components/CombosGrid";

function MenuPage() {
  const { businessInfo, loading } = useAuth(BusinessContext);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [combos, setCombos] = useState<Combo[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const onCartClick = () => {
    setIsCartOpen(true);
  };

  const fetchAll = async () => {
    if (!businessInfo?.slug) return;
    try {
      const [productRes, categoryRes, comboRes] = await Promise.all([
        productService.getAll(businessInfo.slug),
        categoryService.getAll(businessInfo.slug),
        comboAndPromoService.getCombos(businessInfo.slug),
      ]);
      if (productRes.success && productRes.data) {
        setProducts(productRes.data);
      }
      if (categoryRes.success && categoryRes.data) {
        setCategories(categoryRes.data);
      }
      if (comboRes.success && comboRes.data) {
        setCombos(comboRes.data);
      }
    } catch (error) {
      console.error("Erro no fetchAll:", error);
    }
  };

  const isOpen = businessInfo ? isBusinessOpen(businessInfo.workDays) : false;

  useEffect(() => {
    if (businessInfo?.slug) {
      fetchAll();
    }
  }, [businessInfo?.slug]);

  if (loading) {
    return (
      <div className="bg-fundo flex min-h-screen flex-col items-center">
        <div className="flex w-full max-w-7xl flex-col gap-8 px-4">
          {/* Banner Skeleton */}

          <Skeleton className="h-48 w-full rounded-md bg-zinc-300 md:h-64 dark:bg-zinc-700" />

          {/* Logo + Nome da empresa */}
          <div className="flex items-center gap-4 px-2">
            <Skeleton className="h-20 w-20 rounded-md bg-zinc-300 dark:bg-zinc-700" />

            <div className="flex w-full flex-col gap-3">
              <Skeleton className="h-5 w-full rounded bg-zinc-300 dark:bg-zinc-700" />

              <Skeleton className="h-4 w-full rounded bg-zinc-300 dark:bg-zinc-700" />
            </div>
          </div>

          {/* Campo de busca */}

          <Skeleton className="h-12 w-full rounded-lg bg-zinc-300 dark:bg-zinc-700" />

          {/* Grid de produtos */}
          <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <Skeleton
                key={i}
                className="h-40 w-full rounded-lg bg-zinc-300 dark:bg-zinc-700"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-fundo flex min-h-screen flex-col items-center">
      <div className="container min-h-screen w-full max-w-7xl">
        {businessInfo && (
          <Header
            EMPRESA={businessInfo}
            onCartClick={onCartClick}
            isOpen={isOpen}
          />
        )}

        <Categories
          categories={categories}
          selected={selectedCategory}
          onSelect={setSelectedCategory}
        />

        {combos.length > 0 && <CombosGrid combos={combos} isOpen={isOpen} />}

        <ProductGrid
          products={products}
          onCategoryChange={handleCategoryChange}
          isOpen={isOpen}
        />
      </div>
      <FloatingCartButton onCartClick={onCartClick} />
      <CartSheet
        isOpen={isCartOpen}
        onOpenChange={setIsCartOpen}
        EMPRESA={businessInfo}
      />
      <div className="mb-20" />
    </div>
  );
}

export default MenuPage;
