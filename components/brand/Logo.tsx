import Link from "next/link";

// Monograma provisorio hasta tener el logo del cliente.
export function Logo({
  href = "/",
  label = "Divercity",
  tagline = false,
  size = "md",
}: {
  href?: string;
  label?: string;
  tagline?: boolean;
  size?: "sm" | "md";
}) {
  const mono = size === "sm" ? "text-xl px-1.5" : "text-[26px] px-2";
  const name = size === "sm" ? "text-[19px]" : "text-[22px]";
  return (
    <Link href={href} className="flex items-center gap-3 no-underline min-h-11">
      <span
        className={`font-display font-bold tracking-[-1px] text-gold-500 border border-gold-700 py-0.5 leading-none ${mono}`}
      >
        DC
      </span>
      <span className="flex flex-col leading-none">
        <span className={`font-display font-semibold text-ivory ${name}`}>{label}</span>
        {tagline && (
          <span className="text-[10px] tracking-[3px] text-gold-500 mt-1">ENTRADAS · EVENTOS</span>
        )}
      </span>
    </Link>
  );
}
