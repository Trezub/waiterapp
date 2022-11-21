import { Order, OrderStatus, Prisma } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { observable } from '@trpc/server/observable';
import { z } from 'zod';
import emitter, { OrderStatusProps } from '../emitter';
import prisma from '../prisma';
import { publicProcedure, router } from '../trpc';

export const orderRouter = router({
    create: publicProcedure
        .input(
            z.strictObject({
                tableNumber: z.string(),
                items: z.array(
                    z.strictObject({
                        quantity: z.number(),
                        productId: z.number(),
                    })
                ),
            })
        )
        .mutation(async ({ input: { items, tableNumber } }) => {
            const order = await prisma.order.create({
                data: {
                    tableNumber,
                    items: {
                        createMany: {
                            data: items,
                        },
                    },
                },
            });
            emitter.emit('createOrder', order);
            return order;
        }),
    updateStatus: publicProcedure
        .input(
            z.strictObject({
                id: z.number(),
                status: z.nativeEnum(OrderStatus),
            })
        )
        .mutation(async ({ input: { id, status } }) => {
            try {
                await prisma.order.update({
                    where: {
                        id,
                    },
                    data: {
                        status,
                    },
                });
                emitter.emit('orderStatus', { id, status });
            } catch (err) {
                if (
                    err instanceof Prisma.PrismaClientKnownRequestError &&
                    err.code === 'P2025'
                ) {
                    throw new TRPCError({
                        code: 'NOT_FOUND',
                        message: 'Order not found',
                    });
                }
            }
        }),
    deleteOrder: publicProcedure
        .input(z.strictObject({ id: z.number() }))
        .mutation(async ({ input: { id } }) => {
            try {
                await prisma.order.delete({
                    where: {
                        id,
                    },
                });
                emitter.emit('deleteOrder', { id });
            } catch (err) {
                if (
                    err instanceof Prisma.PrismaClientKnownRequestError &&
                    err.code === 'P2025'
                ) {
                    throw new TRPCError({
                        code: 'NOT_FOUND',
                        message: 'Order not found',
                    });
                }
                throw err;
            }
        }),
    getAll: publicProcedure.query(async () =>
        prisma.order.findMany({
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
            },
        })
    ),
    onUpdateStatus: publicProcedure.subscription(() => {
        return observable<OrderStatusProps>((emit) => {
            function onUpdateStatus(data: OrderStatusProps) {
                emit.next(data);
            }
            emitter.on('orderStatus', onUpdateStatus);

            return () => {
                emitter.off('orderStatus', onUpdateStatus);
            };
        });
    }),
    onCreate: publicProcedure.subscription(() => {
        return observable<Order>((emit) => {
            function onCreate(data: Order) {
                emit.next(data);
            }
            emitter.on('createOrder', onCreate);

            return () => {
                emitter.off('createOrder', onCreate);
            };
        });
    }),
    onDelete: publicProcedure.subscription(() => {
        return observable<{ id: number }>((emit) => {
            function onCreate(data: { id: number }) {
                emit.next(data);
            }
            emitter.on('deleteOrder', onCreate);

            return () => {
                emitter.off('deleteOrder', onCreate);
            };
        });
    }),
});
