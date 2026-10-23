"use client";

import { CheckIcon } from "lucide-react";
import { useState } from "react";
import { QrCode } from "@/components/brand/QrCode";
import { Perforation } from "@/components/brand/Ticket";
import { StatusBadge } from "@/components/brand/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

export type TicketViewData = {
  token: string;
  code: string;
  category: string;
  position: string;
  eventTitle: string;
  date: string;
  time: string;
  doors: string;
  venue: string;
  typeName: string;
  holder: string;
};

/**
 * Entrada con QR. El switch "ver como staff" existe solo en la maqueta; en la
 * Fase 6 el botón aparece si hay sesión de staff y marca la entrada con una
 * Server Action.
 */
export function TicketView({ t }: { t: TicketViewData }) {
  const [staff, setStaff] = useState(false);
  const [used, setUsed] = useState(false);

  const field = (label: string, value: string, wide = false) => (
    <div className={wide ? "col-span-2" : ""}>
      <div className="text-[10px] md:text-[11px] tracking-[1px] text-stone">{label}</div>
      <strong>{value}</strong>
    </div>
  );

  return (
    <>
      <div className="flex items-center gap-2.5 min-h-11">
        <Switch
          id="staff"
          checked={staff}
          onCheckedChange={setStaff}
          className="data-checked:bg-gold-500 data-unchecked:bg-[#4a443a]"
        />
        <Label htmlFor="staff" className="text-xs md:text-[13px] font-normal text-on-ink-muted">
          <span className="md:hidden">Staff</span>
          <span className="hidden md:inline">Maqueta: ver como staff logueado</span>
        </Label>
      </div>

      <Card className="bg-paper text-ink rounded-[14px] gap-0 py-0 ring-0 shadow-[0_30px_60px_rgba(0,0,0,.5)]">
        <CardHeader className="bg-ink-soft text-ivory px-5 md:px-7 py-5 md:py-[26px] gap-1.5">
          <span className="text-[10px] md:text-[11px] tracking-[3px] text-gold-500 font-semibold">
            {t.category.toUpperCase()} · {t.position}
          </span>
          <CardTitle className="font-display font-semibold text-[26px] md:text-3xl leading-tight">
            <h1>{t.eventTitle}</h1>
          </CardTitle>
        </CardHeader>
        <CardContent className="px-5 md:px-7 py-4 md:py-[22px] grid grid-cols-2 gap-x-5 gap-y-3 md:gap-y-4 text-[13px] md:text-sm">
          {field("FECHA", t.date)}
          {field("HORA", `${t.time} h (puertas ${t.doors})`)}
          {field("LUGAR", t.venue)}
          {field("TIPO", t.typeName)}
          {field("TITULAR", t.holder, true)}
        </CardContent>
        <Perforation notch="bg-ink" />
        <CardContent className="px-5 md:px-7 pt-5 md:pt-[26px] pb-6 md:pb-[30px] flex flex-col items-center gap-3.5">
          {used ? (
            <StatusBadge label="Usada · 20:47 h" tone="neutral" large />
          ) : (
            <StatusBadge label="Válida" tone="ok" large />
          )}
          <QrCode token={t.token} size={240} label="Código QR de la entrada" className={cn(used && "opacity-25")} />
          <span className="font-mono text-[13px] text-stone">{t.code}</span>
          <p className="text-[13px] text-stone text-center leading-normal">
            Mostrá este código en la entrada. Subí el brillo de la pantalla para escanear más rápido.
          </p>
          {staff && !used && (
            <Button size="xl" className="w-full mt-1.5" onClick={() => setUsed(true)}>
              <CheckIcon /> Marcar como usada
            </Button>
          )}
        </CardContent>
      </Card>
    </>
  );
}
