import EventDispatcherInterface from "./event_dispatcher.interface";
import EventInterface from "./event.interface";
import EventHandlerInterface from "./event_handler.interface";

export default class EventDispatcher implements EventDispatcherInterface {
	private handlers: { [eventName: string]: EventHandlerInterface[] } = {};

	dispatch(event: EventInterface): void {
		if (this.handlers[event.getName()]) {
			this.handlers[event.getName()].forEach((handler) => handler.handle(event));
		}
	}

	register(eventName: string, handler: EventHandlerInterface): void {
		if (!this.handlers[eventName]) {
			this.handlers[eventName] = [];
		}
		this.handlers[eventName].push(handler);
	}

	unregister(eventName: string, handler: EventHandlerInterface): void {
		if (!this.handlers[eventName]) {
			return;
		}
		this.handlers[eventName] = this.handlers[eventName].filter((h) => h !== handler);
	}

	unregisterAll(): void {
		this.handlers = {};
	}

	getHandlers(eventName: string): EventHandlerInterface[] {
		return this.handlers[eventName]
	}

}
