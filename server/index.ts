import '../utilities/importEnv';

import bodyParser from 'koa-bodyparser';

import app from './app';
import server from './server';
import ws from './ws';
import { connect } from './twitch';

const { SERVER_PORT } = process.env;
const port = Number(SERVER_PORT);

connect();

app.use(bodyParser());

ws.on('connection', () => {
  console.log('socked connected');
});

server.listen(port, '0.0.0.0', () => {
  console.log(`Listening on http://localhost:${port}...`);
});
