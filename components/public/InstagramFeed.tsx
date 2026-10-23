import { CopyIcon, FilmIcon, HeartIcon, MessageCircleIcon } from "lucide-react";
import { PhotoPlaceholder } from "@/components/brand/Ticket";
import { Button } from "@/components/ui/button";
import { formatCompact } from "@/lib/format";
import type { InstagramPost } from "@/lib/mock/types";

/** Logo de Instagram (lucide-react v1 ya no incluye íconos de marcas). */
export function InstagramGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" className={className} aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
    </svg>
  );
}

/** Grilla simulada con las últimas publicaciones del club, al estilo del perfil de IG. */
export function InstagramFeed({ posts, handle }: { posts: InstagramPost[]; handle: string }) {
  const href = `https://instagram.com/${handle}`;

  return (
    <section id="instagram" className="bg-ink text-ivory px-4 md:px-6 py-11 md:py-[88px]">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex flex-wrap items-end justify-between gap-4 md:gap-6">
          <div className="flex flex-col gap-2 md:gap-3">
            <span className="text-xs tracking-[3px] text-gold-500 font-semibold">SEGUINOS</span>
            <h2 className="font-display font-semibold text-[26px] md:text-[40px] leading-tight flex items-center gap-3">
              <InstagramGlyph className="size-7 md:size-9 text-gold-300 shrink-0" />@{handle}
            </h2>
            <p className="text-on-ink-muted text-sm md:text-base">Fotos, line-ups y lo que pasó anoche.</p>
          </div>
          <Button asChild variant="outline-light" className="w-full md:w-auto">
            <a href={href} target="_blank" rel="noopener noreferrer">
              Seguinos en Instagram
            </a>
          </Button>
        </div>

        <ul className="mt-6 md:mt-10 grid grid-cols-3 gap-1 md:gap-3">
          {posts.map((post) => (
            <li key={post.id}>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Publicación de Instagram: ${post.caption}`}
                className="group relative block aspect-square overflow-hidden md:rounded-md focus-visible:outline-2 focus-visible:outline-gold-300"
              >
                <PhotoPlaceholder
                  label={post.image}
                  className="size-full [&>span]:hidden md:[&>span]:inline transition-transform duration-300 group-hover:scale-105"
                />
                {post.kind !== "post" && (
                  <span className="absolute top-1.5 right-1.5 md:top-3 md:right-3 text-ivory drop-shadow">
                    {post.kind === "reel" ? (
                      <FilmIcon className="size-4 md:size-5" aria-hidden />
                    ) : (
                      <CopyIcon className="size-4 md:size-5" aria-hidden />
                    )}
                  </span>
                )}
                {/* Overlay con métricas y caption (solo desktop, en hover o foco) */}
                <div className="hidden md:flex absolute inset-0 bg-ink/75 flex-col items-center justify-center gap-3 p-5 text-center opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                  <div className="flex gap-6 font-semibold">
                    <span className="flex items-center gap-1.5">
                      <HeartIcon className="size-5 fill-current" aria-hidden />
                      {formatCompact(post.likes)}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MessageCircleIcon className="size-5 fill-current" aria-hidden />
                      {formatCompact(post.comments)}
                    </span>
                  </div>
                  <p className="text-sm text-on-ink-muted line-clamp-2">{post.caption}</p>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
