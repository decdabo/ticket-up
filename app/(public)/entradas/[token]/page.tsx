import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Logo } from "@/components/brand/Logo";
import { TicketView } from "@/components/public/TicketView";
import { Button } from "@/components/ui/button";
import { getOrderTickets, getTicketByToken, listTicketTokens } from "@/lib/data/tickets";
import { eventDate } from "@/lib/format";

export const metadata: Metadata = { title: "Tu entrada", robots: { index: false } };

export async function generateStaticParams() {
  return (await listTicketTokens()).map((token) => ({ token }));
}

export default async function TicketPage({ params }: PageProps<"/entradas/[token]">) {
  const { token } = await params;
  const ticket = await getTicketByToken(token);
  if (!ticket) notFound();
  const siblings = await getOrderTickets(ticket.orderId);
  const position = siblings.findIndex((t) => t.token === ticket.token) + 1;
  const date = eventDate(ticket.event.startsAt);

  return (
    <div className="flex-1 bg-ink text-ivory px-4 md:px-6 pt-3 md:pt-7 pb-10 md:pb-[72px]">
      <div className="max-w-[1100px] mx-auto">
        <Logo />
      </div>
      <main className="max-w-[440px] mx-auto mt-2 md:mt-6 flex flex-col">
        <TicketView
          t={{
            token: ticket.token,
            code: ticket.code,
            category: ticket.event.category,
            position: `ENTRADA ${position} DE ${siblings.length}`,
            eventTitle: ticket.event.title,
            date: date.medium,
            time: date.time,
            doors: ticket.event.doorsAt,
            venue: ticket.event.venue,
            typeName: ticket.ticketTypeName,
            holder: `${ticket.attendeeName} · DNI ${ticket.attendeeDni}`,
          }}
        />
        <div className="flex flex-col md:flex-row md:justify-center gap-2.5 md:gap-3 mt-5 md:mt-6">
          <Button asChild variant="gold" size="lg">
            <a href="#descargar">Descargar PDF</a>
          </Button>
          <Button asChild variant="outline-light" size="lg">
            <a href="#billetera">Agregar a la billetera</a>
          </Button>
        </div>
        <p className="text-center text-[13px] text-on-ink-muted mt-5">
          ¿Problemas con tu entrada?{" "}
          <Link href="/#contacto" className="text-gold-300 underline">Contactanos</Link>
        </p>
      </main>
    </div>
  );
}
