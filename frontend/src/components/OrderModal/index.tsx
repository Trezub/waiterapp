import { Actions, Image, ModalBody, OrderDetails, Overlay } from './styles';
import closeIcon from '../../assets/images/close-icon.svg';
import { RouterOutput, trpc } from '../../utils/trpc';
import { formatCurrency } from '../../utils/formatCurrency';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useTransition, animated, easings } from 'react-spring';

type Order = RouterOutput['order']['getAll'][number];

const statuses: {
    [key in Order['status']]: {
        icon: string;
        name: string;
    };
} = {
    WAITING: {
        icon: '🕛',
        name: 'Em Espera',
    },
    IN_PRODUCTION: {
        icon: '🔵',
        name: 'Em preparação',
    },
    DONE: {
        icon: '✅',
        name: 'Pronto',
    },
};

export interface OrderModalProps {
    order: Order;
    onClose: () => void;
    isVisible: boolean;
}

export function OrderModal({
    order: { tableNumber, items, status, id },
    onClose,
    isVisible,
}: OrderModalProps) {
    const { mutateAsync: updateOrderStatus, isLoading: isUpdateLoading } =
        trpc.order.updateStatus.useMutation();
    const { mutateAsync: deleteOrder, isLoading: isDeleteLoading } =
        trpc.order.deleteOrder.useMutation();

    const isLoading = isUpdateLoading || isDeleteLoading;

    const transition = useTransition(isVisible, {
        from: {
            x: 0,
            y: -40,
            opacity: 0,
        },
        enter: {
            x: 0,
            y: 0,
            opacity: 1,
        },
        leave: {
            x: 0,
            y: -40,
            opacity: 0,
        }
    });

    async function handleUpdate(id: number, status: Order['status']) {
        await toast.promise(
            updateOrderStatus({ id, status }),
            status === 'IN_PRODUCTION'
                ? {
                      loading: 'Iniciando pedido',
                      success: 'Pedido iniciado',
                      error: 'Falha ao iniciar pedido',
                  }
                : {
                      loading: 'Concluindo pedido',
                      success: 'Pedido concluido',
                      error: 'Falha ao concluir pedido',
                  }
        );
        onClose();
    }

    async function handleDelete(id: number) {
        await toast.promise(deleteOrder({ id }), {
            loading: 'Cancelando pedido',
            success: 'Pedido cancelado',
            error: 'Falha ao cancelar pedido',
        });
        onClose();
    }

    useEffect(() => {
        function handleKeyPress(e: KeyboardEvent) {
            if (e.key === 'Escape') {
                onClose();
            }
        }

        function removeListener() {
            document.removeEventListener('keydown', handleKeyPress);
        }

        if (isVisible) {
            document.addEventListener('keydown', handleKeyPress);
        } else {
            removeListener();
        }

        return () => removeListener();
    }, [isVisible]);

    function handleClickOverlay(
        e: React.MouseEvent<HTMLDivElement, MouseEvent>
    ) {
        if (!isVisible) {
            return;
        }
        if ((e.target as HTMLDivElement).id === 'modalOverlay') {
            onClose();
        }
    }

    const total = formatCurrency(
        items.reduce((acc, val) => acc + val.product.price * val.quantity, 0)
    );

    return (
        <Overlay
            isVisible={isVisible}
            onClick={handleClickOverlay}
            id="modalOverlay"
        >
            {transition(
                (style, isVisible) =>
                    isVisible && (
                        <animated.div style={style}>
                            <ModalBody>
                                <header>
                                    <strong>Mesa {tableNumber}</strong>
                                    <button type="button" onClick={onClose}>
                                        <img src={closeIcon} alt="Fechar" />
                                    </button>
                                </header>

                                <div className="status-container">
                                    <small>Status do pedido</small>
                                    <div>
                                        <span>{statuses[status].icon}</span>
                                        <strong>{statuses[status].name}</strong>
                                    </div>
                                </div>

                                <OrderDetails>
                                    <strong>Itens</strong>

                                    <div className="order-items">
                                        {items.map(
                                            ({ id, quantity, product }) => (
                                                <div className="item" key={id}>
                                                    <Image
                                                        src={`http://localhost:3333/uploads/${product.imagePath}`}
                                                    />
                                                    <span className="quantity">
                                                        {quantity}x
                                                    </span>

                                                    <div className="product-details">
                                                        <strong>
                                                            {product.name}
                                                        </strong>
                                                        <span>
                                                            {formatCurrency(
                                                                product.price
                                                            )}
                                                        </span>
                                                    </div>
                                                </div>
                                            )
                                        )}
                                    </div>

                                    <div className="total">
                                        <span>Total</span>
                                        <strong>{total}</strong>
                                    </div>
                                </OrderDetails>

                                {status !== 'DONE' && (
                                    <Actions>
                                        <button
                                            disabled={isLoading}
                                            type="button"
                                            className="primary"
                                            onClick={() =>
                                                handleUpdate(
                                                    id,
                                                    status === 'IN_PRODUCTION'
                                                        ? 'DONE'
                                                        : 'IN_PRODUCTION'
                                                )
                                            }
                                        >
                                            <strong>
                                                {status === 'WAITING'
                                                    ? 'Iniciar produção'
                                                    : 'Concluir pedido'}
                                            </strong>
                                        </button>

                                        <button
                                            disabled={isLoading}
                                            type="button"
                                            className="secondary"
                                            onClick={() => handleDelete(id)}
                                        >
                                            <strong>Cancelar pedido</strong>
                                        </button>
                                    </Actions>
                                )}
                            </ModalBody>
                        </animated.div>
                    )
            )}
        </Overlay>
    );
}
