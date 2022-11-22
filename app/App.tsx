import { useFonts } from 'expo-font';
import { Main } from './src/Main';

import 'intl';
import 'intl/locale-data/jsonp/pt-BR';
import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { apiEndpoint, trpc } from './src/utils/trpc';

export default function App() {
    const [isFontsLoaded] = useFonts({
        'GeneralSans-400': require('./src/assets/fonts/GeneralSans-Regular.otf'),
        'GeneralSans-600': require('./src/assets/fonts/GeneralSans-Semibold.otf'),
        'GeneralSans-700': require('./src/assets/fonts/GeneralSans-Bold.otf'),
    });

    const [queryClient] = useState(() => new QueryClient());
    const [trpcClient] = useState(() =>
        trpc.createClient({
            links: [
                httpBatchLink({
                    url: `${apiEndpoint}/trpc`,
                }),
            ],
        })
    );

    if (!isFontsLoaded) {
        return null;
    }

    return (
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
            <QueryClientProvider client={queryClient}>
                <Main />
            </QueryClientProvider>
        </trpc.Provider>
    );
}
