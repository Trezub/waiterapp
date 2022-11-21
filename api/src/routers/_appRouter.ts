import { router } from '../trpc';
import { categoryRouter } from './categoryRouter';
import { orderRouter } from './orderRouter';
import { productRouter } from './productRouter';

export const appRouter = router({
    category: categoryRouter,
    product: productRouter,
    order: orderRouter,
});

export type AppRouter = typeof appRouter;