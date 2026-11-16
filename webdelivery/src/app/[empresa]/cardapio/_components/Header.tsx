import { useAuth } from "@/hooks/useAuth";
import { CartContext } from "@/contexts/CartContext";
import { Info, Share2, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Business } from "@/types/business";
import { ThemeToggle } from "@/components/ThemeToggle";

const Header: React.FC<{
  EMPRESA: Business | null;
  onCartClick: () => void;
  isOpen: boolean;
}> = ({ onCartClick, EMPRESA, isOpen }) => {
  const { itemCount } = useAuth(CartContext);

  return (
    <header className="max-w-full overflow-hidden">
      <div className="relative h-48 w-full md:h-64">
        <Image
          src={
            EMPRESA?.bannerUrl ||
            "https://placehold.co/1920x1080/858585/ffffff?text=Banner"
          }
          alt="Banner da Empresa"
          fill
          className="object-fit"
          priority
        />

        {/* Logo flutuante */}
        <div className="absolute bottom-0 left-10 flex h-24 w-24 translate-y-1/2 transform items-center justify-center rounded-sm bg-white shadow-lg md:h-32 md:w-32">
          <Image
            src={
              EMPRESA?.logoUrl ||
              "https://placehold.co/500x500/858585/ffffff?text=Logo"
            }
            alt="Logo da Empresa"
            fill
            className="rounded-sm object-contain p-1"
            priority
            sizes="(max-width: 768px) 96px, 128px"
          />
        </div>
      </div>

      <div className="mt-2 mb-6 ml-33 flex flex-col px-4 md:mb-8 md:ml-40 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold">
          {EMPRESA?.name || "Nome da Empresa"}
        </h1>
        {/*  DESKTOP */}
        <div className="hidden items-center justify-between md:flex">
          {/* Badge de Aberto/Fechado */}
          <Badge
            variant="secondary"
            className={`flex ${
              isOpen
                ? "border-green-500/20 bg-green-500/10 text-green-600"
                : "border-red-500/20 bg-red-500/10 text-red-600"
            }`}
          >
            <div
              className={`h-1 w-1 rounded-full ${
                isOpen ? "bg-green-500" : "bg-red-500"
              }`}
            />
            <h1>{isOpen ? "Aberto" : "Fechado"}</h1>
          </Badge>

          {/* Botões de Ação */}
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              className="flex cursor-pointer items-center"
            >
              <Info className="h-4 w-4" />
              <span>Perfil da Loja</span>
            </Button>

            <ThemeToggle
              variant="outline"
              styles="text-cor1 dark:text-yellow-500 cursor-pointer"
            />

            <Button size="icon" variant="outline" className="cursor-pointer">
              <Share2 className="h-4 w-4" />
            </Button>
            <div
              className="group relative cursor-pointer"
              onClick={onCartClick}
            >
              <Button
                size="icon"
                variant="outline"
                className="from-cor1 to-cor2 cursor-pointer bg-linear-to-br text-white transition-all duration-200 group-hover:brightness-110"
              >
                <ShoppingCart className="group-hover:text-texto h-4 w-4" />
              </Button>

              <div className="absolute -top-1 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-orange-600">
                <p className="text-[10px] leading-none font-semibold text-white">
                  {itemCount}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/*  MOBILE */}
      <div className="mb-2 flex items-center justify-between px-4 md:hidden">
        <div className="flex items-center gap-1">
          {/* Badge de Aberto/Fechado */}
          <Badge
            variant="secondary"
            className={`flex ${
              isOpen
                ? "border-green-500/20 bg-green-500/10 text-green-600"
                : "border-red-500/20 bg-red-500/10 text-red-600"
            }`}
          >
            <div
              className={`h-1 w-1 rounded-full ${
                isOpen ? "bg-green-500" : "bg-red-500"
              }`}
            />
            <h1>{isOpen ? "Aberto" : "Fechado"}</h1>
          </Badge>
          <Button variant="ghost" className="flex cursor-pointer items-center">
            <Info className="h-4 w-4" />
            <span>Perfil da Loja</span>
          </Button>
        </div>

        {/* Botões de Ação */}
        <div className="flex space-x-2">
          <ThemeToggle
            variant="outline"
            styles="text-cor1 dark:text-yellow-500"
          />

          <Button size="icon" variant="outline" className="cursor-pointer">
            <Share2 className="h-4 w-4" />
          </Button>
          <div className="group relative cursor-pointer" onClick={onCartClick}>
            <Button
              size="icon"
              variant="outline"
              className="from-cor1 to-cor2 cursor-pointer bg-linear-to-br text-white transition-all duration-200 group-hover:brightness-110"
            >
              <ShoppingCart className="group-hover:text-texto h-4 w-4" />
            </Button>

            <div className="absolute -top-1 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-orange-600">
              <p className="text-[10px] leading-none font-semibold text-white">
                {itemCount}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
