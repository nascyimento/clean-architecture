import EventInterface from "./event.interface";
import EventHandlerInterface from "./event_handler.interface";

export default interface EventDispatcherInterface {
	dispatch(event: EventInterface): void;
	register(eventName: string, handler: EventHandlerInterface): void;
	unregister(eventName: string, handler: EventHandlerInterface): void;
	unregisterAll(): void;
}
