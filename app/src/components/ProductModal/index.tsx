import { FlatList, Modal } from 'react-native';
import Product from '../../types/Product';
import { formatCurrency } from '../../utils/formatCurrency';
import { Button } from '../Button';
import { Close } from '../Icons/Close';
import { Text } from '../Text';
import {
    CloseButton,
    Footer,
    FooterContainer,
    Header,
    Image,
    Ingredient,
    IngredientsContainer,
    ModalBody,
    PriceContainer,
} from './styles';

export interface ProductModalProps {
    visible: boolean;
    onClose: () => void;
    product: Product | null;
    onAddToCart: (product: Product) => void;
}

export function ProductModal({
    visible,
    onClose,
    product,
    onAddToCart,
}: ProductModalProps) {
    if (!product) {
        return null;
    }

    function handleAddToCart() {
        onAddToCart(product!);
        onClose();
    }

    return (
        <Modal
            onRequestClose={onClose}
            animationType="slide"
            presentationStyle="pageSheet"
            visible={visible}
        >
            <Image
                source={{
                    uri: `http://192.168.1.100:3333/uploads/${product.imagePath}`,
                }}
            >
                <CloseButton onPress={onClose}>
                    <Close />
                </CloseButton>
            </Image>
            <ModalBody>
                <Header>
                    <Text size={24} weight="600">
                        {product.name}
                    </Text>
                    <Text color="#666" style={{ marginTop: 8 }}>
                        {product.description}
                    </Text>
                </Header>
                {product.ingredients.length > 0 && (
                    <IngredientsContainer>
                        <Text weight="600" color="#666">
                            Ingredientes
                        </Text>

                        <FlatList
                            style={{ marginTop: 16 }}
                            data={product.ingredients}
                            keyExtractor={(product) => String(product.id)}
                            showsVerticalScrollIndicator={false}
                            renderItem={({ item: ingredient }) => (
                                <Ingredient>
                                    <Text>{ingredient.icon}</Text>
                                    <Text
                                        style={{ marginLeft: 20 }}
                                        size={14}
                                        color="#666"
                                    >
                                        {ingredient.name}
                                    </Text>
                                </Ingredient>
                            )}
                        />
                    </IngredientsContainer>
                )}
            </ModalBody>
            <Footer>
                <FooterContainer>
                    <PriceContainer>
                        <Text color="#666">Preço</Text>
                        <Text size={20} weight="600">
                            {formatCurrency(product.price)}
                        </Text>
                    </PriceContainer>
                    <Button onPress={() => handleAddToCart()}>
                        <Text color="#fff">Adicionar ao pedido</Text>
                    </Button>
                </FooterContainer>
            </Footer>
        </Modal>
    );
}
