import { inferAsyncReturnType, initTRPC } from '@trpc/server';
import * as trpcExpress from '@trpc/server/adapters/express';

export const createExpressContext = ({
    req,
    res,
}: trpcExpress.CreateExpressContextOptions) => ({}); // no context

type Context = inferAsyncReturnType<typeof createExpressContext>;

const t = initTRPC.context<Context>().create({});

export const mergeRouters = t.mergeRouters;
export const middleware = t.middleware;
export const router = t.router;
export const publicProcedure = t.procedure;