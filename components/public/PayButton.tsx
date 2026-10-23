"use client";

import { ArrowUpRightIcon, RefreshCwIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

/**
 * "Pagar con Mercado Pago". En la maqueta abre un Dialog que simula la
 * redirección y deja elegir el resultado. En la Fase 5 crea la Preference y
 * redirige a `init_point`.
 */
export function PayButton({ totalLabel, resultHref }: { totalLabel: string; resultHref: string }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="xl" className="w-full text-ivory text-[17px] font-bold">
          <span className="md:hidden">Pagar con Mercado Pago</span>
          <span className="hidden md:inline">Pagar {totalLabel} con Mercado Pago</span>
          <ArrowUpRightIcon className="text-gold-300" />
        </Button>
      </DialogTrigger>
      <DialogContent showCloseButton={false} className="sm:max-w-[460px] bg-paper p-6 md:p-9 gap-3 md:gap-4 text-center">
        <DialogHeader className="items-center gap-3">
          <RefreshCwIcon className="size-11 text-gold-700" strokeWidth={1.6} aria-hidden />
          <DialogTitle className="font-display text-[22px] md:text-2xl font-semibold">
            Te estamos llevando a Mercado Pago…
          </DialogTitle>
          <DialogDescription>Maqueta: elegí cómo termina el pago.</DialogDescription>
        </DialogHeader>
        <Button asChild variant="gold" className="w-full">
          <Link href={`${resultHref}?estado=aprobado`}>Simular pago aprobado</Link>
        </Button>
        <Button asChild variant="outline" className="w-full border-ink bg-transparent">
          <Link href={`${resultHref}?estado=pendiente`}>Simular pago pendiente</Link>
        </Button>
        <Button asChild variant="outline" className="w-full border-ink bg-transparent">
          <Link href={`${resultHref}?estado=rechazado`}>Simular pago rechazado</Link>
        </Button>
        <DialogClose asChild>
          <Button variant="link" className="text-soft underline">
            Cancelar
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
