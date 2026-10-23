import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { StatusTone } from "@/lib/status";

/** Badge de estado con punto: el color acompaña al texto, no lo reemplaza. */
export function StatusBadge({
  label,
  tone,
  large = false,
  className,
}: {
  label: string;
  tone: StatusTone;
  large?: boolean;
  className?: string;
}) {
  return (
    <Badge variant={tone} className={cn(large ? "h-7 px-3 text-[13px]" : "h-6 px-2.5", className)}>
      <span className="size-1.5 rounded-full bg-current" aria-hidden />
      {label}
    </Badge>
  );
}
