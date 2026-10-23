// Piezas del "ticket troquelado" del diseño: foto placeholder y perforación con muescas.

export function PhotoPlaceholder({
  label,
  className = "",
  children,
}: {
  label?: string;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className={`bg-photo relative flex items-end p-3 ${className}`}>
      {label && (
        <span className="text-[11px] text-gold-300 bg-ink/70 px-2 py-1 rounded-sm">[Foto] {label}</span>
      )}
      {children}
    </div>
  );
}

/**
 * Línea perforada con dos muescas. `notch` es el color del fondo que rodea al ticket
 * (clase de Tailwind `bg-*`), para que las muescas "muerdan" el borde.
 */
export function Perforation({
  orientation = "horizontal",
  notch = "bg-ivory",
  line = "border-perf",
}: {
  orientation?: "horizontal" | "vertical";
  notch?: string;
  line?: string;
}) {
  if (orientation === "vertical") {
    return (
      <div aria-hidden className={`relative w-0 border-l-2 border-dashed my-3.5 ${line}`}>
        <div className={`absolute -top-7 -left-4 size-[30px] rounded-full ${notch}`} />
        <div className={`absolute -bottom-7 -left-4 size-[30px] rounded-full ${notch}`} />
      </div>
    );
  }
  return (
    <div aria-hidden className={`relative h-0 border-t-2 border-dashed mx-[18px] ${line}`}>
      <div className={`absolute -left-8 -top-[13px] size-[26px] rounded-full ${notch}`} />
      <div className={`absolute -right-8 -top-[13px] size-[26px] rounded-full ${notch}`} />
    </div>
  );
}
