import '../utilities/importEnv';

import bodyParser from 'koa-bodyparser';

import { PermissionsType } from './types/twitch';

import app from './app';
import server from './server';
import { rootNs } from './ws';
import { connect, sendMessage } from './twitch';
import { COMMANDS } from './commands';

const { CLIENT_SECRET, SERVER_PORT } = process.env;
const port = Number(SERVER_PORT);

connect();

app.use(bodyParser());

server.listen(port, '0.0.0.0', () => {
  console.log(`Listening on http://localhost:${port}...`);
});

rootNs.namespace.use((socket, next) => {
  const { 'auth-token': authToken } = socket.handshake.headers;

  if (authToken === CLIENT_SECRET) {
    next();
  } else {
    next(new Error('Wrong token'));
  }
});
rootNs.listen('addDeath', async () => {
  const command = COMMANDS['!adddeath'];
  const response = await command?.response({
    permissions: PermissionsType.OWNER,
  });

  if (response) {
    await sendMessage(response);
  }
});
