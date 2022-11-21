import { z } from 'zod';
import prisma from '../prisma';
import { publicProcedure, router } from '../trpc';

export const categoryRouter = router({
    create: publicProcedure
        .input(
            z.strictObject({
                icon: z.string(),
                name: z.string(),
            })
        )
        .mutation(({ input }) => {
            return prisma.category.create({
                data: input,
            });
        }),
    // TODO: Pagination and filters
    getAll: publicProcedure.query(() => prisma.category.findMany()),
});
