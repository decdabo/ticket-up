import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { OrderConfirmation } from "@/components/email/OrderConfirmation";
import { getOrder } from "@/lib/data/orders";
import { getOrderTickets } from "@/lib/data/tickets";

export const metadata: Metadata = { title: "Vista previa · Email de confirmación", robots: { index: false } };

export default async function EmailPreviewPage() {
  const order = await getOrder("DV-7K3Q9");
  if (!order) notFound();
  const tickets = await getOrderTickets(order.publicId);

  return (
    <main className="flex-1 bg-[#ece6d8]">
      <div className="max-w-[600px] mx-auto px-3 pt-6 text-[13px] text-soft flex flex-col gap-1">
        <span>
          <strong>De:</strong> Divercity &lt;entradas@[dominio]&gt;
        </span>
        <span>
          <strong>Asunto:</strong> Tus entradas para {order.event.title} · Orden #{order.publicId}
        </span>
      </div>
      <OrderConfirmation order={order} tickets={tickets} baseUrl="" />
    </main>
  );
}
