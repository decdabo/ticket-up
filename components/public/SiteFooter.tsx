import Link from "next/link";
import { instagramHandle } from "@/lib/data/instagram";

export function SiteFooter() {
  return (
    <footer id="contacto" className="bg-ink text-on-ink-muted border-t border-ink-line px-4 md:px-6 py-10 md:py-12">
      <div className="max-w-[1200px] mx-auto flex flex-wrap gap-10 justify-between">
        <div className="flex flex-col gap-2.5 flex-[1_1_260px] text-sm">
          <span className="font-display font-semibold text-[22px] text-ivory">Divercity</span>
          <span>Sarmiento 892 · Concordia, Entre Ríos</span>
          <span><a href="mailto:divercityconcordia@gmail.com" className="hover:text-gold-300">divercityconcordia@gmail.com</a> · <a href="https://wa.me/5493450000000" target="_blank" rel="noopener noreferrer" className="hover:text-gold-300">WhatsApp +54 9 345 000-0000</a></span>
        </div>
        <nav aria-label="Pie" className="flex flex-wrap gap-10 text-sm">
          <div className="flex flex-col gap-2.5">
            <strong className="text-ivory">Eventos</strong>
            <Link href="/eventos" className="hover:text-gold-300">Cartelera</Link>
            <Link href="/#calendario" className="hover:text-gold-300">Calendario</Link>
            <a href={`https://instagram.com/${instagramHandle}`} target="_blank" rel="noopener noreferrer" className="hover:text-gold-300">Instagram</a>
          </div>
          <div className="flex flex-col gap-2.5">
            <strong className="text-ivory">Ayuda</strong>
            <Link href="/#contacto" className="hover:text-gold-300">Preguntas frecuentes</Link>
            <Link href="/#contacto" className="hover:text-gold-300">Términos y condiciones</Link>
            <Link href="/#contacto" className="hover:text-gold-300">Botón de arrepentimiento</Link>
          </div>
        </nav>
      </div>
      <div className="max-w-[1200px] mx-auto mt-8 text-xs text-[#8f8676]">
        © 2026 Divercity. Todos los derechos reservados.
      </div>
    </footer>
  );
}
