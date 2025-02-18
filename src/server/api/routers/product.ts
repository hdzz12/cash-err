import { createTRPCRouter, protectedProcedure } from "../trpc";
import { products } from "@/server/db/schema";
import { z } from "zod";
import { getRandomProductImage } from "@/lib/utils/constants";

export const productRouter = createTRPCRouter({
  list: protectedProcedure.query(async ({ ctx }) => {
    const result = await ctx.db.select().from(products);
    return result.map(product => ({
      ...product,
      hargaProduk: Number(product.hargaProduk),
      imageUrl: product.imageUrl || "https://placehold.co/200x200" // provide default image
    }));
  }),

  create: protectedProcedure
    .input(z.object({
      namaProduk: z.string(),
      hargaProduk: z.number(),
      stock: z.number(),
      imageUrl: z.string().optional()
    }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.insert(products).values({
        ...input,
        imageUrl: input.imageUrl || getRandomProductImage()
      });
    })
});
