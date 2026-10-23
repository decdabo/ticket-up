"use client";

import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon, ClockIcon, MapPinIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Perforation, PhotoPlaceholder } from "@/components/brand/Ticket";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import type { EventCard } from "@/lib/data/events";
import { cn } from "@/lib/utils";

const arrow =
  "hidden md:flex size-12 border-gold-500 bg-ink-soft text-gold-300 hover:bg-ink hover:text-gold-300 disabled:opacity-40 [&_svg]:size-5";

export function HeroCarousel({ events }: { events: EventCard[] }) {
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
    <Carousel
      setApi={setApi}
      opts={{ loop: true }}
      aria-label="Eventos destacados"
      className="max-w-[1000px] mx-auto mt-6 md:mt-11 md:px-16"
    >
      {/* Las flechas se centran sobre el ticket, no sobre ticket + puntos. */}
      <div className="relative">
        <CarouselContent>
          {events.map((ev, i) => (
            <CarouselItem key={ev.slug} aria-label={`${i + 1} de ${events.length}: ${ev.title}`}>
              <TicketSlide ev={ev} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className={cn(arrow, "md:-left-16")} />
        <CarouselNext className={cn(arrow, "md:-right-16")} />
      </div>

      {/* Desktop: puntos */}
      <div className="hidden md:flex justify-center gap-2.5 mt-7">
        {events.map((e, i) => (
          <button
            key={e.slug}
            type="button"
            aria-label={`Ir al evento ${i + 1}`}
            aria-current={i === current}
            onClick={() => api?.scrollTo(i)}
            className="size-7 flex items-center justify-center"
          >
            <span className={cn("block h-1.5 rounded-full transition-all", i === current ? "w-7 bg-gold-500" : "w-2 bg-[#4a443a]")} />
          </button>
        ))}
      </div>
      {/* Móvil: Anterior / Siguiente */}
      <div className="md:hidden flex items-center justify-between mt-3.5 text-ivory">
        <Button variant="ghost" className="px-2 text-ivory hover:bg-ink-soft hover:text-gold-300" onClick={() => api?.scrollPrev()}>
          <ChevronLeftIcon /> Anterior
        </Button>
        <span className="text-[13px] text-on-ink-muted">
          {current + 1} / {events.length}
        </span>
        <Button variant="ghost" className="px-2 text-ivory hover:bg-ink-soft hover:text-gold-300" onClick={() => api?.scrollNext()}>
          Siguiente <ChevronRightIcon />
        </Button>
      </div>
    </Carousel>
  );
}

/** Ticket card: en móvil la foto va arriba, en desktop a la derecha. */
function TicketSlide({ ev }: { ev: EventCard }) {
  const href = `/eventos/${ev.slug}`;
  return (
    <article className="h-full flex flex-col-reverse md:flex-row bg-paper text-ink rounded-[10px] overflow-hidden">
      <div className="flex-1 p-5 md:p-9 flex flex-col gap-2 md:gap-3">
        <span className="text-[11px] md:text-xs tracking-[3px] font-semibold text-gold-ink">{ev.category.toUpperCase()}</span>
        <h2 className="font-display font-semibold text-[26px] md:text-[34px] leading-[1.15]">{ev.title}</h2>
        <p className="text-stone text-sm md:text-[15px]">{ev.subtitle}</p>
        <div className="flex flex-wrap gap-x-5 gap-y-2 mt-1 text-sm md:text-[15px]">
          <span className="flex items-center gap-2">
            <CalendarIcon className="size-[18px] text-gold-700" aria-hidden />
            {ev.date.short}
          </span>
          <span className="flex items-center gap-2">
            <ClockIcon className="size-[18px] text-gold-700" aria-hidden />
            {ev.date.time} h
          </span>
          <span className="hidden md:flex items-center gap-2">
            <MapPinIcon className="size-[18px] text-gold-700" aria-hidden />
            {ev.venue}
          </span>
        </div>
        <div className="flex flex-col-reverse md:flex-row md:items-center gap-3 md:gap-5 mt-3">
          <Button asChild variant="gold" size="lg">
            <Link href={href}>Comprar entradas</Link>
          </Button>
          <Button asChild variant="link" className="text-ink underline self-center md:self-auto">
            <Link href={href}>Ver detalle</Link>
          </Button>
          <span className="hidden md:inline ml-auto text-sm text-stone">
            Desde <strong className="text-ink">{ev.fromLabel}</strong>
          </span>
        </div>
      </div>
      <div className="hidden md:flex">
        <Perforation orientation="vertical" notch="bg-ink" />
      </div>
      <div className="md:hidden">
        <Perforation notch="bg-ink" />
      </div>
      <div className="p-2.5 pb-4 md:p-4 md:w-80">
        <PhotoPlaceholder label={ev.photo} className="h-[230px] md:h-full md:min-h-60 rounded-md" />
      </div>
    </article>
  );
}
