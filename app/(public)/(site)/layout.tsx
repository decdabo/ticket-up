import { SiteFooter } from "@/components/public/SiteFooter";
import { SiteHeader } from "@/components/public/SiteHeader";

export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <SiteHeader />
      <div className="flex-1">{children}</div>
      <SiteFooter />
    </>
  );
}
