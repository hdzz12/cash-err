import { createTRPCRouter, protectedProcedure } from "../trpc";
import { penjualan, users, products, pelanggan } from "@/server/db/schema";
import { sql, desc } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const dashboardRouter = createTRPCRouter({
  stats: protectedProcedure.query(async ({ ctx }) => {
    try {
      // Get total users
      const [userCount] = await ctx.db
        .select({ count: sql<number>`count(*)::int` })
        .from(users);

      // Get products stats
      const [productStats] = await ctx.db
        .select({
          count: sql<number>`count(*)::int`,
          totalStock: sql<number>`sum(stock)::int`
        })
        .from(products);

      // Get customers count
      const [customerCount] = await ctx.db
        .select({ count: sql<number>`count(*)::int` })
        .from(pelanggan);

      // Get today's sales
      const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
      const [salesStats] = await ctx.db
        .select({
          revenue: sql<string>`coalesce(sum(${penjualan.totalHarga}), 0)::text`,
          count: sql<number>`count(*)::int`
        })
        .from(penjualan)
        .where(sql`date(${penjualan.tanggalPenjualan}) = ${today}`);

      // Get recent transactions with complete details
      const recentTransactions = await ctx.db.query.penjualan.findMany({
        limit: 5,
        orderBy: [desc(penjualan.tanggalPenjualan)],
        with: {
          pelanggan: true,
          user: true,
          details: {
            with: {
              product: true
            }
          }
        }
      });

      // Get low stock products
      const lowStockProducts = await ctx.db
        .select()
        .from(products)
        .orderBy(products.stock)
        .limit(5);

      return {
        totalUsers: userCount?.count ?? 0,
        totalProducts: productStats?.count ?? 0,
        totalCustomers: customerCount?.count ?? 0,
        totalStock: productStats?.totalStock ?? 0,
        totalRevenue: Number(salesStats?.revenue ?? 0),
        totalTransactions: salesStats?.count ?? 0,
        recentTransactions,
        lowStockProducts
      };
    }
    catch (error) {
      console.error("Dashboard stats error:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch dashboard statistics"
      });
    }
  })
});
