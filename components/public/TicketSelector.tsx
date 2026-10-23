"use client";

import { ClockIcon, MinusIcon, PlusIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export type SelectableTicketType = {
  id: string;
  name: string;
  note: string;
  priceLabel: string;
  priceCents: number;
  available: number;
};

const money = new Intl.NumberFormat("es-AR", { maximumFractionDigits: 0 });
const fmt = (cents: number) => `$ ${money.format(cents / 100)}`;

/**
 * Selector de cantidades. Solo UI: en la Fase 4 "Continuar" llama a la Server
 * Action `createReservation`. Hoy enlaza a una orden mock.
 */
export function TicketSelector({
  types,
  maxPerOrder,
  checkoutHref,
}: {
  types: SelectableTicketType[];
  maxPerOrder: number;
  checkoutHref: string;
}) {
  const [qty, setQty] = useState<Record<string, number>>({});
  const count = Object.values(qty).reduce((s, n) => s + n, 0);
  const total = types.reduce((s, t) => s + (qty[t.id] ?? 0) * t.priceCents, 0);
  const set = (id: string, v: number) => setQty((q) => ({ ...q, [id]: v }));

  const continueButton = (label: string, size: "lg" | "xl", className?: string) =>
    count > 0 ? (
      <Button asChild variant="gold" size={size} className={className}>
        <Link href={checkoutHref}>{label}</Link>
      </Button>
    ) : (
      <Button variant="gold" size={size} className={className} disabled>
        {label}
      </Button>
    );

  return (
    <>
      <Card className="gap-0 py-0 rounded-[10px]">
        <CardHeader className="bg-ink text-ivory py-3.5 md:py-[18px] px-4 md:px-[22px] grid-cols-[1fr_auto] items-center">
          <CardTitle className="font-display text-[22px] font-semibold">Entradas</CardTitle>
          <span className="text-xs md:text-[13px] text-on-ink-muted">Máx. {maxPerOrder} por compra</span>
        </CardHeader>
        <CardContent className="px-0">
          <ul>
            {types.map((t, i) => {
              const q = qty[t.id] ?? 0;
              const soldOut = t.available === 0;
              const low = !soldOut && t.available < 20;
              return (
                <li key={t.id}>
                  {i > 0 && <Separator className="border-t border-dashed border-perf bg-transparent" />}
                  <div className="px-4 md:px-[22px] py-3.5 md:py-[18px] flex items-center gap-3.5">
                    <div className="flex-1 min-w-0 flex flex-col gap-0.5 md:gap-1">
                      <strong className="text-[15px] md:text-base">{t.name}</strong>
                      <span className="hidden md:block text-[13px] text-stone">{t.note}</span>
                      <span className="text-[15px] md:text-lg font-bold">{t.priceLabel}</span>
                      <span className={cn("text-xs font-semibold", soldOut ? "text-stone" : low ? "text-err" : "text-ok")}>
                        {soldOut ? "Sin cupo" : low ? `¡Últimas ${t.available}!` : "Disponible"}
                      </span>
                    </div>
                    {soldOut ? (
                      <Badge variant="outline" className="h-9 px-3 rounded-md border-perf text-stone">
                        Agotado
                      </Badge>
                    ) : (
                      <div className="flex items-center rounded-md border border-perf">
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={`Quitar una entrada ${t.name}`}
                          onClick={() => set(t.id, Math.max(0, q - 1))}
                          disabled={q === 0}
                        >
                          <MinusIcon />
                        </Button>
                        <span aria-live="polite" className="min-w-7 text-center font-bold">
                          {q}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={`Agregar una entrada ${t.name}`}
                          onClick={() => set(t.id, q + 1)}
                          disabled={count >= maxPerOrder || q >= t.available}
                        >
                          <PlusIcon />
                        </Button>
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </CardContent>
        {/* Total (desktop) */}
        <CardFooter className="hidden md:flex flex-col items-stretch gap-3 p-[22px] bg-paper border-dashed border-perf">
          <div className="flex justify-between text-[15px] text-stone">
            <span>{count} entradas</span>
            <span>{fmt(total)}</span>
          </div>
          <div className="flex justify-between items-baseline">
            <strong>Total</strong>
            <strong className="text-[26px]">{fmt(total)}</strong>
          </div>
          {continueButton(count > 0 ? "Continuar con la compra" : "Elegí tus entradas", "xl", "w-full")}
          <p className="text-xs text-stone leading-normal flex gap-2">
            <ClockIcon className="size-4 shrink-0 mt-px" aria-hidden />
            Al continuar reservamos tus entradas durante 15 minutos mientras completás el pago.
          </p>
        </CardFooter>
      </Card>

      {/* Subtotal sticky (móvil) */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-20 bg-ink text-ivory px-4 pt-3 pb-4 flex items-center gap-3.5 shadow-[0_-8px_20px_rgba(0,0,0,.18)]">
        <div className="flex-1 flex flex-col">
          <span className="text-xs text-on-ink-muted">{count} entradas</span>
          <strong className="text-[22px] text-gold-300">{fmt(total)}</strong>
        </div>
        {continueButton("Continuar", "lg")}
      </div>
    </>
  );
}
