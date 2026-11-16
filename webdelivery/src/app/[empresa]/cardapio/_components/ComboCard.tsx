import { Button } from "@/components/ui/button";
import { Combo } from "@/types/product&category";
import { Layers, Minus, Plus } from "lucide-react";
import { formatR$ } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/useAuth";
import { CartContext } from "@/contexts/CartContext";

const ComboCard: React.FC<{
  combo: Combo;
  isOpen: boolean;
}> = ({ combo, isOpen }) => {
  const { cart, addToCart, updateQuantity } = useAuth(CartContext);

  const itemInCart = cart.find(
    (item) => item.type === "COMBO" && item.combo.id === combo.id,
  );

  const itemQuantity = itemInCart?.quantity ?? 0;
  return (
    <div className="group bg-card relative flex flex-col overflow-hidden rounded-2xl border transition-all">
      {/* Container do Carrossel de Imagens */}
      <div className="relative h-56 w-full overflow-hidden">
        <Carousel
          className="h-full w-full"
          opts={{
            watchDrag: false,
          }}
        >
          <CarouselContent className="m-0 h-full">
            {combo?.items?.map((item, index) => (
              <CarouselItem key={`${item.id}-${index}`} className="h-full p-0">
                <div className="relative h-56 w-full">
                  <Image
                    src={
                      item.product?.imageUrl ??
                      "https://placehold.co/500x500/858585/ffffff?text=Produto"
                    }
                    alt={item.product?.name || "Foto do Produto"}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    fill
                    unoptimized
                  />
                  {/* Overlay para legibilidade */}

                  <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 flex justify-center p-4">
                    <p className="text-center text-sm font-semibold text-white drop-shadow-lg">
                      {item.product?.name}
                    </p>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Navegação interna sutil - visível apenas no hover */}
          <CarouselPrevious className="from-fundo to-fundo2 text-texto left-2 h-8 w-8 border-none bg-linear-to-br" />
          <CarouselNext className="from-fundo to-fundo2 text-texto right-2 h-8 w-8 border-none bg-linear-to-br" />
        </Carousel>

        {/* Badges Flutuantes */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
          <Badge
            variant="secondary"
            className="from-fundo to-fundo2 text-texto flex items-center gap-1 border-none py-1 shadow-sm backdrop-blur-sm"
          >
            <Layers size={12} />
            {combo?.items?.length || 0} itens
          </Badge>
        </div>
      </div>

      {/* Informações do Combo */}
      <div className="flex flex-1 flex-col p-5">
        <div>
          <h3 className="text-texto line-clamp-1 text-lg font-bold">
            {combo.name}
          </h3>
          <p className="text-texto/60 line-clamp-2 min-h-[40px] text-sm">
            {combo.description ||
              "A combinação perfeita para sua fome. Aproveite o desconto exclusivo do combo."}
          </p>
        </div>

        <div className="mt-auto flex items-center justify-between pt-4">
          <div className="flex flex-col">
            <span className="text-xl font-bold text-green-600">
              {formatR$(combo.price)}
            </span>
          </div>
          <div className="border-border flex items-center rounded-full border">
            <Button
              className="cursor-pointer rounded-full p-0 transition hover:bg-gray-100"
              variant="ghost"
              disabled={itemQuantity === 0}
              onClick={() =>
                updateQuantity(combo.id, "COMBO", itemQuantity - 1)
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
              disabled={!isOpen}
              onClick={() =>
                addToCart({
                  type: "COMBO",
                  combo,
                  quantity: 1,
                  unitPrice: combo.price,
                  subtotal: combo.price,
                })
              }
            >
              <Plus className="h-2 w-2 text-green-700" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComboCard;
