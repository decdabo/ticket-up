import type { Metadata } from "next";
import { EventForm } from "@/components/admin/EventForm";
import { PageHeader } from "@/components/admin/ui";

export const metadata: Metadata = { title: "Nuevo evento" };

export default function NewEventPage() {
  return (
    <>
      <PageHeader title="Nuevo evento" crumbs={[{ href: "/admin/eventos", label: "Eventos" }]} />
      <EventForm
        isNew
        initial={{
          title: "",
          slug: "",
          category: "Fiesta",
          description: "",
          startsAt: "",
          endsAt: "",
          venue: "",
          address: "",
          status: "draft",
          publishedInfo: null,
          previewHref: null,
          ticketTypes: [],
          summary: null,
        }}
      />
    </>
  );
}
