import { TMiddleware } from '../types/koa';

import { rootNs } from '../ws';

export const startBoss: TMiddleware = async (ctx) => {
  console.log('start boss', ctx.query.bossName);
  rootNs.emit('stopMusic');

  ctx.body = '';
};

export const endBoss: TMiddleware = async (ctx) => {
  console.log('end boss', ctx.query.bossName);
  rootNs.emit('startMusic');

  ctx.body = '';
};
