import { Combo } from "@/types/product&category";
import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Separator } from "@/components/ui/separator";
import ComboCard from "./ComboCard";

const CombosGrid: React.FC<{
  combos: Combo[];
  isOpen: boolean;
}> = ({ combos, isOpen }) => {
  return (
    <section className="space-y-6 px-4 pt-10">
      <h1 className="text-texto border-l-4 border-green-600 pl-3 text-xl font-bold">
        Combos
      </h1>
      <Separator />

      <Carousel
        opts={{ align: "start", loop: true }}
        className="mx-auto w-full max-w-6xl select-none"
      >
        <CarouselContent>
          {combos.map((combo) => (
            <CarouselItem
              key={combo.id}
              className="basis-[85%] sm:basis-1/2 md:basis-[30%]"
            >
              <ComboCard combo={combo} isOpen={isOpen} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
};

export default CombosGrid;
