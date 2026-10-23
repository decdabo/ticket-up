"use client";

import {
  CalendarIcon,
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon,
  DownloadIcon,
  TimerIcon,
  WalletIcon,
  XIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { QrCode } from "@/components/brand/QrCode";
import { Perforation } from "@/components/brand/Ticket";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";

export type ResultTicket = { token: string; code: string; typeName: string };

const STATES = [
  { id: "aprobado", label: "Aprobado" },
  { id: "pendiente", label: "Pendiente" },
  { id: "rechazado", label: "Rechazado" },
  { id: "expirado", label: "Expirado" },
] as const;
type State = (typeof STATES)[number]["id"];

/**
 * Página de resultado. Hoy el estado viene de `?estado=` (la redirección
 * simulada); en la Fase 5 se consulta la orden con polling corto.
 */
export function ResultView({
  orderId,
  buyerFirstName,
  buyerEmail,
  eventTitle,
  eventWhen,
  eventVenue,
  eventHref,
  tickets,
}: {
  orderId: string;
  buyerFirstName: string;
  buyerEmail: string;
  eventTitle: string;
  eventWhen: string;
  eventVenue: string;
  eventHref: string;
  tickets: ResultTicket[];
}) {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const raw = params.get("estado");
  const state: State = STATES.some((s) => s.id === raw) ? (raw as State) : "aprobado";
  const payHref = `/checkout/${orderId}/pago`;

  return (
    <>
      {/* Selector de estado: solo para la maqueta */}
      <div className="bg-ink border-b border-ink-line">
        <div className="max-w-[1000px] mx-auto px-4 md:px-6 py-2.5 flex gap-2 items-center overflow-x-auto">
          <span className="text-xs text-on-ink-muted shrink-0">Maqueta · estado:</span>
          <ToggleGroup
            type="single"
            value={state}
            onValueChange={(v) => v && router.replace(`${pathname}?estado=${v}`, { scroll: false })}
            aria-label="Estado a mostrar (maqueta)"
            spacing={1}
          >
            {STATES.map((s) => (
              <ToggleGroupItem
                key={s.id}
                value={s.id}
                className="h-9 rounded-full border border-[#4a443a] px-3 text-[13px] text-on-ink hover:bg-ink-soft hover:text-gold-300 data-[state=on]:border-gold-500 data-[state=on]:bg-gold-500 data-[state=on]:text-ink"
              >
                {s.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
      </div>

      {state === "aprobado" && (
        <Approved
          orderId={orderId}
          buyerFirstName={buyerFirstName}
          buyerEmail={buyerEmail}
          eventTitle={eventTitle}
          eventWhen={eventWhen}
          eventVenue={eventVenue}
          tickets={tickets}
        />
      )}

      {state === "pendiente" && (
        <StatusCard
          icon={<ClockIcon className="size-7" strokeWidth={2} />}
          iconClass="border-2 border-gold-500 text-gold-700"
          title="Estamos confirmando tu pago"
          text="Mercado Pago todavía no nos confirmó el pago. Esto puede tardar unos minutos (por ejemplo, con pagos en efectivo). Apenas se acredite te enviamos las entradas por email; no hace falta que vuelvas a comprar."
        >
          <span className="text-[13px] text-stone flex items-center gap-2">
            <span className="size-2 rounded-full bg-gold-500 animate-pulse" />
            Actualizando automáticamente…
          </span>
          <Button asChild variant="link" className="text-gold-ink underline">
            <Link href="/">Volver al inicio</Link>
          </Button>
        </StatusCard>
      )}

      {state === "rechazado" && (
        <StatusCard
          icon={<XIcon className="size-7" strokeWidth={2.4} />}
          iconClass="bg-err-bg text-err"
          title="El pago no se pudo completar"
          text="Mercado Pago rechazó el pago (fondos insuficientes o datos de tarjeta incorrectos). No se te cobró nada."
        >
          <Alert className="bg-ink-soft text-ivory border-ink-line w-auto px-[18px] py-3 rounded-md text-sm">
            <AlertDescription className="text-ivory">
              Tus entradas siguen reservadas por <strong className="text-gold-300 tabular-nums">08:41</strong>
            </AlertDescription>
          </Alert>
          <Button asChild variant="gold" size="xl" className="w-full md:w-auto">
            <Link href={payHref}>Reintentar el pago</Link>
          </Button>
          <Button asChild variant="link" className="text-gold-ink underline">
            <Link href={eventHref}>Cambiar entradas</Link>
          </Button>
        </StatusCard>
      )}

      {state === "expirado" && (
        <StatusCard
          icon={<TimerIcon className="size-7" strokeWidth={2} />}
          iconClass="border-2 border-stone text-stone"
          title="Tu reserva expiró"
          text="Pasaron los 15 minutos y liberamos las entradas para otras personas. Si todavía hay lugar, podés volver a elegirlas."
        >
          <Button asChild variant="gold" size="xl" className="w-full md:w-auto">
            <Link href={eventHref}>Volver a elegir entradas</Link>
          </Button>
        </StatusCard>
      )}
    </>
  );
}

function Approved({
  orderId,
  buyerFirstName,
  buyerEmail,
  eventTitle,
  eventWhen,
  eventVenue,
  tickets,
}: {
  orderId: string;
  buyerFirstName: string;
  buyerEmail: string;
  eventTitle: string;
  eventWhen: string;
  eventVenue: string;
  tickets: ResultTicket[];
}) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;
    const onSelect = () => setCurrent(api.selectedScrollSnap());
    onSelect();
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  return (
    <>
      {/* Desktop */}
      <div className="hidden md:flex max-w-[1000px] w-full mx-auto px-6 pt-12 pb-24 flex-col gap-8">
        <div className="flex flex-col items-center text-center gap-3">
          <span className="size-16 rounded-full bg-ink flex items-center justify-center text-gold-300">
            <CheckIcon className="size-8" strokeWidth={2.6} aria-hidden />
          </span>
          <h1 className="font-display font-semibold text-[40px]">¡Listo, {buyerFirstName}! Ya tenés tus entradas</h1>
          <p className="text-stone max-w-[560px] leading-relaxed">
            Pago aprobado. También te las enviamos a <strong className="text-ink">{buyerEmail}</strong>. Orden #{orderId}.
          </p>
          <TicketActions />
        </div>
        <div className="flex flex-col gap-5">
          {tickets.map((t, n) => (
            <Card key={t.token} className="flex-row gap-0 py-0 rounded-[10px] overflow-visible">
              <div className="flex-1 px-7 py-6 flex flex-col gap-1.5">
                <span className="text-[11px] tracking-[3px] font-semibold text-gold-ink">
                  ENTRADA {n + 1} DE {tickets.length} · {t.typeName.toUpperCase()}
                </span>
                <strong className="font-display text-2xl font-semibold">{eventTitle}</strong>
                <span className="text-stone text-sm">
                  {eventWhen} · {eventVenue}
                </span>
                <Link href={`/entradas/${t.token}`} className="mt-2.5 font-semibold text-sm text-gold-ink underline">
                  Abrir entrada
                </Link>
              </div>
              <Perforation orientation="vertical" notch="bg-ivory" />
              <div className="px-7 py-5 flex flex-col items-center justify-center gap-1.5">
                <QrCode token={t.token} label={`Código QR de la entrada ${n + 1}`} />
                <span className="text-[11px] text-stone font-mono">{t.code}</span>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Móvil: una entrada a pantalla completa con Anterior / Siguiente */}
      <div className="md:hidden">
        <div className="bg-ink text-ivory px-4 pt-5 pb-7 flex flex-col gap-4">
          <div className="flex gap-3 items-center">
            <span className="shrink-0 size-10 rounded-full bg-gold-500 text-ink flex items-center justify-center">
              <CheckIcon className="size-5" strokeWidth={2.6} aria-hidden />
            </span>
            <div>
              <h1 className="font-display font-semibold text-2xl">¡Pago aprobado!</h1>
              <span className="text-[13px] text-on-ink-muted">También te las enviamos por email.</span>
            </div>
          </div>
          {tickets.length > 0 && (
            <Carousel setApi={setApi} aria-label="Tus entradas">
              <CarouselContent>
                {tickets.map((t, n) => (
                  <CarouselItem key={t.token} aria-label={`Entrada ${n + 1} de ${tickets.length}`}>
                    <Card className="bg-paper text-ink rounded-xl gap-0 py-0 ring-0">
                      <div className="px-5 py-[18px] flex flex-col gap-1">
                        <span className="text-[10px] tracking-[3px] font-semibold text-gold-ink">
                          ENTRADA {n + 1} DE {tickets.length} · {t.typeName.toUpperCase()}
                        </span>
                        <strong className="font-display text-2xl font-semibold leading-tight">{eventTitle}</strong>
                        <span className="text-[13px] text-stone">{eventWhen}</span>
                      </div>
                      <Perforation notch="bg-ink" />
                      <div className="p-5 flex flex-col items-center gap-2">
                        <QrCode token={t.token} size={220} label={`Código QR de la entrada ${n + 1}`} />
                        <span className="text-xs text-stone font-mono">{t.code}</span>
                        <Link href={`/entradas/${t.token}`} className="text-sm font-semibold p-2 text-gold-ink underline">
                          Abrir entrada
                        </Link>
                      </div>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="flex items-center justify-between mt-4">
                <Button
                  variant="ghost"
                  className="px-2 text-ivory hover:bg-ink-soft hover:text-gold-300"
                  onClick={() => api?.scrollPrev()}
                  disabled={current === 0}
                >
                  <ChevronLeftIcon /> Anterior
                </Button>
                <span className="text-[13px] text-on-ink-muted">
                  {current + 1} / {tickets.length}
                </span>
                <Button
                  variant="ghost"
                  className="px-2 text-ivory hover:bg-ink-soft hover:text-gold-300"
                  onClick={() => api?.scrollNext()}
                  disabled={current === tickets.length - 1}
                >
                  Siguiente <ChevronRightIcon />
                </Button>
              </div>
            </Carousel>
          )}
        </div>
        <div className="px-4 py-5 flex flex-col gap-2.5">
          <TicketActions stacked />
          <span className="text-center text-xs text-stone mt-1.5">
            Orden #{orderId} · {buyerEmail}
          </span>
        </div>
      </div>
    </>
  );
}

function TicketActions({ stacked = false }: { stacked?: boolean }) {
  const cls = stacked ? "w-full" : "";
  return (
    <div className={stacked ? "flex flex-col gap-2.5" : "flex flex-wrap gap-3 justify-center mt-2"}>
      <Button asChild variant="gold" size="lg" className={cls}>
        <a href="#descargar">
          <DownloadIcon /> Descargar PDF
        </a>
      </Button>
      <Button asChild variant="outline" size="lg" className={cn("border-ink bg-transparent", cls)}>
        <a href="#billetera">
          <WalletIcon /> Agregar a la billetera
        </a>
      </Button>
      <Button asChild variant="outline" size="lg" className={cn("border-ink bg-transparent", cls)}>
        <a href="#calendario">
          <CalendarIcon /> Agregar al calendario
        </a>
      </Button>
    </div>
  );
}

function StatusCard({
  icon,
  iconClass,
  title,
  text,
  children,
}: {
  icon: React.ReactNode;
  iconClass: string;
  title: string;
  text: string;
  children: React.ReactNode;
}) {
  return (
    <div className="px-4 md:px-6 py-6 md:py-20">
      <Card className="max-w-[620px] mx-auto rounded-[10px] px-5 py-7 md:p-11 text-center gap-3 md:gap-4 items-center">
        <span className={cn("size-14 md:size-16 rounded-full flex items-center justify-center", iconClass)} aria-hidden>
          {icon}
        </span>
        <h1 className="font-display font-semibold text-[26px] md:text-[34px]">{title}</h1>
        <p className="text-stone leading-relaxed text-sm md:text-base">{text}</p>
        {children}
      </Card>
    </div>
  );
}
