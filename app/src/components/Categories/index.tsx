import { Category, Icon } from './styles';
import { Text } from '../Text';
import { FlatList } from 'react-native';
import { trpc } from '../../utils/trpc';

export interface CategoriesProps {
    onCategoryChange: (categoryId: number | null) => void;
    selectedCategory: number | null;
}

export function Categories({
    onCategoryChange,
    selectedCategory,
}: CategoriesProps) {
    function handleSelectCategory(id: number) {
        const category = id === selectedCategory ? null : id;
        onCategoryChange(category);
    }

    const { data: categories } = trpc.category.getAll.useQuery();

    return (
        <>
            <FlatList
                horizontal
                data={categories}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingRight: 24 }}
                keyExtractor={(cat) => String(cat.id)}
                renderItem={({ item: category }) => {
                    const isSelected = selectedCategory === category.id;

                    return (
                        <Category
                            onPress={() => handleSelectCategory(category.id)}
                            key={category.id}
                        >
                            <Icon>
                                <Text opacity={isSelected ? 1 : 0.5}>
                                    {category.icon}
                                </Text>
                            </Icon>

                            <Text
                                opacity={isSelected ? 1 : 0.5}
                                size={14}
                                weight="600"
                            >
                                {category.name}
                            </Text>
                        </Category>
                    );
                }}
            />
        </>
    );
}
