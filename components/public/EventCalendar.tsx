"use client";

import { format } from "date-fns";
import Link from "next/link";
import { createContext, useContext, type HTMLAttributes } from "react";
import type { DayProps } from "react-day-picker";
import { es } from "react-day-picker/locale";
import { Calendar } from "@/components/ui/calendar";
import type { EventCard } from "@/lib/data/events";
import { cn } from "@/lib/utils";

const chip: Record<EventCard["category"], string> = {
  Fiesta: "bg-gold-500 text-ink",
  "DJ Set": "bg-ink text-ivory",
  "En vivo": "bg-paper text-ink border border-gold-700",
};

/** Mes que muestra la maqueta (los eventos mock son de noviembre de 2026). */
const MONTH = new Date(2026, 10, 1);
/**
 * "Hoy" fijo (MOCK_TODAY): sin esto DayPicker llama a `new Date()` y, con Cache
 * Components, el prerender falla por usar la hora actual en un Client Component.
 */
const TODAY = new Date(2026, 9, 22);

const EventsByDay = createContext<Map<number, EventCard>>(new Map());

/**
 * Celda del día (reemplaza `Day` de DayPicker). El calendario no selecciona
 * fechas: los días con fiesta son links normales al evento.
 */
function EventDay({ day, modifiers, className, ...cell }: DayProps) {
  const byDay = useContext(EventsByDay);
  const ev = modifiers.outside || modifiers.hidden ? undefined : byDay.get(day.date.getDate());
  const n = modifiers.hidden ? "" : day.date.getDate();

  return (
    <td {...(cell as HTMLAttributes<HTMLTableCellElement>)} className={className}>
      {ev ? (
        <Link
          href={`/eventos/${ev.slug}`}
          aria-label={`${format(day.date, "d 'de' MMMM", { locale: es })}: ${ev.title}`}
          className={cn(
            "flex size-full flex-col items-center md:items-start justify-center md:justify-start gap-1 md:gap-1.5 p-1 md:p-2 text-sm rounded-md md:rounded-none",
            "max-md:bg-ink max-md:text-gold-300 max-md:font-bold",
            "focus-visible:outline-2 focus-visible:outline-ring",
          )}
        >
          {n}
          <span className="md:hidden size-[5px] rounded-full bg-gold-500" aria-hidden />
          <span className={cn("hidden md:block w-full text-left text-xs leading-snug p-1.5 rounded-sm font-normal", chip[ev.category])}>
            {ev.date.time} · {ev.title}
          </span>
        </Link>
      ) : (
        <span className="flex size-full flex-col items-center md:items-start justify-center md:justify-start p-1 md:p-2 text-sm">{n}</span>
      )}
    </td>
  );
}

/**
 * Calendario mensual (react-day-picker vía shadcn). En desktop cada día con
 * fiesta muestra el chip del evento; en móvil, el día resaltado con un punto.
 */
export function EventCalendar({ events }: { events: EventCard[] }) {
  const byDay = new Map(events.map((e) => [Number(e.date.day), e]));
  const eventDates = events.map((e) => new Date(2026, 10, Number(e.date.day)));

  return (
    <EventsByDay.Provider value={byDay}>
    <Calendar
      locale={es}
      today={TODAY}
      weekStartsOn={1}
      defaultMonth={MONTH}
      startMonth={MONTH}
      endMonth={MONTH}
      showOutsideDays={false}
      modifiers={{ event: eventDates }}
      components={{ Day: EventDay }}
      formatters={{ formatWeekdayName: (d) => format(d, "EEE", { locale: es }).replace(".", "") }}
      className="w-full p-0 bg-transparent [--cell-size:--spacing(11)]"
      classNames={{
        root: "w-full",
        months: "relative flex flex-col w-full",
        month: "flex w-full flex-col gap-4",
        nav: "absolute inset-x-0 top-0 flex w-full items-center justify-between",
        button_previous: "size-11 border border-line bg-paper rounded-md flex items-center justify-center aria-disabled:opacity-40",
        button_next: "size-11 border border-line bg-paper rounded-md flex items-center justify-center aria-disabled:opacity-40",
        month_caption: "flex h-11 w-full items-center justify-center",
        caption_label: "font-display text-xl md:text-2xl font-semibold capitalize",
        month_grid: "w-full border-collapse md:border-t md:border-l md:border-line",
        weekdays: "flex",
        weekday:
          "flex-1 text-[11px] md:text-xs tracking-[1px] uppercase text-stone py-1.5 md:p-2.5 md:text-left md:bg-ivory md:border-r md:border-b md:border-line",
        week: "flex w-full mt-1 md:mt-0",
        day: "flex-1 h-11 md:h-[92px] p-0 md:border-r md:border-b md:border-line",
        today: "",
        // Sin `invisible`: las celdas vacías conservan los bordes de la grilla.
        hidden: "",
        outside: "",
      }}
    />
    </EventsByDay.Provider>
  );
}

export function CalendarLegend() {
  return (
    <div className="hidden md:flex flex-col gap-2.5 mt-3 text-sm">
      <span className="flex items-center gap-2.5"><span className="size-3 rounded-sm bg-gold-500" />Fiesta</span>
      <span className="flex items-center gap-2.5"><span className="size-3 rounded-sm bg-ink" />DJ Set</span>
      <span className="flex items-center gap-2.5"><span className="size-3 rounded-sm bg-paper border-2 border-gold-700" />En vivo</span>
    </div>
  );
}
