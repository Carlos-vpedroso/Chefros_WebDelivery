"use client";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { CartContext } from "@/contexts/CartContext";

const FloatingCartButton: React.FC<{
  onCartClick: () => void;
}> = ({ onCartClick }) => {
  const { itemCount } = useAuth(CartContext);

  if (itemCount === 0) return null;

  return (
    <div className="fixed right-6 bottom-6 z-50">
      <Button
        onClick={onCartClick}
        className="from-cor1 to-cor2 relative h-14 w-14 cursor-pointer rounded-full bg-linear-to-br text-white shadow-lg transition-all duration-300 hover:brightness-110"
        size="icon"
      >
        <ShoppingCart className="scale-150" />
        {itemCount > 0 && (
          <div className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-orange-600">
            <p className="text-md leading-none font-semibold text-white">
              {itemCount}
            </p>
          </div>
        )}
      </Button>
    </div>
  );
};

export default FloatingCartButton;
