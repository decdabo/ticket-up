import { CheckIcon, ChevronLeftIcon, LockIcon } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { Perforation } from "@/components/brand/Ticket";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { OrderWithEvent } from "@/lib/data/orders";
import { eventDate, formatARS } from "@/lib/format";
import { cn } from "@/lib/utils";

export function CheckoutHeader({ backHref, stepLabel }: { backHref: string; stepLabel?: string }) {
  return (
    <header className="bg-ink border-b border-ink-line">
      <div className="max-w-[1100px] mx-auto px-2 md:px-6 py-2 md:py-4 flex items-center justify-between gap-4">
        <Button asChild variant="ghost" size="icon" className="md:hidden text-ivory hover:bg-ink-soft hover:text-gold-300">
          <Link href={backHref} aria-label="Volver">
            <ChevronLeftIcon className="size-[22px]" />
          </Link>
        </Button>
        <div className="hidden md:block">
          <Logo />
        </div>
        {stepLabel && <span className="md:hidden text-[15px] font-semibold text-ivory">{stepLabel}</span>}
        <span className="hidden md:flex items-center gap-2 text-[13px] text-on-ink-muted">
          <LockIcon className="size-4 text-gold-500" aria-hidden />
          Compra segura
        </span>
        <span className="md:hidden w-11" />
      </div>
    </header>
  );
}

const STEPS = ["Tus datos", "Pago", "Confirmación"];

export function CheckoutSteps({ current }: { current: 0 | 1 | 2 }) {
  return (
    <ol aria-label="Pasos de la compra" className="hidden md:flex flex-wrap gap-x-8 gap-y-3 mb-8 text-sm">
      {STEPS.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li
            key={label}
            aria-current={active ? "step" : undefined}
            className={cn("flex items-center gap-2.5", active ? "font-bold" : done ? "text-soft" : "text-stone")}
          >
            <span
              className={cn(
                "size-7 rounded-full flex items-center justify-center",
                active ? "bg-ink text-gold-300" : done ? "bg-gold-500 text-ink" : "border border-perf",
              )}
            >
              {done ? <CheckIcon className="size-3.5" strokeWidth={3} aria-hidden /> : i + 1}
            </span>
            {label}
          </li>
        );
      })}
    </ol>
  );
}

/** Resumen de la orden con forma de ticket oscuro. */
export function OrderSummary({ order, compact = false }: { order: OrderWithEvent; compact?: boolean }) {
  const date = eventDate(order.event.startsAt);
  return (
    <aside aria-label="Resumen de la compra">
      <Card
        className="bg-ink text-ivory ring-0 gap-0 rounded-[10px] [--card-spacing:--spacing(6)] data-[compact=true]:[--card-spacing:--spacing(4.5)]"
        data-compact={compact}
      >
        <CardHeader className="gap-1.5 pb-(--card-spacing)">
          <span className="text-[11px] tracking-[3px] text-gold-500 font-semibold">{order.event.category.toUpperCase()}</span>
          <strong className={cn("font-display font-semibold", compact ? "text-xl" : "text-[22px]")}>{order.event.title}</strong>
          <span className="text-sm text-on-ink-muted">
            {date.medium} · {date.time} h
          </span>
          <span className="text-sm text-on-ink-muted">{order.event.venue}</span>
        </CardHeader>
        <Perforation notch="bg-ivory" line="border-[#4a443a]" />
        <CardContent className="pt-(--card-spacing) flex flex-col gap-3 text-[15px]">
          {order.items.map((it) => (
            <div key={it.ticketTypeId} className="flex justify-between">
              <span>
                {it.quantity} × {it.name}
              </span>
              <span>{formatARS(it.quantity * it.unitPriceCents)}</span>
            </div>
          ))}
          <div className="flex justify-between items-baseline border-t border-ink-line pt-3.5 mt-1">
            <strong>Total</strong>
            <strong className="text-[26px] text-gold-300">{formatARS(order.totalCents)}</strong>
          </div>
          <span className="text-xs text-[#8f8676]">Orden #{order.publicId}</span>
        </CardContent>
      </Card>
    </aside>
  );
}
