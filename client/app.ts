import Application from 'koa';

import { IState, TContext } from './types/koa';

const app = new Application<IState, TContext>();

export default app;
