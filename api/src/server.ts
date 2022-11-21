import http from 'http';
import { app } from './app';
import log from './log';

export const httpServer = http.createServer(app);

const port = process.env.PORT || 3333;

httpServer.listen(port, () => log.debug(`Listening on port ${port} 🔥`));
import('./wsServer');
