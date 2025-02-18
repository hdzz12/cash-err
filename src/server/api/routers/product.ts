import { createTRPCRouter, protectedProcedure } from "../trpc";
import { products } from "@/server/db/schema";

export const productRouter = createTRPCRouter({
  list: protectedProcedure.query(async ({ ctx }) => {
    const result = await ctx.db.select().from(products);
    return result.map(product => ({
      ...product,
      hargaProduk: Number(product.hargaProduk)
    }));
  })
});
