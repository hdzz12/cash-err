import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { pelanggan } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export const pelangganRouter = createTRPCRouter({
  list: protectedProcedure
    .query(async ({ ctx }) => {
      return await ctx.db.query.pelanggan.findMany();
    }),

  create: protectedProcedure
    .input(z.object({
      nama: z.string(),
      alamat: z.string(),
      noTelp: z.string()
    }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.insert(pelanggan).values(input);
    }),

  update: protectedProcedure
    .input(z.object({
      id: z.number(),
      nama: z.string(),
      alamat: z.string(),
      noTelp: z.string()
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      return await ctx.db.update(pelanggan)
        .set(data)
        .where(eq(pelanggan.id, id));
    }),

  delete: protectedProcedure
    .input(z.object({
      id: z.number()
    }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.delete(pelanggan)
        .where(eq(pelanggan.id, input.id));
    })
});
