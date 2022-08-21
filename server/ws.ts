import { WebSocketServer } from 'ws';

import server from './server';

const wsServer = new WebSocketServer({
  server,
});

export default wsServer;

export function sendToAllClients(message: string) {
  for (const socket of wsServer.clients) {
    socket.send(message);
  }
}
