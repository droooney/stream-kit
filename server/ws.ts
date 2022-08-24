import { Server } from 'socket.io';

import { ClientEvents, ServerEvents } from './types/sockets';

import WebSocketNamespace from '../utilities/WebSocketNamespace';

import server from './server';

export const wsServer = new Server(server);

export const rootNs = new WebSocketNamespace<ClientEvents, ServerEvents>(wsServer.of('/'));
