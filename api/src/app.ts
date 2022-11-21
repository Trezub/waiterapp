import * as trpcExpress from '@trpc/server/adapters/express';
import express from 'express';
import { createExpressContext } from './trpc';
import cors from 'cors';
import log from './log';
import { appRouter } from './routers/_appRouter';

export const app = express();

app.use('/uploads', express.static('uploads'));

app.use(
    cors({
        origin: '*',
    })
);

app.use(
    '/trpc',
    trpcExpress.createExpressMiddleware({
        router: appRouter,
        createContext: createExpressContext,
        onError({ error }) {
            log.error(error);
        },
    })
);
