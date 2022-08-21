import { Middleware, ParameterizedContext } from 'koa';

export interface IState {}

export type TContext<Body = unknown> = ParameterizedContext<IState, unknown, Body>;

export type TMiddleware<Body = unknown> = Middleware<IState, TContext, Body>;

export type TQuery<Payload extends object> = {
  [K in keyof Payload]?: string | string[];
};
