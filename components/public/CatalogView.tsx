"use client";

import { LayoutGridIcon, ListIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { PhotoPlaceholder } from "@/components/brand/Ticket";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import type { EventCard } from "@/lib/data/events";

const CATEGORIES = ["Todos", "Fiesta", "DJ Set", "En vivo"] as const;
type Category = (typeof CATEGORIES)[number];

export function CatalogView({ events }: { events: EventCard[] }) {
  const [cat, setCat] = useState<Category>("Todos");
  const [view, setView] = useState<"grid" | "list">("grid");
  const shown = cat === "Todos" ? events : events.filter((e) => e.category === cat);

  return (
    <>
      {/* Filtros */}
      <section className="bg-paper border-b border-line sticky top-0 z-10 md:static">
        <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-3 md:py-5 flex flex-wrap gap-3 md:gap-5 items-center justify-between">
          <ToggleGroup
            type="single"
            value={cat}
            onValueChange={(v) => v && setCat(v as Category)}
            aria-label="Categoría"
            variant="chip"
            size="lg"
            className="overflow-x-auto max-w-full p-1 -m-1 md:flex-wrap md:overflow-visible"
          >
            {CATEGORIES.map((c) => (
              <ToggleGroupItem key={c} value={c}>
                {c}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
          <div className="flex flex-wrap gap-3 items-end w-full md:w-auto">
            <div className="flex flex-col gap-1 flex-1 md:flex-none">
              <Label htmlFor="fecha" className="text-xs text-stone font-normal">Fecha</Label>
              <Select defaultValue="any">
                <SelectTrigger id="fecha" className="w-full md:w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Cualquier fecha</SelectItem>
                  <SelectItem value="weekend">Este fin de semana</SelectItem>
                  <SelectItem value="7d">Próximos 7 días</SelectItem>
                  <SelectItem value="2026-11">Noviembre 2026</SelectItem>
                  <SelectItem value="2026-12">Diciembre 2026</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="hidden md:flex flex-col gap-1">
              <Label htmlFor="desde" className="text-xs text-stone font-normal">Desde</Label>
              <Input id="desde" type="date" defaultValue="2026-11-01" />
            </div>
            <ToggleGroup
              type="single"
              value={view}
              onValueChange={(v) => v && setView(v as "grid" | "list")}
              aria-label="Vista"
              variant="outline"
              spacing={0}
              className="hidden md:flex"
            >
              <ToggleGroupItem value="grid" aria-label="Vista grilla" className="size-11 data-[state=on]:bg-ink data-[state=on]:text-gold-300">
                <LayoutGridIcon />
              </ToggleGroupItem>
              <ToggleGroupItem value="list" aria-label="Vista listado" className="size-11 data-[state=on]:bg-ink data-[state=on]:text-gold-300">
                <ListIcon />
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>
      </section>

      <main className="max-w-[1200px] mx-auto w-full px-4 md:px-6 pt-5 md:pt-10 pb-12 md:pb-24">
        <p className="text-sm text-stone mb-4" aria-live="polite">
          {shown.length} {shown.length === 1 ? "evento disponible" : "eventos disponibles"}
        </p>
        {view === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-3.5 md:gap-7">
            {shown.map((ev) => (
              <GridCard key={ev.slug} ev={ev} />
            ))}
          </div>
        ) : (
          <Card className="py-0 gap-0">
            {shown.map((ev) => (
              <article key={ev.slug} className="flex flex-wrap gap-5 items-center px-[22px] py-[18px] border-b border-line last:border-b-0">
                <div className="w-16 text-center border border-line">
                  <div className="text-[11px] text-stone pt-1.5">{ev.date.monthUpper}</div>
                  <div className="font-display text-[28px] font-bold leading-[1.1] pb-1.5">{ev.date.day}</div>
                </div>
                <div className="flex-[1_1_260px] min-w-0">
                  <span className="text-[11px] tracking-[2px] font-semibold text-gold-ink">{ev.category.toUpperCase()}</span>
                  <h2 className="my-1 font-display font-semibold text-xl">{ev.title}</h2>
                  <span className="text-sm text-stone">
                    {ev.date.weekday} · {ev.date.time} h · {ev.venue}
                  </span>
                </div>
                <span className="text-sm text-stone">
                  Desde <strong className="text-ink">{ev.fromLabel}</strong>
                </span>
                <Button asChild variant="gold">
                  <Link href={`/eventos/${ev.slug}`}>Comprar</Link>
                </Button>
              </article>
            ))}
          </Card>
        )}
      </main>
    </>
  );
}

function GridCard({ ev }: { ev: EventCard }) {
  return (
    <Card className="flex-row md:flex-col gap-0 py-0 rounded-[10px]">
      <PhotoPlaceholder label={ev.photo} className="w-28 md:w-auto shrink-0 md:h-[200px] [&>span]:hidden md:[&>span]:inline">
        <span className="absolute top-3.5 left-3.5 bg-ink text-gold-300 text-[11px] tracking-[2px] font-semibold px-2.5 py-1.5 rounded-sm hidden md:inline">
          {ev.category.toUpperCase()}
        </span>
      </PhotoPlaceholder>
      <div aria-hidden className="hidden md:block relative h-0 border-t-2 border-dashed border-perf mx-4">
        <div className="absolute -left-[30px] -top-3.5 size-[26px] rounded-full bg-ivory" />
        <div className="absolute -right-[30px] -top-3.5 size-[26px] rounded-full bg-ivory" />
      </div>
      <div className="flex-1 min-w-0 p-3 md:px-[22px] md:pt-5 md:pb-[22px] flex flex-col gap-1 md:gap-2 border-l-2 border-dashed border-perf md:border-l-0">
        <span className="md:hidden text-[10px] tracking-[2px] font-semibold text-gold-ink">{ev.category.toUpperCase()}</span>
        <span className="text-[13px] text-gold-ink font-semibold">
          {ev.date.short} · {ev.date.time} h
        </span>
        <h2 className="font-display font-semibold text-[17px] md:text-[22px] leading-tight">{ev.title}</h2>
        <p className="text-xs md:text-sm text-stone">{ev.venue}</p>
        <div className="flex items-center justify-between gap-3 mt-auto pt-2 md:pt-3.5">
          <span className="text-[13px] md:text-sm text-stone">
            Desde <strong className="text-ink">{ev.fromLabel}</strong>
          </span>
          <Button asChild variant="gold" size="sm" className="h-11">
            <Link href={`/eventos/${ev.slug}`}>Comprar</Link>
          </Button>
        </div>
      </div>
    </Card>
  );
}
