import Link from "next/link";
import { PhotoPlaceholder } from "@/components/brand/Ticket";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { EventCard } from "@/lib/data/events";

/** Fila de "Próximos eventos": bloque de fecha, info y foto con troquel. En móvil es una Card. */
export function EventListItem({ ev }: { ev: EventCard }) {
  const href = `/eventos/${ev.slug}`;
  return (
    <Card className="flex-col md:flex-row gap-0 md:gap-7 py-0 md:py-6 md:rounded-none md:ring-0 md:bg-transparent md:border-b md:border-line overflow-hidden">
      {/* Bloque de fecha (desktop) */}
      <div className="hidden md:flex flex-col shrink-0 w-[76px] self-start text-center border border-line bg-paper">
        <span className="text-[11px] tracking-[1px] text-stone pt-2">{ev.date.monthUpper}</span>
        <span className="font-display text-[34px] font-bold leading-[1.1]">{ev.date.day}</span>
        <span className="text-[11px] text-stone pb-2">{ev.date.year}</span>
        <span className="bg-ink text-gold-300 text-[13px] font-semibold py-1.5">{ev.date.time}</span>
      </div>

      {/* Foto: arriba en móvil (con la fecha encima), a la derecha en desktop */}
      <div className="md:order-last relative md:w-[260px] shrink-0 md:border-l-2 md:border-dashed md:border-perf">
        <PhotoPlaceholder label={ev.photo} className="h-[150px]" />
        <div className="md:hidden absolute top-3 left-3 bg-paper text-center min-w-[52px]">
          <div className="text-[10px] text-stone pt-1">{ev.date.monthUpper}</div>
          <div className="font-display text-2xl font-bold leading-none">{ev.date.day}</div>
          <div className="bg-ink text-gold-300 text-[11px] font-semibold py-0.5 mt-1">{ev.date.time}</div>
        </div>
        <div aria-hidden className="hidden md:block absolute -right-3.5 top-[60px] size-7 rounded-full bg-ivory" />
      </div>

      <div className="flex-1 min-w-0 flex flex-col gap-1.5 p-4 md:p-0">
        <span className="text-[11px] md:text-xs tracking-[2px] md:tracking-[3px] font-semibold text-gold-ink">
          {ev.category.toUpperCase()}
        </span>
        <h3 className="font-display font-semibold text-xl md:text-2xl leading-tight">{ev.title}</h3>
        <p className="text-stone text-[13px] md:text-sm">
          {ev.subtitle} · {ev.venue}
        </p>
        <div className="flex flex-wrap items-center gap-3 md:gap-5 mt-auto pt-3.5">
          <Button asChild variant="gold" className="flex-1 md:flex-none">
            <Link href={href}>Comprar entradas</Link>
          </Button>
          <Button asChild variant="link" className="text-ink underline px-2">
            <Link href={href}>Ver detalle</Link>
          </Button>
          <span className="hidden md:inline text-sm text-stone">
            Desde <strong className="text-ink">{ev.fromLabel}</strong>
          </span>
        </div>
      </div>
    </Card>
  );
}
