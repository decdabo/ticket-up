// Capa de lectura del feed de Instagram. Hoy devuelve mocks; más adelante
// consulta la Graph API de Instagram con la misma firma.

import { INSTAGRAM_HANDLE, instagramPosts } from "@/lib/mock/data";
import type { InstagramPost } from "@/lib/mock/types";

export const instagramHandle = INSTAGRAM_HANDLE;

export async function getInstagramPosts(limit = 6): Promise<InstagramPost[]> {
  return [...instagramPosts].sort((a, b) => b.postedAt.localeCompare(a.postedAt)).slice(0, limit);
}
