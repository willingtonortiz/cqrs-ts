import { Subscription, defer, filter, mergeMap, catchError } from "rxjs";
import {
  defaultGetEventId,
  defaultReflectEventId,
} from "./helpers/default-get-event-id";
import { DefaultPubSub } from "./helpers/default-pubsub";
import {
  Type,
  IEvent,
  IEventBus,
  IEventHandler,
  IEventPublisher,
} from "./intefaces";
import { ObservableBus } from "./utils/observable-bus";
import { EVENT_HANDLER_METADATA } from "./decorators/constants";

export type EventHandlerType<EventBase extends IEvent = IEvent> = Type<
  IEventHandler<EventBase>
>;

export class EventBus<EventBase extends IEvent = IEvent>
  extends ObservableBus<EventBase>
  implements IEventBus<EventBase>
{
  protected getEventId: (event: EventBase) => string | null;
  protected readonly subscriptions: Subscription[];

  private _publisher!: IEventPublisher<EventBase>;

  constructor() {
    super();
    this.subscriptions = [];
    this.getEventId = defaultGetEventId;
    this.useDefaultPlublisher();
  }

  get publisher(): IEventPublisher<EventBase> {
    return this._publisher;
  }

  set publisher(_publisher: IEventPublisher<EventBase>) {
    this._publisher = _publisher;
  }

  destroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  publish<TEvent extends EventBase, TContext = unknown>(
    event: TEvent,
    context?: TContext,
  ) {
    return this._publisher.publish(event, context);
  }

  publishAll<TEvent extends EventBase, TContext = unknown>(
    events: TEvent[],
    context?: TContext,
  ) {
    if (this._publisher.publishAll) {
      return this._publisher.publishAll(events, context);
    }

    return (events || []).map((event) =>
      this._publisher.publish(event, context),
    );
  }

  bind(handler: IEventHandler<EventBase>, id: string) {
    const stream$ = id ? this.ofEventId(id) : this.subject$;

    const subscription = stream$
      .pipe(
        mergeMap((event) =>
          defer(() => Promise.resolve(handler.handle(event))),
        ),
      )
      .subscribe();

    this.subscriptions.push(subscription);
  }

  register(handlers: EventHandlerType<EventBase>[]) {
    handlers.forEach((handler) => this.registerHandler(handler));
  }

  protected registerHandler(handler: EventHandlerType<EventBase>) {
    // const instance = this.moduleRef 💀;
    const events = this.reflectEvents(handler);
    events.map((event) => this.bind(instance, defaultReflectEventId(event)));
  }

  protected ofEventId(id: string) {
    return this.subject$.pipe(filter((event) => this.getEventId(event) === id));
  }

  private reflectEvents(
    handler: EventHandlerType<EventBase>,
  ): FunctionConstructor[] {
    return Reflect.getMetadata(EVENT_HANDLER_METADATA, handler);
  }

  private useDefaultPlublisher() {
    this._publisher = new DefaultPubSub<EventBase>(this.subject$);
  }
}
