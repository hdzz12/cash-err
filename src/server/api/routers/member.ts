import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";

export const memberRouter = createTRPCRouter({
  all: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.member.findMany();
  })
  // ...other member procedures
});
