import { Button } from "@/components/ui/button";
import { Product, Promotion, PromotionType } from "@/types/product&category";
import { useAuth } from "@/hooks/useAuth";
import { CartContext } from "@/contexts/CartContext";
import { Minus, Plus } from "lucide-react";
import Image from "next/image";
import { formatR$, getPromotionalPrice } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

const ProductCard: React.FC<{
  product: Product;
  isOpen: boolean;
}> = ({ product, isOpen }) => {
  const { cart, addToCart, updateQuantity } = useAuth(CartContext);

  const itemInCart = cart.find(
    (item) => item.type === "PRODUCT" && item.product.id === product.id,
  );

  const itemQuantity = itemInCart?.quantity ?? 0;

  const promotion = product.promotionItem?.[0]?.promotion;

  const originalPrice = Number(product.price);

  const promotionalPrice = getPromotionalPrice(originalPrice, promotion);

  const hasPromotion = promotionalPrice !== null;

  return (
    <div
      key={product.id}
      className="bg-card border-border group flex flex-col overflow-hidden rounded-lg border transition-all select-none hover:shadow-sm"
    >
      <div className="bg-fundo2 relative h-46 overflow-hidden">
        <Image
          src={
            product.imageUrl ??
            "https://placehold.co/500x500/858585/ffffff?text=Produto"
          }
          alt={product.name}
          fill
          className="object-fit transition-transform duration-300 group-hover:scale-110"
          unoptimized
        />
        {hasPromotion && (
          <Badge className="from-cor1 to-cor2 absolute top-2 left-2 border-none bg-linear-to-br text-xs font-bold tracking-wide text-white">
            {promotion?.type === "PERCENTAGE"
              ? `-${promotion.percentage}%`
              : `-${formatR$(Number(promotion?.value))}`}
          </Badge>
        )}
      </div>

      <div className="flex flex-1 flex-col justify-between space-y-1 p-2">
        <h3 className="text-texto text-md font-semibold">{product.name}</h3>
        <ScrollArea>
          <p className="text-texto/60 max-h-20 pb-2 text-xs">
            {product.description}
          </p>
        </ScrollArea>
        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-col leading-tight">
            {hasPromotion && (
              <span className="text-texto/60 text-xs line-through">
                {formatR$(originalPrice)}
              </span>
            )}

            <span
              className={`text-lg font-bold ${
                hasPromotion ? "text-green-600" : "text-green-600"
              }`}
            >
              {formatR$(hasPromotion ? promotionalPrice : originalPrice)}
            </span>
          </div>
          <div className="flex items-center rounded-full border bg-transparent">
            <Button
              className="cursor-pointer rounded-full p-0 transition hover:bg-gray-100"
              variant="ghost"
              disabled={itemQuantity === 0}
              onClick={() =>
                updateQuantity(product.id, "PRODUCT", itemQuantity - 1)
              }
            >
              <Minus className="h-2 w-2 text-red-700" />
            </Button>

            <span className="text-texto px-2 text-sm font-semibold">
              {itemQuantity}
            </span>

            <Button
              variant="ghost"
              className="cursor-pointer rounded-full p-0 transition hover:bg-gray-100"
              onClick={() =>
                addToCart({
                  type: "PRODUCT",
                  product,
                  quantity: 1,
                  originalPrice: originalPrice,
                  unitPrice: promotionalPrice ?? originalPrice,
                  subtotal: promotionalPrice ?? originalPrice,
                  promotion,
                })
              }
              disabled={!isOpen}
            >
              <Plus className="h-2 w-2 text-green-700" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
