"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { AdminCard } from "./ui";

const money = new Intl.NumberFormat("es-AR", { maximumFractionDigits: 0 });
const fmt = (cents: number) => `$ ${money.format(cents / 100)}`;

const config = {
  amount: { label: "Ventas", color: "var(--chart-1)" },
} satisfies ChartConfig;

/** Ventas diarias: una sola serie (sin leyenda), tooltip al pasar el cursor. */
export function SalesChart({ data }: { data: { label: string; amountCents: number }[] }) {
  const total = data.reduce((s, d) => s + d.amountCents, 0);
  const rows = data.map((d) => ({ label: d.label, amount: d.amountCents / 100 }));

  return (
    <AdminCard
      title="Ventas · últimos 7 días"
      action={<span className="text-[13px] text-stone tabular-nums">Total semana {fmt(total)}</span>}
      className="flex-[1_1_420px] min-w-0"
    >
      <ChartContainer
        config={config}
        className="aspect-auto h-[230px] w-full"
        role="img"
        aria-label={`Ventas diarias de los últimos 7 días. ${data.map((d) => `${d.label}: ${fmt(d.amountCents)}`).join(", ")}`}
      >
        <BarChart data={rows} margin={{ top: 8, left: 0, right: 0, bottom: 0 }}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} />
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                hideIndicator
                formatter={(value) => <span className="font-semibold tabular-nums">$ {money.format(Number(value))}</span>}
              />
            }
          />
          <Bar dataKey="amount" fill="var(--color-amount)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ChartContainer>
    </AdminCard>
  );
}
