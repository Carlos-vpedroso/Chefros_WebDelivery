import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
// **Importação necessária do ScrollArea do Shadcn**
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Category } from "@/types/product&category";

const Categories: React.FC<{
  categories: Category[];
  selected: string;
  onSelect: (cat: string) => void;
}> = ({ categories, selected, onSelect }) => {
  // Helper para formatar o nome da categoria
  const formatCategoryName = (category: string) =>
    category.charAt(0).toUpperCase() + category.slice(1);

  // Função para fazer scroll suave até a categoria
  const scrollToCategory = (name: string) => {
    const categoryId = `category-${name.toLowerCase().replace(/\s+/g, "-")}`;
    const element = document.getElementById(categoryId);

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const visibleCategories = categories.filter((category) => {
    if (category.type === "PRODUCT") {
      return (category._count?.products ?? 0) > 0;
    }

    if (category.type === "SERVICE") {
      return (category._count?.services ?? 0) > 0;
    }

    return false;
  });

  const handleCategoryClick = (name: string) => {
    onSelect(name);

    // Pequeno delay para garantir que o estado foi atualizado
    setTimeout(() => {
      scrollToCategory(name);
    }, 100);
  };

  return (
    // Contêiner principal, fixo no topo ao rolar (sticky), com fundo branco e sombra
    <div className="bg-card sticky top-0 z-20 border-b shadow-sm">
      {/* 2. ScrollArea: Substitui a div com overflow-x-scroll */}
      {/* className="w-full" garante que ele ocupe toda a largura */}
      <ScrollArea className="w-full whitespace-nowrap">
        {/* O conteúdo rolável deve ser um flex container */}
        <div className="flex space-x-2 px-4 pb-2">
          {visibleCategories.map((category) => (
            <Button
              key={category.id}
              variant="ghost"
              // Usamos flex-shrink-0 para garantir que o botão não seja espremido
              className={cn(
                "h-auto shrink-0 rounded-none px-3 py-2 text-sm font-semibold",

                // ESTILO CONDICIONAL DE DESTAQUE
                selected === category.name.toLowerCase()
                  ? "border-b-2 border-orange-700 text-orange-700 hover:bg-transparent"
                  : "text-gray-500 hover:bg-gray-100 hover:text-gray-900",
              )}
              onClick={() => handleCategoryClick(category.name)}
            >
              {formatCategoryName(category.name)}
            </Button>
          ))}
        </div>

        {/* 3. ScrollBar: Adiciona a barra de rolagem horizontal customizada do Shadcn */}
        <ScrollBar orientation="horizontal" className="h-2" />
      </ScrollArea>
    </div>
  );
};

export default Categories;
