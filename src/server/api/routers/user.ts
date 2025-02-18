import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { users } from "@/server/db/schema";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { hash, verify } from "@node-rs/argon2";
import { TRPCError } from "@trpc/server";

export const userRouter = createTRPCRouter({
  list: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.select().from(users);
  }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1, "Nama harus diisi"),
        username: z.string().min(1, "Username harus diisi"),
        password: z.string(),
        level: z.enum(["admin", "user"])
      })
    )
    .mutation(async ({ ctx, input }) => {
      const hashedPassword = await hash(input.password);

      return await ctx.db.insert(users).values({
        name: input.name,
        username: input.username,
        password: hashedPassword,
        level: input.level,
        passwordUpdatedAt: new Date()
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().min(1, "Nama harus diisi"),
        username: z.string().min(1, "Username harus diisi"),
        password: z.string().optional(),
        level: z.enum(["admin", "user"])
      })
    )
    .mutation(async ({ ctx, input }) => {
      const updateData: Partial<typeof users.$inferInsert> = {
        name: input.name,
        username: input.username,
        level: input.level
      };

      if (input.password) {
        updateData.password = await hash(input.password);
        updateData.passwordUpdatedAt = new Date();
      }

      return await ctx.db
        .update(users)
        .set(updateData)
        .where(eq(users.id, input.id));
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db
        .delete(users)
        .where(eq(users.id, input.id));
    }),

  current: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.users.findFirst({
      where: eq(users.id, ctx.user.id)
    });
  }),

  login: publicProcedure
    .input(
      z.object({
        username: z.string(),
        password: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.query.users.findFirst({
        where: eq(users.username, input.username)
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Username atau password salah"
        });
      }

      const validPassword = await verify(user.password, input.password);
      if (!validPassword) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Username atau password salah"
        });
      }

      // Set session ke cookies
      const token = {
        id: user.id,
        name: user.name,
        username: user.username,
        level: user.level
      };

      // Set cookies via context
      await ctx.session.create(token);

      return token;
    }),

  logout: protectedProcedure.mutation(async ({ ctx }) => {
    await ctx.session.destroy();
    return { success: true };
  })
});
