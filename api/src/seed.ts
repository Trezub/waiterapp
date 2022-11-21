import prisma from './prisma';

async function main() {
    await prisma.category.create({
        data: {
            icon: '🧀',
            name: 'Pizzas',
            products: {
                createMany: {
                    data: [
                        {
                            id: 1,
                            description: 'Vai quatro queijos',
                            imagePath: '',
                            name: 'Quatro queijos',
                            price: 50_00,
                        },
                        {
                            id: 2,
                            description: 'Vai frango',
                            imagePath: '',
                            name: 'Frango',
                            price: 89_50,
                        },
                    ]
                },
            },
        },
    });
    await prisma.order.create({
        data: {
            tableNumber: '1',
            status: 'WAITING',
            items: {
                createMany: {
                    data: [{
                        productId: 1,
                        quantity: 2,
                    },
                    {
                        productId: 2,
                        quantity: 4,
                    }],
                }
            }
        },
    });
}

main().then(async () => {
    await prisma.$disconnect();
}).catch((err) => {
    console.error(err);
    process.exit(1);
});