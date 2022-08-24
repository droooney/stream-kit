import { Namespace } from 'socket.io';
import { forEach } from 'lodash';

export type EventMap<Event extends string> = Record<Event, (() => any) | ((data: any) => any)>;

export default class WebSocketNamespace<ListenEvents extends EventMap<never>, EmitEvents extends EventMap<never>> {
  namespace: Namespace<ListenEvents, EmitEvents>;
  listeners: { [E in keyof ListenEvents]?: Set<ListenEvents[E]> } = {};

  constructor(namespace: Namespace<ListenEvents, EmitEvents>) {
    this.namespace = namespace;

    this.namespace.on('connection', (socket) => {
      forEach(this.listeners, (listeners, event) => {
        listeners?.forEach((listener) => {
          socket.on(event as any, listener);
        });
      });
    });
  }

  emit<E extends keyof EmitEvents & string>(
    event: E,
    ...args: EmitEvents[E] extends (...args: any[]) => any ? Parameters<EmitEvents[E]> : never
  ): void {
    this.namespace.emit(event, ...args);
  }

  listen<E extends keyof ListenEvents & string>(event: E, listener: ListenEvents[E]): () => void {
    const { sockets } = this.namespace;

    sockets.forEach((socket) => {
      socket.on(event, listener as any);
    });

    (this.listeners[event] ||= new Set())?.add(listener);

    return () => {
      sockets.forEach((socket) => {
        socket.off(event, listener as any);
      });

      (this.listeners[event] ??= new Set())?.delete(listener);
    };
  }

  waitForEvent<E extends keyof ListenEvents & string>(
    event: E,
  ): Promise<ListenEvents[E] extends (...args: any[]) => any ? Parameters<ListenEvents[E]>[0] : never> {
    return new Promise((resolve) => {
      const unsubscribe = this.listen(event, ((data: any) => {
        unsubscribe();

        resolve(data);
      }) as any);
    });
  }
}
