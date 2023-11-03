import { IEvent } from "./event.interface";

export interface IEventBus<EventBase extends IEvent = IEvent> {
  publish<TEvent extends EventBase, TContext = unknown>(
    event: TEvent,
    context?: TContext,
  ): any;

  publishAll<TEvent extends EventBase, TContext = unknown>(
    events: TEvent[],
    context?: TContext,
  ): any;
}
