import { OrdersBoard } from '../OrdersBoard';
import { Container } from './styles';
import { trpc } from '../../utils/trpc';
import { useEffect } from 'react';
import { ws } from '../../utils/client';

export function Orders() {
    const { data: orders, refetch } = trpc.order.getAll.useQuery();

    useEffect(() => {
        const onUpdateStatus = ws.order.onUpdateStatus.subscribe(undefined, {
            onData() {
                refetch();
            },
        });

        const onCreateOrder = ws.order.onCreate.subscribe(undefined, {
            onData() {
                refetch();
            },
        });

        const onDeleteOrder = ws.order.onDelete.subscribe(undefined, {
            onData() {
                refetch();
            },
        });

        return () => {
            onUpdateStatus.unsubscribe();
            onCreateOrder.unsubscribe();
            onDeleteOrder.unsubscribe();
        };
    }, []);

    if (!orders) {
        return null;
    }

    return (
        <>
            <Container>
                <OrdersBoard
                    icon="🕛"
                    title="Em espera"
                    orders={orders.filter(({ status }) => status === 'WAITING')}
                />
                <OrdersBoard
                    icon="🔵"
                    title="Em preparação"
                    orders={orders.filter(
                        ({ status }) => status === 'IN_PRODUCTION'
                    )}
                />
                <OrdersBoard
                    icon="✅"
                    title="Pronto"
                    orders={orders.filter(({ status }) => status === 'DONE')}
                />
            </Container>
        </>
    );
}
