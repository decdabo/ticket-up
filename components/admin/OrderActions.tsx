"use client";

import { MailIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

/** Reenviar / reembolsar. En la Fase 6 encola el job de email; el reembolso usa la API de MP. */
export function OrderActions({ email, canRefund }: { email: string; canRefund: boolean }) {
  return (
    <div className="flex flex-wrap gap-2.5">
      <Button onClick={() => toast.success(`Entradas reenviadas a ${email}.`)}>
        <MailIcon /> Reenviar entradas
      </Button>
      {canRefund && (
        <Button variant="outline" className="border-destructive text-destructive hover:bg-err-bg hover:text-destructive">
          Cancelar y reembolsar
        </Button>
      )}
    </div>
  );
}
