import { TMiddleware } from '../types/koa';

import { sendToAllClients } from '../ws';

export const startBoss: TMiddleware = async (ctx) => {
  console.log('start boss', ctx.query.bossName);
  sendToAllClients('stopMusic');

  ctx.body = '';
};

export const endBoss: TMiddleware = async (ctx) => {
  console.log('end boss', ctx.query.bossName);
  sendToAllClients('startMusic');

  ctx.body = '';
};
