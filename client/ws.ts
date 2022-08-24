import { Server } from 'socket.io';
import { io, Socket } from 'socket.io-client';

import { ClientEvents as LocalClientEvents, ServerEvents as LocalServerEvents } from './types/sockets';
import { ClientEvents as RemoteClientEvents, ServerEvents as RemoteServerEvents } from '../server/types/sockets';

import WebSocketNamespace from '../utilities/WebSocketNamespace';

import server from './server';

const { SERVER_PORT, SERVER_HOSTNAME } = process.env;

export const wsServer = new Server(server);

export const rootNs = new WebSocketNamespace<LocalClientEvents, LocalServerEvents>(wsServer.of('/'));

export const wsClient: Socket<RemoteServerEvents, RemoteClientEvents> = io(`http://${SERVER_HOSTNAME}:${SERVER_PORT}`, {
  extraHeaders: {
    'auth-token': process.env.CLIENT_SECRET ?? '',
  },
});
