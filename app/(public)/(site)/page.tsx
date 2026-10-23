import { CreditCardIcon, MessageSquareIcon, QrCodeIcon } from "lucide-react";
import Link from "next/link";
import { CalendarLegend, EventCalendar } from "@/components/public/EventCalendar";
import { EventListItem } from "@/components/public/EventListItem";
import { HeroCarousel } from "@/components/public/HeroCarousel";
import { InstagramFeed } from "@/components/public/InstagramFeed";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getNextEvent, getPublishedEvents, toEventCard } from "@/lib/data/events";
import { getInstagramPosts, instagramHandle } from "@/lib/data/instagram";

export default async function HomePage() {
  const [events, nextEvent, posts] = await Promise.all([getPublishedEvents(), getNextEvent(), getInstagramPosts()]);
  const cards = events.map(toEventCard);
  const next = nextEvent && toEventCard(nextEvent);
  const first = cards[0];
  const last = cards[cards.length - 1];

  return (
    <main>
      {/* Hero */}
      <section className="bg-ink text-ivory px-4 md:px-6 pt-7 md:pt-16 pb-7 md:pb-[72px]">
        <div className="max-w-[1200px] mx-auto flex flex-col items-center gap-2 md:gap-3.5 text-center">
          <p className="text-xs md:text-sm tracking-[3px] text-gold-500">• TEMPORADA DE VERANO • NOCHES DE NOVIEMBRE •</p>
          <h1 className="font-display font-semibold text-[32px] md:text-[56px] leading-[1.1]">
            {first.date.day} — {last.date.day} de noviembre
          </h1>
        </div>
        <HeroCarousel events={cards} />
      </section>

      {/* Calendario */}
      <section id="calendario" className="bg-paper border-b border-line px-4 md:px-6 py-11 md:py-[88px]">
        <div className="max-w-[1200px] mx-auto flex flex-wrap gap-6 md:gap-12">
          <div className="flex-[1_1_280px] flex flex-col gap-3.5">
            <h2 className="font-display font-semibold text-[30px] md:text-[40px]">Calendario</h2>
            <p className="text-stone leading-relaxed hidden md:block">
              Todas las noches del mes. Tocá una fecha para ver la fiesta.
            </p>
            <CalendarLegend />
          </div>
          <div className="flex-[999_1_640px] min-w-0">
            <EventCalendar events={cards} />
          </div>
        </div>
      </section>

      <InstagramFeed posts={posts} handle={instagramHandle} />

      {/* Próxima fecha */}
      <section id="eventos" className="px-4 md:px-6 py-11 md:py-[88px]">
        <div className="max-w-[1000px] mx-auto">
          <div className="text-center flex flex-col gap-3 items-center">
            <h2 className="font-display font-semibold text-[30px] md:text-[40px]">Próxima fecha</h2>
            <p className="text-stone max-w-[520px] leading-relaxed text-sm md:text-base">
              Anticipadas con cupo limitado. Asegurá tu lugar antes de que se agoten.
            </p>
          </div>
          <div className="mt-6 md:mt-12">
            {next ? (
              <EventListItem ev={next} />
            ) : (
              <p className="text-center text-stone">Pronto anunciamos la próxima fecha. Seguinos en Instagram para enterarte primero.</p>
            )}
          </div>
          <div className="flex justify-center mt-6 md:mt-10">
            <Button asChild variant="outline" size="lg" className="w-full md:w-auto border-ink bg-transparent">
              <Link href="/eventos">Ver todas las fechas</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Institucional */}
      <section id="nosotros" className="bg-ink text-ivory border-t border-ink-line px-4 md:px-6 py-11 md:py-[88px]">
        <div className="max-w-[1200px] mx-auto flex flex-wrap gap-8 md:gap-14 items-center">
          <div className="flex-[1_1_420px] flex flex-col gap-4">
            <span className="text-xs tracking-[3px] text-gold-500 font-semibold">SOBRE DIVERCITY</span>
            <h2 className="font-display font-semibold text-[26px] md:text-[40px] leading-tight">
              [Texto institucional: quiénes somos, el club, la música y la noche que proponemos]
            </h2>
            <p className="text-on-ink-muted leading-[1.7]">
              [Uno o dos párrafos del cliente sobre el boliche: su historia, las pistas, los DJs residentes y el público.]
            </p>
          </div>
          <div className="flex-[1_1_420px] flex flex-col gap-3 md:gap-4">
            {[
              { Icon: CreditCardIcon, title: "Pago seguro con Mercado Pago", text: "Tarjeta, débito o dinero en cuenta." },
              { Icon: QrCodeIcon, title: "Entradas digitales con QR", text: "Llegan a tu email al instante. Mostralas en la puerta desde el celular." },
              { Icon: MessageSquareIcon, title: "Mesas VIP y cumpleaños", text: "Reservas por WhatsApp al +54 9 345 000-0000." },
            ].map(({ Icon, title, text }) => (
              <Card key={title} className="flex-row gap-4 p-4 md:p-[22px] bg-ink-soft text-ivory ring-ink-line rounded-md">
                <Icon className="size-7 text-gold-500 shrink-0" strokeWidth={1.6} aria-hidden />
                <div>
                  <strong className="block mb-1">{title}</strong>
                  <span className="text-on-ink-muted text-sm">{text}</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
