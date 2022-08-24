import { TMiddleware } from '../types/koa';

import { wsClient } from '../ws';

export const addDeath: TMiddleware = async (ctx) => {
  console.log('add death');
  wsClient.emit('addDeath');

  ctx.body = '';
};
