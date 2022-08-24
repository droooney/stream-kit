import '../utilities/importEnv';

import bodyParser from 'koa-bodyparser';

import app from './app';
import server from './server';
import { rootNs } from './ws';
import { connect, sendMessage } from './twitch';
import { COMMANDS } from './commands';

const { SERVER_PORT } = process.env;
const port = Number(SERVER_PORT);

connect();

app.use(bodyParser());

server.listen(port, '0.0.0.0', () => {
  console.log(`Listening on http://localhost:${port}...`);
});

rootNs.listen('addDeath', async () => {
  const command = COMMANDS['!adddeath'];
  const response = await command?.response();

  if (response) {
    await sendMessage(response);
  }
});
