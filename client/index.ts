import '../utilities/importEnv';

import path from 'node:path';

import bodyParser from 'koa-bodyparser';
import mount from 'koa-mount';
import serve from 'koa-static';

import app from './app';
import server from './server';
import routes from './routes';

const PORT = 3883;

app.use(mount('/public', serve(path.resolve('./client/public'))));
app.use(bodyParser());
app.use(mount('/api', routes.routes()));

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Listening on http://localhost:${PORT}...`);
});
