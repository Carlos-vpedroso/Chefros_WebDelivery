"use client";
import React, { useEffect, useRef } from "react";
import { Product } from "@/types/product&category";
import ProductCard from "./ProductCard";
import { Separator } from "@/components/ui/separator";

interface ProductGridProps {
  products: Product[];
  onCategoryChange: (category: string) => void;
  isOpen: boolean;
}

const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  onCategoryChange,
  isOpen,
}) => {
  const sectionRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  // Agrupar produtos por categoria
  const productsByCategory = products.reduce(
    (acc, product) => {
      const categoryName = product.category?.name;
      if (!categoryName) return acc; // <-- sempre retorna o acumulador!

      if (!acc[categoryName]) {
        acc[categoryName] = [];
      }

      acc[categoryName].push(product);
      return acc;
    },
    {} as Record<string, Product[]>,
  );

  // Função para formatar o nome da categoria (primeira letra maiúscula)
  const formatCategoryName = (category: string) => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.2) {
            const category = entry.target.id
              .replace("category-", "")
              .replace(/-/g, " ");
            onCategoryChange(category);
          }
        });
      },
      {
        rootMargin: "-100px 0px -300px 0px",
        threshold: 0.2,
      },
    );

    // Observar todas as seções
    sectionRefs.current.forEach((section) => {
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, [products, onCategoryChange]);

  // Função para definir a ref de cada seção
  const setSectionRef = (id: string) => (el: HTMLDivElement | null) => {
    const categoryId = `category-${id.toLowerCase().replace(/\s+/g, "-")}`;
    if (el) {
      sectionRefs.current.set(categoryId, el);
    } else {
      sectionRefs.current.delete(categoryId);
    }
  };

  return (
    <div className="space-y-10 px-4 py-10">
      {Object.entries(productsByCategory).map(
        ([category, categoryProducts]) => (
          <section
            key={category}
            id={`category-${category.toLowerCase().replace(/\s+/g, "-")}`}
            ref={setSectionRef(category)}
            className="scroll-mt-20 space-y-6"
          >
            {/* Header da categoria */}
            <div className="flex items-baseline justify-between">
              <h2 className="text-texto border-l-4 border-green-600 pl-3 text-xl font-bold">
                {formatCategoryName(category)}
              </h2>
              <span className="text-texto/60 text-sm">
                {categoryProducts.length} item
                {categoryProducts.length > 1 && "s"}
              </span>
            </div>
            <Separator />

            {/* Grid de produtos */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
              {categoryProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isOpen={isOpen}
                />
              ))}
            </div>
          </section>
        ),
      )}
    </div>
  );
};

export default ProductGrid;
