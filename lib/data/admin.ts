import { adminUser, dailySales, todayStats } from "@/lib/mock/data";
import { eventTotals, getPublishedEvents } from "./events";

export async function getCurrentAdmin() {
  return adminUser;
}

export async function getDashboardStats() {
  const published = await getPublishedEvents();
  return {
    today: todayStats,
    dailySales,
    occupancy: published.map((e) => {
      const t = eventTotals(e);
      return { id: e.id, title: e.title, sold: t.sold, capacity: t.capacity };
    }),
  };
}
