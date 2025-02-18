import { createTRPCRouter, protectedProcedure } from "../trpc";
import { penjualan, users, products } from "@/server/db/schema";
import { sql } from "drizzle-orm";

export const dashboardRouter = createTRPCRouter({
  stats: protectedProcedure.query(async ({ ctx }) => {
    const totalUsers = await ctx.db
      .select({ count: sql<number>`cast(count(*) as integer)` })
      .from(users);

    const totalProducts = await ctx.db
      .select({ count: sql<number>`cast(count(*) as integer)` })
      .from(products);

    const totalRevenue = await ctx.db
      .select({ 
        sum: sql<number>`coalesce(sum(${penjualan.totalHarga}), 0)::numeric`
      })
      .from(penjualan);

    const recentTransactions = await ctx.db.query.penjualan.findMany({
      limit: 5,
      orderBy: (penjualan, { desc }) => [desc(penjualan.tanggalPenjualan)],
      with: {
        pelanggan: true,
        user: true
      }
    });

    return {
      totalUsers: totalUsers[0]?.count ?? 0,
      totalProducts: totalProducts[0]?.count ?? 0,
      totalRevenue: Number(totalRevenue[0]?.sum ?? 0),
      recentTransactions
    };
  })
});
