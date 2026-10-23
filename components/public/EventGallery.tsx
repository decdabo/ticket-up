"use client";

import { useEffect, useState } from "react";
import { PhotoPlaceholder } from "@/components/brand/Ticket";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

/** Galería del evento: Carousel (embla) con miniaturas en desktop y puntos en móvil. */
export function EventGallery({ photos }: { photos: string[] }) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;
    const onSelect = () => setCurrent(api.selectedScrollSnap());
    onSelect();
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  return (
    <section aria-label="Galería" className="flex flex-col gap-3">
      <div className="relative">
        <Carousel setApi={setApi} opts={{ loop: true }} className="md:rounded-[10px] overflow-hidden">
          <CarouselContent className="ml-0">
            {photos.map((p, n) => (
              <CarouselItem key={p} className="pl-0" aria-label={`Foto ${n + 1} de ${photos.length}`}>
                <PhotoPlaceholder className="h-[260px] md:h-[440px]">
                  <span className="text-[11px] md:text-[13px] text-gold-300 bg-ink/70 px-2 py-1 rounded-sm">
                    [Foto {n + 1} de {photos.length}] {p}
                  </span>
                </PhotoPlaceholder>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        {/* Móvil: puntos sobre la foto */}
        <div className="md:hidden absolute bottom-2 right-2 flex gap-0.5">
          {photos.map((p, n) => (
            <button
              key={p}
              type="button"
              aria-label={`Foto ${n + 1}`}
              aria-current={n === current}
              onClick={() => api?.scrollTo(n)}
              className="size-6 flex items-center justify-center"
            >
              <span className={cn("size-2 rounded-full", n === current ? "bg-gold-300" : "bg-ivory/45")} />
            </button>
          ))}
        </div>
      </div>
      {/* Desktop: miniaturas */}
      <div className="hidden md:grid grid-cols-4 gap-3">
        {photos.map((p, n) => (
          <button
            key={p}
            type="button"
            aria-label={`Ver foto ${n + 1}: ${p}`}
            aria-current={n === current}
            onClick={() => api?.scrollTo(n)}
            className={cn("bg-photo h-[90px] rounded-md border-[3px]", n === current ? "border-gold-500" : "border-transparent")}
          />
        ))}
      </div>
    </section>
  );
}
