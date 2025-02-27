import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { users, usersSchema } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { verify } from "@node-rs/argon2";
import { jwt } from "@/lib/jwt";

export const sessionsRouter = createTRPCRouter({
  create: publicProcedure
    .input(usersSchema.pick({ username: true, password: true }))
    .mutation(async ({ input, ctx }) => {
      const user = await ctx.db
        .select()
        .from(users)
        .where(eq(users.username, input.username));

      // check if user exists and password is correct
      if (user.length === 0) throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Nama Pengguna tidak ditemukan"
      });

      if (!(await verify(user[0]!.password, input.password)))
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Kata Sandi salah"
        });

      ctx.cookies.set("session", jwt.sign({ id: user[0]!.id }), { httpOnly: true });

      return { name: user[0]!.name };
    }),

  read: protectedProcedure
    .query(async ({ ctx }) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...user } = ctx.user;

      return user;
    }),

  delete: protectedProcedure
    .mutation(async ({ ctx }) => {
      ctx.cookies.set("session", "", { httpOnly: true });

      return true;
    })
});
