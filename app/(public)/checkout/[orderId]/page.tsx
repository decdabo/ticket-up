import { ChevronDownIcon } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { BuyerForm } from "@/components/public/BuyerForm";
import { CheckoutHeader, CheckoutSteps, OrderSummary } from "@/components/public/checkout";
import { ReservationTimer } from "@/components/public/ReservationTimer";
import { getOrder, listOrderIds } from "@/lib/data/orders";
import { eventDate, formatARS } from "@/lib/format";

export const metadata: Metadata = { title: "Tus datos" };

export async function generateStaticParams() {
  return (await listOrderIds()).map((orderId) => ({ orderId }));
}

export default async function CheckoutDataPage({ params }: PageProps<"/checkout/[orderId]">) {
  const { orderId } = await params;
  const order = await getOrder(orderId);
  if (!order) notFound();
  const eventHref = `/eventos/${order.event.slug}`;
  const count = order.items.reduce((s, i) => s + i.quantity, 0);
  const date = eventDate(order.event.startsAt);

  return (
    <>
      <CheckoutHeader backHref={eventHref} stepLabel="Paso 1 de 2 · Tus datos" />
      <ReservationTimer
        initialSeconds={14 * 60 + 32}
        message="Tus entradas están reservadas. Completá la compra antes de que termine el tiempo."
        mobileMessage="Entradas reservadas por"
      />

      {/* Resumen plegable (móvil) */}
      <Collapsible className="md:hidden bg-ink text-ivory border-t border-ink-line group/summary">
        <CollapsibleTrigger className="w-full px-4 py-3.5 flex justify-between items-center gap-3 min-h-12 text-left">
          <span className="text-sm flex items-center gap-1.5">
            <ChevronDownIcon className="size-4 transition-transform group-data-[state=open]/summary:rotate-180" aria-hidden />
            {order.event.title} · {count} entradas
          </span>
          <strong className="text-gold-300">{formatARS(order.totalCents)}</strong>
        </CollapsibleTrigger>
        <CollapsibleContent className="px-4 pb-4 text-sm flex flex-col gap-1.5 text-on-ink">
          <span>
            {date.medium} · {date.time} h · {order.event.venue}
          </span>
          {order.items.map((it) => (
            <div key={it.ticketTypeId} className="flex justify-between">
              <span>{it.quantity} × {it.name}</span>
              <span>{formatARS(it.quantity * it.unitPriceCents)}</span>
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>

      <main className="max-w-[1100px] w-full mx-auto px-4 md:px-6 pt-6 md:pt-8 pb-12 md:pb-24">
        <CheckoutSteps current={0} />
        <div className="flex flex-wrap gap-8 items-start">
          <div className="flex-[999_1_520px] min-w-0">
            <BuyerForm backHref={eventHref} nextHref={`/checkout/${order.publicId}/pago`} />
          </div>
          <div className="hidden md:block flex-[1_1_320px] min-w-0">
            <OrderSummary order={order} />
          </div>
        </div>
      </main>
    </>
  );
}
