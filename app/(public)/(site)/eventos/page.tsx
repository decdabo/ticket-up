import type { Metadata } from "next";
import { Crumbs } from "@/components/brand/Crumbs";
import { CatalogView } from "@/components/public/CatalogView";
import { getPublishedEvents, toEventCard } from "@/lib/data/events";

export const metadata: Metadata = { title: "Cartelera" };

export default async function CatalogPage() {
  const cards = (await getPublishedEvents()).map(toEventCard);
  return (
    <>
      <section className="bg-ink text-ivory px-4 md:px-6 pt-5 md:pt-12 pb-6 md:pb-14">
        <div className="max-w-[1200px] mx-auto flex flex-col gap-2.5">
          <Crumbs tone="dark" className="hidden md:block" items={[{ href: "/", label: "Inicio" }]} current="Eventos" />
          <h1 className="font-display font-semibold text-[34px] md:text-5xl">Cartelera</h1>
        </div>
      </section>
      <CatalogView events={cards} />
    </>
  );
}
