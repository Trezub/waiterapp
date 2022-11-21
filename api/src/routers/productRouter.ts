import { z } from 'zod';
import prisma from '../prisma';
import { publicProcedure, router } from '../trpc';

export const productRouter = router({
    create: publicProcedure
        .input(z.strictObject({
            name: z.string(),
            description: z.string(),
            price: z.number(),
            categoryId: z.number(),
        }))
        .mutation(({ input }) => prisma.product.create({
            data: {
                ...input,
                imagePath: '' // TODO: Upload files using formdata
            }
        })),
    delete: publicProcedure
        .input(z.strictObject({
            id: z.number(),
        }))
        .mutation(({ input: { id } }) => {
            prisma.product.deleteMany({
                where: {
                    id,
                },
            });
        }),
    getAll: publicProcedure.query(async () => prisma.product.findMany({
        orderBy: {
            categoryId: 'asc',
        },
        include: {
            ingredients: true,
        },
    })),
});