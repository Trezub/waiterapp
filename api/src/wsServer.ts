import { applyWSSHandler } from '@trpc/server/adapters/ws';
import ws from 'ws';
import log from './log';
import { appRouter } from './routers/_appRouter';
import { httpServer } from './server';

const wss = new ws.Server({
    server: httpServer,
});

const handler = applyWSSHandler({ wss, router: appRouter });

wss.on('connection', (ws) => {
    log.debug(`➕➕ Connection (${wss.clients.size})`);
    ws.once('close', () => {
        log.debug(`➖➖ Connection (${wss.clients.size})`);
    });
});
log.debug('WebSocket Server listening ✅');

process.on('SIGTERM', () => {
    log.debug('SIGTERM');
    handler.broadcastReconnectNotification();
    wss.close();
});