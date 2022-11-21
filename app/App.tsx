import { useFonts } from "expo-font";
import { StyleSheet } from "react-native";
import { Main } from "./src/Main";

import "intl";
import "intl/locale-data/jsonp/pt-BR";
import React, { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { trpc } from "./src/utils/trpc";

export default function App() {
    const [isFontsLoaded] = useFonts({
        "GeneralSans-400": require("./src/assets/fonts/GeneralSans-Regular.otf"),
        "GeneralSans-600": require("./src/assets/fonts/GeneralSans-Semibold.otf"),
        "GeneralSans-700": require("./src/assets/fonts/GeneralSans-Bold.otf"),
    });

    const [queryClient] = useState(() => new QueryClient());
    const [trpcClient] = useState(() =>
        trpc.createClient({
            links: [
                httpBatchLink({
                    url: "http://192.168.1.100:3333/trpc",
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
