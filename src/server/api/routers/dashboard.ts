import { createTRPCRouter, protectedProcedure } from "../trpc";
import { penjualan, users, products, pelanggan } from "@/server/db/schema";
import { sql, desc } from "drizzle-orm";

export const dashboardRouter = createTRPCRouter({
  stats: protectedProcedure.query(async ({ ctx }) => {
    // Get users count
    const totalUsers = await ctx.db
      .select({ count: sql<number>`cast(count(*) as integer)` })
      .from(users);

    // Get products count and stock
    const productsStats = await ctx.db
      .select({
        totalProducts: sql<number>`cast(count(*) as integer)`,
        totalStock: sql<number>`cast(sum(${products.stock}) as integer)`
      })
      .from(products);

    // Get total revenue and transactions
    const salesStats = await ctx.db
      .select({
        totalRevenue: sql<number>`coalesce(sum(${penjualan.totalHarga}), 0)::numeric`,
        totalTransactions: sql<number>`cast(count(*) as integer)`
      })
      .from(penjualan);

    // Get total customers
    const totalCustomers = await ctx.db
      .select({ count: sql<number>`cast(count(*) as integer)` })
      .from(pelanggan);

    // Get recent transactions with full relations
    const recentTransactions = await ctx.db.query.penjualan.findMany({
      limit: 5,
      with: {
        pelanggan: true,
        user: true,
        details: {
          with: {
            product: true
          }
        }
      },
      orderBy: [desc(penjualan.tanggalPenjualan)]
    });

    // Get low stock products with related transaction details
    const lowStockProducts = await ctx.db.query.products.findMany({
      where: sql`${products.stock} < 10`,
      with: {
        detailList: {
          with: {
            penjualan: true
          }
        }
      },
      limit: 5
    });

    return {
      totalUsers: totalUsers[0]?.count ?? 0,
      totalProducts: productsStats[0]?.totalProducts ?? 0,
      totalStock: productsStats[0]?.totalStock ?? 0,
      totalRevenue: Number(salesStats[0]?.totalRevenue ?? 0),
      totalTransactions: salesStats[0]?.totalTransactions ?? 0,
      totalCustomers: totalCustomers[0]?.count ?? 0,
      recentTransactions,
      lowStockProducts
    };
  })
});
