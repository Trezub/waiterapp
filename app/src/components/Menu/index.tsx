import React, { useState } from 'react';
import { FlatList } from 'react-native';
import { formatCurrency } from '../../utils/formatCurrency';
import { PlusCircle } from '../Icons/PlusCircle';
import { ProductModal } from '../ProductModal';
import TProduct from '../../types/Product';
import { Text } from '../Text';
import {
    Product,
    ProductImage,
    ProductDetails,
    Separator,
    AddToCartButton,
} from './styles';
import { apiEndpoint } from '../../utils/trpc';

export interface MenuProps {
    products: TProduct[];
    onAddToCart: (product: TProduct) => void;
}

export function Menu({ products, onAddToCart }: MenuProps) {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<TProduct | null>(
        null
    );

    function handleOpenModal(product: TProduct) {
        setSelectedProduct(product);
        setIsModalVisible(true);
    }

    return (
        <>
            <ProductModal
                visible={isModalVisible}
                onClose={() => setIsModalVisible(false)}
                product={selectedProduct}
                onAddToCart={onAddToCart}
            />
            <FlatList
                data={products}
                style={{ marginTop: 32 }}
                contentContainerStyle={{ paddingHorizontal: 24 }}
                keyExtractor={(products) => String(products.id)}
                ItemSeparatorComponent={Separator}
                renderItem={({ item: product }) => (
                    <Product onPress={() => handleOpenModal(product)}>
                        <ProductImage
                            source={{
                                uri: `${apiEndpoint}/uploads/${product.imagePath}`,
                            }}
                        />
                        <ProductDetails>
                            <Text weight="600">{product.name}</Text>
                            <Text
                                size={14}
                                color="#666"
                                style={{ marginVertical: 8 }}
                            >
                                {product.description}
                            </Text>
                            <Text weight="600" size={14}>
                                {formatCurrency(product.price)}
                            </Text>
                        </ProductDetails>

                        <AddToCartButton onPress={() => onAddToCart(product)}>
                            <PlusCircle />
                        </AddToCartButton>
                    </Product>
                )}
            />
        </>
    );
}
