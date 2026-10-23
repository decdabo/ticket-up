import type { Metadata } from "next";
import { DM_Sans, Playfair_Display } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Divercity · Entradas",
    template: "%s · Divercity",
  },
  description: "Fiestas, DJs y shows en vivo. Comprá tus entradas online.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={cn("h-full antialiased", dmSans.variable, playfair.variable)}>
      <body className="min-h-full flex flex-col font-sans">
        <TooltipProvider>{children}</TooltipProvider>
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
