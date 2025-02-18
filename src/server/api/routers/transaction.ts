import { createTRPCRouter, protectedProcedure } from "../trpc";
import { penjualan, detailPenjualan, pelanggan, products, users } from "@/server/db/schema";
import { z } from "zod";
import { eq, sql, gte, lte, and, desc } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const transactionRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({
      customerName: z.string(),
      items: z.array(z.object({
        productId: z.number(),
        quantity: z.number(),
        subTotal: z.number()
      })),
      totalAmount: z.number(),
      paymentAmount: z.number() // tambah field untuk jumlah pembayaran
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        // 1. Validasi stok terlebih dahulu
        for (const item of input.items) {
          const product = await ctx.db.select().from(products).where(eq(products.id, item.productId)).limit(1);

          if (!product.length) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Produk tidak ditemukan"
            });
          }

          if (product[0].stock < item.quantity) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "Stok tidak mencukupi"
            });
          }
        }

        // 2. Create pelanggan
        const [newCustomer] = await ctx.db.insert(pelanggan).values({
          nama: input.customerName,
          alamat: "-",
          noTelp: "-"
        }).returning();

        if (!newCustomer) throw new Error("Gagal membuat pelanggan");

        // 3. Create penjualan
        const [newPenjualan] = await ctx.db.insert(penjualan).values({
          tanggalPenjualan: new Date(),
          totalHarga: input.totalAmount,
          pelanganID: newCustomer.id,
          userID: ctx.user.id, // Akses langsung dari ctx.user
          metodePembayaran: "cash",
          totalBayar: input.paymentAmount,
          kembalian: input.paymentAmount - input.totalAmount
        }).returning();

        if (!newPenjualan) throw new Error("Gagal membuat penjualan");

        // 4. Create detail penjualan & update stock
        for (const item of input.items) {
          await ctx.db.insert(detailPenjualan).values({
            detailID: newPenjualan.id,
            produkID: item.productId,
            jumlahProduk: item.quantity,
            subTotal: item.subTotal
          });

          // Update stock
          await ctx.db.update(products)
            .set({
              stock: sql`stock - ${item.quantity}`
            })
            .where(eq(products.id, item.productId));
        }

        return {
          success: true,
          message: "Transaksi berhasil",
          transactionId: newPenjualan.id
        };
      }
      catch (error) {
        console.error("Transaction error:", error);
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error instanceof Error ? error.message : "Terjadi kesalahan saat memproses transaksi"
        });
      }
    }),

  // Get transaction history
  list: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.penjualan.findMany({
      with: {
        pelanggan: true,
        user: true
      },
      orderBy: [desc(penjualan.tanggalPenjualan)]
    });
  }),

  // Get transaction details
  getById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const result = await ctx.db.query.penjualan.findFirst({
        where: eq(penjualan.id, input.id),
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

      if (!result) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Transaksi tidak ditemukan"
        });
      }

      return result;
    }),

  // Get daily statistics
  getDailyStats: protectedProcedure.query(async ({ ctx }) => {
    try {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);

      const result = await ctx.db
        .select({
          totalTransactions: sql`CAST(COUNT(*) AS INTEGER)`,
          totalRevenue: sql`COALESCE(CAST(SUM(${penjualan.totalHarga}) AS DECIMAL(10,2)), 0)`
        })
        .from(penjualan)
        .where(
          and(
            gte(penjualan.tanggalPenjualan, startOfDay),
            lte(penjualan.tanggalPenjualan, endOfDay)
          )
        );

      return {
        totalTransactions: Number(result[0]?.totalTransactions ?? 0),
        totalRevenue: Number(result[0]?.totalRevenue ?? 0)
      };
    }
    catch (error) {
      console.error("Error getting daily stats:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Gagal mengambil statistik harian"
      });
    }
  })
});
