import "reflect-metadata";
import { v4 as uuid } from "@lukeed/uuid";
import { IEvent } from "../intefaces/events/event.interface";
import { EVENT_HANDLER_METADATA, EVENT_METADATA } from "./constants";

export const EventsHandler = (
  ...events: (IEvent | (new (...args: any[]) => IEvent))[]
): ClassDecorator => {
  return (target: object) => {
    events.forEach((event) => {
      if (!Reflect.hasOwnMetadata(EVENT_METADATA, event)) {
        Reflect.defineMetadata(EVENT_METADATA, { id: uuid() }, target);
      }
    });

    Reflect.defineMetadata(EVENT_HANDLER_METADATA, events, target);
  };
};
