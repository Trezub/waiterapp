import { useState } from 'react';
import { RouterOutput } from '../../utils/trpc';
import { OrderModal } from '../OrderModal';
import { Board, OrdersContainer } from './styles';

type Order = RouterOutput['order']['getAll'][number];

export interface OrdersBoardProps {
    icon: string;
    title: string;
    orders: RouterOutput['order']['getAll'];
}

export function OrdersBoard({ icon, title, orders }: OrdersBoardProps) {
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    function handleOpenModal(order: Order) {
        setSelectedOrder(order);
        setIsModalVisible(true);
    }

    function handleCloseModal() {
        setIsModalVisible(false);
    }

    return (
        <Board>
            <OrderModal
                isVisible={isModalVisible}
                order={selectedOrder || ({ items: [] } as any)}
                onClose={handleCloseModal}
            />
            <header>
                <span>{icon}</span>
                <strong>{title}</strong>
                <span>({orders.length})</span>
            </header>

            <OrdersContainer>
                {orders.map((order) => (
                    <button
                        key={order.id}
                        type="button"
                        onClick={() => handleOpenModal(order)}
                    >
                        <strong>Mesa {order.tableNumber}</strong>
                        <span>{order.items.length} itens</span>
                    </button>
                ))}
            </OrdersContainer>
        </Board>
    );
}
