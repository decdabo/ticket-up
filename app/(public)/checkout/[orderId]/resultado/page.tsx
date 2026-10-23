import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ResultView } from "@/components/public/ResultView";
import { Logo } from "@/components/brand/Logo";
import { getOrder, listOrderIds } from "@/lib/data/orders";
import { getOrderTickets } from "@/lib/data/tickets";
import { eventDate } from "@/lib/format";

export const metadata: Metadata = { title: "Resultado de la compra" };

export async function generateStaticParams() {
  return (await listOrderIds()).map((orderId) => ({ orderId }));
}

export default async function CheckoutResultPage({ params }: PageProps<"/checkout/[orderId]/resultado">) {
  const { orderId } = await params;
  const order = await getOrder(orderId);
  if (!order) notFound();
  const tickets = await getOrderTickets(order.publicId);
  const date = eventDate(order.event.startsAt);

  return (
    <>
      <header className="bg-ink">
        <div className="max-w-[1000px] mx-auto px-4 md:px-6 pt-3 md:pt-4">
          <Logo />
        </div>
      </header>
      {/* useSearchParams necesita un límite de Suspense con Cache Components */}
      <Suspense>
        <ResultView
          orderId={order.publicId}
          buyerFirstName={order.buyerName.split(" ")[0]}
          buyerEmail={order.buyerEmail}
          eventTitle={order.event.title}
          eventWhen={`${date.short} · ${date.time} h`}
          eventVenue={order.event.venue}
          eventHref={`/eventos/${order.event.slug}`}
          tickets={tickets.map((t) => ({ token: t.token, code: t.code, typeName: t.ticketTypeName }))}
        />
      </Suspense>
    </>
  );
}
