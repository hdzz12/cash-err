import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { sessionsRouter } from "./routers/session";
import { userRouter } from "./routers/user";
import { productRouter } from "./routers/product";
import { transactionRouter } from "./routers/transaction";
import { dashboardRouter } from "./routers/dashboard";
import { memberRouter } from "./routers/member";

export const appRouter = createTRPCRouter({
  session: sessionsRouter,
  user: userRouter,
  product: productRouter,
  transaction: transactionRouter,
  dashboard: dashboardRouter,
  member: memberRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
