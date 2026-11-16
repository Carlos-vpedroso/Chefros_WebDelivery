import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Business } from "@/types/business";
import { CartItem } from "@/types/product&category";
import Autoplay from "embla-carousel-autoplay";
import { ChevronRight, Minus, Plus, Trash2, ShoppingCart } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { CartContext } from "@/contexts/CartContext";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import { formatR$ } from "@/lib/utils";

const CartSheet: React.FC<{
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  EMPRESA: Business | null;
}> = ({ isOpen, onOpenChange, EMPRESA }) => {
  const { cart, updateQuantity, removeFromCart, totalPrice, itemCount } =
    useAuth(CartContext);

  const IMAGE_SIZE = 96;
  const router = useRouter();

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-11/12 max-w-full flex-col p-0">
        <SheetHeader className="border-b p-6">
          <SheetTitle className="flex items-center gap-2 text-xl font-bold">
            <ShoppingCart className="text-cor1 h-6 w-6" />
            Seu Pedido ({itemCount})
          </SheetTitle>
        </SheetHeader>

        {itemCount === 0 ? (
          <div className="flex h-full flex-col items-center justify-center p-6 text-center">
            <ShoppingCart className="text-texto/40 mb-4 h-16 w-16" />
            <p className="text-texto/60 text-lg font-semibold">
              Seu carrinho está vazio
            </p>
            <p className="text-texto/40 mt-2 text-sm">
              Adicione produtos do cardápio.
            </p>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-4 overflow-y-auto p-2">
              {cart.map((item: CartItem) =>
                item.type === "PRODUCT" ? (
                  <div
                    key={item.product.id}
                    className="border-b pb-4 last:border-b-0 last:pb-0"
                  >
                    <div className="flex items-center gap-4">
                      <Image
                        src={
                          item.product.imageUrl ??
                          "https://placehold.co/500x500/858585/ffffff?text=Produto"
                        }
                        alt={item.product.name}
                        width={IMAGE_SIZE}
                        height={IMAGE_SIZE}
                        unoptimized
                        className="rounded-xl object-contain"
                      />

                      <div className="min-w-0 flex-1">
                        <h3 className="text-texto line-clamp-2 font-semibold">
                          {item.product.name}
                        </h3>
                        <div className="mt-1 flex flex-col">
                          {/* Preço antigo (se houver promoção) */}
                          {item.unitPrice < item.originalPrice && (
                            <span className="text-texto/40 text-sm line-through">
                              {formatR$(item.originalPrice * item.quantity)}
                            </span>
                          )}

                          {/* Preço final */}
                          <span className="text-lg font-bold text-green-600">
                            {formatR$(item.unitPrice * item.quantity)}
                          </span>
                        </div>
                      </div>

                      {/* Controles de Quantidade e Remoção */}
                      <div className="flex flex-col items-end gap-4">
                        <div className="flex items-center rounded-full border">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 rounded-full text-red-700"
                            onClick={() =>
                              updateQuantity(
                                item.product.id,
                                "PRODUCT",
                                item.quantity - 1,
                              )
                            }
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="text-texto px-1 text-sm font-semibold">
                            {item.quantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 rounded-full text-green-700"
                            onClick={() =>
                              updateQuantity(
                                item.product.id,
                                "PRODUCT",
                                item.quantity + 1,
                              )
                            }
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-red-500 hover:bg-red-50 hover:text-red-600"
                          onClick={() =>
                            removeFromCart(item.product.id, "PRODUCT")
                          }
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    key={item.combo.id}
                    className="border-cor1/40 bg-cor1/5 rounded-2xl border p-4 shadow-sm"
                  >
                    {/* Badge */}
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <Badge className="bg-cor1 rounded-full px-3 py-1 text-xs font-bold tracking-wide text-white">
                        COMBO
                      </Badge>
                      <span className="text-texto/60 text-sm">
                        Economia especial 🔥
                      </span>
                    </div>
                    <div className="flex flex-row justify-between">
                      <div className="flex w-full flex-col gap-4">
                        {/* Carousel de imagens */}
                        <Carousel
                          opts={{
                            align: "start",
                            loop: true,
                          }}
                          plugins={[
                            Autoplay({
                              delay: 5000,
                            }),
                          ]}
                          className="w-24 shrink-0"
                        >
                          <CarouselContent>
                            {item.combo.items.map((comboItem) => (
                              <CarouselItem key={comboItem.id}>
                                <Image
                                  src={
                                    comboItem.product?.imageUrl ??
                                    "https://placehold.co/500x500/858585/ffffff?text=Produto"
                                  }
                                  alt={comboItem.product?.name || "Produto"}
                                  width={96}
                                  height={96}
                                  unoptimized
                                  className="rounded-xl object-contain"
                                />
                              </CarouselItem>
                            ))}
                          </CarouselContent>
                        </Carousel>

                        {/* Infos */}
                        <div className="flex-1">
                          <h3 className="text-texto text-base font-bold">
                            {item.combo.name}
                          </h3>

                          {/* Lista de itens */}
                          <ul className="text-texto/70 mt-2 space-y-1 text-xs">
                            {item.combo.items.slice(0, 3).map((comboItem) => (
                              <li key={comboItem.id} className="line-clamp-1">
                                • {comboItem.quantity}x{" "}
                                {comboItem.product?.name}
                              </li>
                            ))}

                            {item.combo.items.length > 3 && (
                              <li className="text-texto/50 italic">
                                + {item.combo.items.length - 3} itens
                              </li>
                            )}
                          </ul>
                        </div>
                      </div>
                      {/* Controles */}
                      <div className="flex w-full flex-col justify-between">
                        <div className="flex w-full justify-center">
                          <div className="flex w-25 items-center justify-between rounded-full border">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-red-700"
                              onClick={() =>
                                updateQuantity(
                                  item.combo.id,
                                  "COMBO",
                                  item.quantity - 1,
                                )
                              }
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="px-2 text-sm font-semibold">
                              {item.quantity}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-green-700"
                              onClick={() =>
                                updateQuantity(
                                  item.combo.id,
                                  "COMBO",
                                  item.quantity + 1,
                                )
                              }
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="flex items-center justify-end gap-2">
                          <p className="mt-3 text-xl font-extrabold text-green-600">
                            R${" "}
                            {(Number(item.combo.price) * item.quantity).toFixed(
                              2,
                            )}
                          </p>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="mt-2 h-7 w-7 text-red-500 hover:bg-red-50"
                            onClick={() =>
                              removeFromCart(item.combo.id, "COMBO")
                            }
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ),
              )}
            </div>

            <SheetFooter className="bg-card border-t p-6">
              <div className="w-full">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-texto/60 text-lg font-medium">
                    Total
                  </span>
                  <span className="text-3xl font-extrabold text-green-600">
                    R$ {totalPrice.toFixed(2)}
                  </span>
                </div>
                <Button
                  onClick={() =>
                    router.push(`/${EMPRESA?.slug}/cardapio/checkout`)
                  }
                  className="from-cor1 to-cor2 h-12 w-full cursor-pointer bg-linear-to-br text-lg text-white shadow-lg transition-colors hover:brightness-110"
                >
                  Finalizar Pedido
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartSheet;
