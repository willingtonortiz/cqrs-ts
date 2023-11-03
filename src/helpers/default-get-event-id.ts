import { IEvent, Type } from "../intefaces";
import { EVENT_METADATA } from "../decorators/constants";

export const defaultGetEventId = <EventBase extends IEvent = IEvent>(
  event: EventBase,
): string | null => {
  const { constructor } = Object.getPrototypeOf(event);
  return Reflect.getMetadata(EVENT_METADATA, constructor)?.id ?? null;
};

export const defaultReflectEventId = <
  EventBase extends Type<IEvent> = Type<IEvent>,
>(
  event: EventBase,
): string => {
  return Reflect.getMetadata(EVENT_METADATA, event).id;
};
