"use client";

import { useEffect, useState } from "react";
import { TimerIcon } from "lucide-react";

/**
 * Contador de reserva. En la maqueta arranca desde un valor fijo; en la Fase 4
 * se calcula con `reservation_expires_at` de la orden.
 */
export function ReservationTimer({
  initialSeconds,
  message,
  mobileMessage,
}: {
  initialSeconds: number;
  message: string;
  mobileMessage: string;
}) {
  const [left, setLeft] = useState(initialSeconds);

  useEffect(() => {
    const t = setInterval(() => setLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, []);

  const clock = `${String(Math.floor(left / 60)).padStart(2, "0")}:${String(left % 60).padStart(2, "0")}`;

  return (
    <div role="timer" aria-label={`Tiempo restante de la reserva: ${clock}`} className="bg-ink-soft text-ivory border-b border-ink-line">
      <div className="max-w-[1100px] mx-auto px-4 md:px-6 py-3 md:py-3.5 flex items-center justify-between gap-3">
        <span className="text-[13px] md:text-sm text-on-ink">
          <span className="hidden md:inline">{message}</span>
          <span className="md:hidden">{mobileMessage}</span>
        </span>
        <span className="flex items-center gap-2.5">
          <TimerIcon className="size-5 text-gold-500 hidden md:block" aria-hidden />
          <strong className="tabular-nums text-[22px] text-gold-300 tracking-[1px]">{clock}</strong>
        </span>
      </div>
    </div>
  );
}
