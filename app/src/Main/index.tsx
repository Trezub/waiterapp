import { useState } from 'react';
import { ActivityIndicator } from 'react-native';
import { Button } from '../components/Button';
import { Cart, CartItem } from '../components/Cart';
import { Categories } from '../components/Categories';
import { Header } from '../components/Header';
import { Empty } from '../components/Icons/Empty';
import { Menu } from '../components/Menu';
import { TableModal } from '../components/TableModal';
import { Text } from '../components/Text';
import Product from '../types/Product';
import { trpc } from '../utils/trpc';
import {
    CategoriesContainer,
    CenteredContainer,
    Container,
    Footer,
    FooterContainer,
    MenuContainer,
} from './styles';

export function Main() {
    const { data: products, isLoading } = trpc.product.getAll.useQuery();

    const [isModalVisible, setModalVisible] = useState(false);
    const [selectedTable, setSelectedTable] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<number | null>(
        null
    );
    const [cartItems, setCartItems] = useState<CartItem[]>([]);

    function handleAddToCart(product: Product) {
        if (!selectedTable) {
            setModalVisible(true);
        }
        setCartItems((prevState) => {
            const itemIndex = prevState.findIndex(
                (cartItem) => cartItem.product.id === product.id
            );
            if (itemIndex < 0) {
                return prevState.concat({
                    quantity: 1,
                    product,
                });
            }
            const newCartItems = [...prevState];
            const item = newCartItems[itemIndex];
            newCartItems[itemIndex] = {
                ...item,
                quantity: item.quantity + 1,
            };
            return newCartItems;
        });
    }

    function handleRemoveCartItem(product: Product) {
        setCartItems((prevState) => {
            const itemIndex = prevState.findIndex(
                (cartItem) => cartItem.product.id === product.id
            );
            const item = prevState[itemIndex];
            const newCartItems = [...prevState];
            if (item.quantity === 1) {
                newCartItems.splice(itemIndex, 1);
                return newCartItems;
            }

            newCartItems[itemIndex] = {
                ...item,
                quantity: item.quantity - 1,
            };
            return newCartItems;
        });
    }

    function handleSaveTable(table: string) {
        setSelectedTable(table);
    }

    function handleClearOrder() {
        setSelectedTable('');
        setCartItems([]);
    }

    const filteredProducts = selectedCategory
        ? products?.filter(({ categoryId }) => categoryId === selectedCategory)
        : products;

    return (
        <>
            <Container>
                <Header
                    onCancelOrder={handleClearOrder}
                    selectedTable={selectedTable}
                />
                {isLoading ? (
                    <CenteredContainer>
                        <ActivityIndicator color="#D73035" size="large" />
                    </CenteredContainer>
                ) : (
                    <>
                        <CategoriesContainer>
                            <Categories
                                onCategoryChange={setSelectedCategory}
                                selectedCategory={selectedCategory}
                            />
                        </CategoriesContainer>
                        {filteredProducts && filteredProducts.length > 0 ? (
                            <MenuContainer>
                                <Menu
                                    onAddToCart={handleAddToCart}
                                    products={filteredProducts}
                                />
                            </MenuContainer>
                        ) : (
                            <CenteredContainer>
                                <Empty />
                                <Text color="#666" style={{ marginTop: 24 }}>
                                    Nenhum produto foi encontrado
                                </Text>
                            </CenteredContainer>
                        )}
                    </>
                )}
            </Container>
            <Footer>
                <FooterContainer>
                    {!selectedTable && (
                        <Button
                            disabled={
                                isLoading ||
                                !filteredProducts ||
                                filteredProducts?.length === 0
                            }
                            onPress={() => setModalVisible(true)}
                        >
                            Novo pedido
                        </Button>
                    )}
                    {selectedTable && (
                        <Cart
                            tableNumber={selectedTable}
                            onClearCart={handleClearOrder}
                            onRemove={handleRemoveCartItem}
                            onAdd={handleAddToCart}
                            cartItems={cartItems}
                        />
                    )}
                </FooterContainer>
            </Footer>

            <TableModal
                onSave={handleSaveTable}
                onClose={() => setModalVisible(false)}
                visible={isModalVisible}
            />
        </>
    );
}
