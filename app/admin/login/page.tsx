import type { Metadata } from "next";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata: Metadata = { title: "Ingresar · Admin Divercity", robots: { index: false } };

export default function AdminLoginPage() {
  return (
    <div className="flex-1 bg-ivory flex flex-wrap">
      <section className="flex-[1_1_420px] bg-ink text-ivory p-8 md:p-14 flex flex-col justify-between gap-10 min-h-80">
        <div className="flex items-center gap-3">
          <span className="font-display font-bold text-[30px] tracking-[-1px] text-gold-500 border border-gold-700 px-2.5 leading-none py-0.5">
            DC
          </span>
          <span className="font-display font-semibold text-[26px]">Divercity</span>
        </div>
        <div className="flex flex-col gap-3">
          <span className="text-xs tracking-[3px] text-gold-500 font-semibold">PANEL DE ADMINISTRACIÓN</span>
          <h1 className="font-display font-semibold text-3xl md:text-[44px] leading-[1.15]">
            Eventos, entradas y ventas en un solo lugar.
          </h1>
        </div>
        <span className="text-[13px] text-[#8f8676]">Acceso solo para personal autorizado.</span>
      </section>
      <section className="flex-[1_1_420px] flex items-center justify-center px-6 py-12">
        <LoginForm />
      </section>
    </div>
  );
}
