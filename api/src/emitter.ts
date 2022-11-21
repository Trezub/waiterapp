import { Order, OrderStatus } from '@prisma/client';
import { TypedEmitter } from 'tiny-typed-emitter';

export interface OrderStatusProps {
    status: OrderStatus;
    id: number;
}

export interface Events {
    orderStatus: (data: OrderStatusProps) => void;
    createOrder: (data: Order) => void;
    deleteOrder: (data: {id: number}) => void;
}

export default new TypedEmitter<Events>();
