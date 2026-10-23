import { CreditCardIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckoutHeader, CheckoutSteps, OrderSummary } from "@/components/public/checkout";
import { PayButton } from "@/components/public/PayButton";
import { ReservationTimer } from "@/components/public/ReservationTimer";
import { Card } from "@/components/ui/card";
import { getOrder, listOrderIds } from "@/lib/data/orders";
import { formatARS } from "@/lib/format";

export const metadata: Metadata = { title: "Pago" };

export async function generateStaticParams() {
  return (await listOrderIds()).map((orderId) => ({ orderId }));
}

export default async function CheckoutPaymentPage({ params }: PageProps<"/checkout/[orderId]/pago">) {
  const { orderId } = await params;
  const order = await getOrder(orderId);
  if (!order) notFound();
  const dataHref = `/checkout/${order.publicId}`;

  return (
    <>
      <CheckoutHeader backHref={dataHref} stepLabel="Paso 2 de 2 · Pago" />
      <ReservationTimer initialSeconds={11 * 60 + 8} message="Tu reserva sigue activa." mobileMessage="Reserva activa" />

      <main className="max-w-[1100px] w-full mx-auto px-4 md:px-6 pt-6 md:pt-8 pb-12 md:pb-24">
        <CheckoutSteps current={1} />
        <div className="flex flex-wrap gap-8 items-start">
          <Card className="flex-[999_1_520px] min-w-0 max-md:bg-transparent max-md:ring-0 max-md:py-0 rounded-[10px] md:p-8 gap-5 md:gap-6">
            <h1 className="font-display font-semibold text-[28px] md:text-[32px]">Revisá y pagá</h1>

            <div className="md:hidden">
              <OrderSummary order={order} compact />
            </div>

            <div className="flex flex-col gap-1 md:gap-2.5 p-4 md:p-5 bg-paper border border-line rounded-md text-sm md:text-base">
              <div className="flex justify-between items-center">
                <strong>Comprador</strong>
                <Link href={dataHref} className="text-sm text-gold-ink underline px-1">Editar</Link>
              </div>
              <span className="text-soft">
                {order.buyerName} · DNI {order.buyerDni}
              </span>
              <span className="text-soft">
                {order.buyerEmail}
                <span className="hidden md:inline"> · {order.buyerPhone}</span>
              </span>
            </div>

            <div className="hidden md:flex flex-col gap-3">
              <strong>Medio de pago</strong>
              <div className="flex gap-4 items-center px-5 py-[18px] border-2 border-ink rounded-md">
                <CreditCardIcon className="size-7" strokeWidth={1.6} aria-hidden />
                <div className="flex flex-col gap-0.5">
                  <strong>Mercado Pago</strong>
                  <span className="text-sm text-stone">Tarjeta de crédito o débito, dinero en cuenta o cuotas.</span>
                </div>
              </div>
            </div>

            <PayButton totalLabel={formatARS(order.totalCents)} resultHref={`/checkout/${order.publicId}/resultado`} />
            <p className="text-[13px] text-stone leading-relaxed text-center md:text-left">
              Te vamos a redirigir al sitio de Mercado Pago para completar el pago. Al terminar volvés automáticamente
              a Divercity y recibís tus entradas por email.
            </p>
            <Link href={dataHref} className="hidden md:inline text-sm underline">
              ← Volver a tus datos
            </Link>
          </Card>

          <div className="hidden md:block flex-[1_1_320px] min-w-0">
            <OrderSummary order={order} />
          </div>
        </div>
      </main>
    </>
  );
}
