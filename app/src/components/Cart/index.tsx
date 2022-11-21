import { useState } from "react";
import { FlatList, TouchableOpacity } from "react-native";
import Product from "../../types/Product";
import { formatCurrency } from "../../utils/formatCurrency";
import { trpc } from "../../utils/trpc";
import { Button } from "../Button";
import { MinusCircle } from "../Icons/MinusCircle";
import { PlusCircle } from "../Icons/PlusCircle";
import { OrderConfirmedModal } from "../OrderConfirmedModal";
import { Text } from "../Text";
import {
    Actions,
    Image,
    Item,
    ProductContainer,
    ProductDetails,
    QuantityContainer,
    Summary,
    TotalContainer,
} from "./styles";

export interface CartItem {
    product: Product;
    quantity: number;
}

export interface CartProps {
    cartItems: CartItem[];
    tableNumber: string;
    onAdd: (product: Product) => void;
    onRemove: (product: Product) => void;
    onClearCart: () => void;
}

export function Cart({
    cartItems,
    onAdd,
    onRemove,
    onClearCart,
    tableNumber,
}: CartProps) {
    const total = cartItems.reduce(
        (acc, val) => acc + val.product.price * val.quantity,
        0
    );

    const [orderConfirmedModalVisible, setOrderConfirmedModalVisible] =
        useState(false);

    const { mutateAsync: createOrder, isLoading } = trpc.order.create.useMutation();

    async function handleConfirmOrder() {
        await createOrder({
            tableNumber,
            items: cartItems.map(({ product: { id }, quantity }) => ({
                productId: id,
                quantity,
            })),
        });
        setOrderConfirmedModalVisible(true);
    }

    return (
        <>
            <OrderConfirmedModal
                onClose={onClearCart}
                visible={orderConfirmedModalVisible}
            />
            {cartItems.length > 0 && (
                <FlatList
                    style={{ marginBottom: 20, maxHeight: 130 }}
                    data={cartItems}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(cartItem) => String(cartItem.product.id)}
                    renderItem={({ item: cartItem }) => (
                        <Item>
                            <ProductContainer>
                                <Image
                                    source={{
                                        uri: `http://192.168.1.100:3333/uploads/${cartItem.product.imagePath}`,
                                    }}
                                />
                                <QuantityContainer>
                                    <Text size={14} color="#666">
                                        {cartItem.quantity}x
                                    </Text>
                                </QuantityContainer>
                                <ProductDetails>
                                    <Text size={14} weight="600">
                                        {cartItem.product.name}
                                    </Text>
                                    <Text
                                        style={{ marginTop: 4 }}
                                        size={14}
                                        color="#666"
                                    >
                                        {formatCurrency(cartItem.product.price)}
                                    </Text>
                                </ProductDetails>
                            </ProductContainer>
                            <Actions>
                                <TouchableOpacity
                                    onPress={() => onAdd(cartItem.product)}
                                    style={{ marginRight: 24 }}
                                >
                                    <PlusCircle />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => onRemove(cartItem.product)}
                                >
                                    <MinusCircle />
                                </TouchableOpacity>
                            </Actions>
                        </Item>
                    )}
                />
            )}
            <Summary>
                <TotalContainer>
                    {cartItems.length > 0 ? (
                        <>
                            <Text color="#666">Total</Text>
                            <Text size={20} weight="600">
                                {formatCurrency(total)}
                            </Text>
                        </>
                    ) : (
                        <Text color="#999">Seu carrinho está vazio</Text>
                    )}
                </TotalContainer>
                <Button loading={isLoading} onPress={handleConfirmOrder}>
                    Confirmar pedido
                </Button>
            </Summary>
        </>
    );
}
