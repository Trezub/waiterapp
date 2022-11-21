import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { useState } from 'react';
import { Header } from './components/Header';
import { Orders } from './components/Orders';
import { GlobalStyles } from './styles/GlobalStyles';
import { trpc } from './utils/trpc';
import './utils/client';
import { Toaster } from 'react-hot-toast';

export function App() {
    const [queryClient] = useState(() => new QueryClient());
    const [trpcClient] = useState(() =>
        trpc.createClient({
            links: [
                httpBatchLink({
                    url: 'http://localhost:3333/trpc',
                }),
            ],
        })
    );

    return (
        <>
            <Toaster position="top-right" />
            <trpc.Provider client={trpcClient} queryClient={queryClient}>
                <QueryClientProvider client={queryClient}>
                    <GlobalStyles />
                    <Header />
                    <Orders />
                </QueryClientProvider>
            </trpc.Provider>
        </>
    );
}
