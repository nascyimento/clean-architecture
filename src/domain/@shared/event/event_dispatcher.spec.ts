import SendEmailWhenProductIsCreatedHandler from "../../product/event/handler/send_email_when_product_is_created.handler";
import EventDispatcher from "./event_dispatcher";
import ProductCreatedEvent from "../../product/event/product_created.event";

describe("Domain Event unit tests", () => {
	it("should register event handlers", () => {
		const eventDispatcher = new EventDispatcher();
		const eventHandler = new SendEmailWhenProductIsCreatedHandler();

		eventDispatcher.register("product.created", eventHandler);

		expect(eventDispatcher.getHandlers("product.created")).toEqual([eventHandler]);
	});

	it("should unregister event handlers", () => {
		const eventDispatcher = new EventDispatcher();
		const eventHandler = new SendEmailWhenProductIsCreatedHandler();

		eventDispatcher.register("product.created", eventHandler);
		eventDispatcher.unregister("product.created", eventHandler);

		expect(eventDispatcher.getHandlers("product.created")).toEqual([]);
	});

	it("should unregister all event handlers", () => {
		const eventDispatcher = new EventDispatcher();
		const eventHandler = new SendEmailWhenProductIsCreatedHandler();

		eventDispatcher.register("product.created", eventHandler);
		eventDispatcher.unregisterAll();

		expect(eventDispatcher.getHandlers("product.created")).toBeUndefined()
	});

	it("should dispatch event", () => {
		const eventDispatcher = new EventDispatcher();
		const eventHandler = new SendEmailWhenProductIsCreatedHandler();
		const event = new ProductCreatedEvent({
			name: "Product 1",
			price: 100
		});
		const spyEventHandler = jest.spyOn(eventHandler, "handle");

		eventDispatcher.register("product.created", eventHandler);
		eventDispatcher.dispatch(event);

		expect(spyEventHandler).toHaveBeenCalledWith(event);
	});
});
