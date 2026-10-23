import { CalendarIcon, ClockIcon, MapPinIcon } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Crumbs } from "@/components/brand/Crumbs";
import { EventGallery } from "@/components/public/EventGallery";
import { TicketSelector } from "@/components/public/TicketSelector";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { available, getEventBySlug, getPublishedEvents } from "@/lib/data/events";
import { eventDate, formatARS } from "@/lib/format";

/** Orden mock a la que lleva "Continuar" mientras no exista la reserva real. */
const MOCK_ORDER_ID = "DV-7K3Q9";

export async function generateStaticParams() {
  const events = await getPublishedEvents();
  return events.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: PageProps<"/eventos/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  return { title: event?.title ?? "Evento" };
}

export default async function EventPage({ params }: PageProps<"/eventos/[slug]">) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) notFound();

  const date = eventDate(event.startsAt);
  const maxPerOrder = Math.max(...event.ticketTypes.map((t) => t.maxPerOrder));
  const photos = [event.photo, "Pista llena", "Line-up", "Flyer oficial"];

  return (
    <div className="pb-24 md:pb-0">
      <section className="bg-ink text-ivory px-4 md:px-6 pt-5 md:pt-9 pb-6 md:pb-12">
        <div className="max-w-[1200px] mx-auto flex flex-col gap-2 md:gap-3">
          <Crumbs
            tone="dark"
            className="hidden md:block"
            items={[
              { href: "/", label: "Inicio" },
              { href: "/eventos", label: "Eventos" },
            ]}
            current={event.title}
          />
          <span className="text-[11px] md:text-xs tracking-[3px] font-semibold text-gold-500">
            {event.category.toUpperCase()}
          </span>
          <h1 className="font-display font-semibold text-[30px] md:text-[52px] leading-[1.1]">{event.title}</h1>
          <div className="flex flex-col md:flex-row md:flex-wrap gap-1 md:gap-7 text-sm md:text-[15px] text-on-ink mt-1.5">
            <span className="flex items-center gap-2"><CalendarIcon className="size-[18px] text-gold-500 hidden md:block" aria-hidden />{date.long}</span>
            <span className="flex items-center gap-2"><ClockIcon className="size-[18px] text-gold-500 hidden md:block" aria-hidden />{date.time} h · Puertas {event.doorsAt} h</span>
            <span className="flex items-center gap-2 text-on-ink-muted md:text-on-ink"><MapPinIcon className="size-[18px] text-gold-500 hidden md:block" aria-hidden />{event.venue}</span>
          </div>
        </div>
      </section>

      <div className="max-w-[1200px] mx-auto md:px-6 md:pt-10 md:pb-24 grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_380px] gap-x-10 gap-y-8 md:gap-y-12">
        <div className="md:col-start-1">
          <EventGallery photos={photos} />
        </div>

        <aside aria-label="Entradas" className="px-4 md:px-0 md:col-start-2 md:row-start-1 md:row-span-3 md:self-start md:sticky md:top-6">
          <TicketSelector
            maxPerOrder={maxPerOrder}
            checkoutHref={`/checkout/${MOCK_ORDER_ID}`}
            types={event.ticketTypes.map((t) => ({
              id: t.id,
              name: t.name,
              note: t.note,
              priceCents: t.priceCents,
              priceLabel: formatARS(t.priceCents),
              available: available(t),
            }))}
          />
        </aside>

        <section className="md:col-start-1 px-4 md:px-0 flex flex-col gap-3.5">
          <h2 className="font-display font-semibold text-[22px] md:text-3xl">Sobre la noche</h2>
          {event.description.map((p) => (
            <p key={p} className="leading-[1.75] text-soft text-[15px] md:text-base">{p}</p>
          ))}
          <div className="flex flex-wrap gap-2.5 mt-1.5">
            {event.facts.map((f) => (
              <Badge key={f} variant="outline" className="h-8 px-3 rounded-md border-perf text-xs md:text-[13px] font-normal">
                {f}
              </Badge>
            ))}
          </div>
        </section>

        <section className="md:col-start-1 px-4 md:px-0 pb-8 md:pb-0 flex flex-col gap-3.5">
          <h2 className="font-display font-semibold text-[22px] md:text-3xl">Lugar</h2>
          <Card className="flex-row flex-wrap gap-6 max-md:bg-transparent max-md:ring-0 max-md:py-0 md:p-5 rounded-[10px]">
            <div className="flex-[1_1_220px] flex flex-col gap-2">
              <strong className="text-base md:text-lg">{event.venue}</strong>
              <span className="text-stone">{event.address}</span>
              <span className="text-stone text-sm">Accesible para sillas de ruedas. Estacionamiento a 100 m.</span>
              <a href="#mapa" className="mt-2 font-semibold text-gold-ink underline">Cómo llegar</a>
            </div>
            <div
              id="mapa"
              role="img"
              aria-label="Mapa de ubicación (placeholder)"
              className="bg-map flex-[2_1_320px] h-40 md:h-[220px] rounded-md relative flex items-center justify-center"
            >
              <MapPinIcon className="size-10 text-ink fill-gold-500" aria-hidden />
              <span className="absolute bottom-2.5 right-3 text-[11px] text-stone">[Mapa embebido]</span>
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
}
