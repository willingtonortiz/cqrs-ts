import { Subject } from "rxjs";
import { IEvent, IEventPublisher, IMessageSource } from "../intefaces";

export class DefaultPubSub<EventBase extends IEvent>
  implements IEventPublisher<EventBase>, IMessageSource<EventBase>
{
  constructor(private subject$: Subject<EventBase>) {}

  publish<T extends EventBase>(event: T) {
    this.subject$.next(event);
  }

  bridgeEventsTo<T extends EventBase>(subject: Subject<T>) {
    this.subject$ = subject as unknown as Subject<EventBase>;
  }
}
