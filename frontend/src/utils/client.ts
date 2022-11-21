import { createTRPCProxyClient, createWSClient, wsLink } from '@trpc/client';
import type { AppRouter } from '../../../api-trpc';

// create persistent WebSocket connection
const wsClient = createWSClient({
    url: `ws://localhost:3333`,
});

// configure TRPCClient to use WebSockets transport
export const ws = createTRPCProxyClient<AppRouter>({
    links: [
        wsLink({
            client: wsClient,
        }),
    ],
});
