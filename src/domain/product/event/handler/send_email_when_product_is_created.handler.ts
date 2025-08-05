import EventHandlerInterface from "../../../@shared/event/event_handler.interface";
import EventInterface from "../../../@shared/event/event.interface";
import ProductCreatedEvent from "../product_created.event";

export default class SendEmailWhenProductIsCreatedHandler implements EventHandlerInterface<ProductCreatedEvent> {
	handle(event: ProductCreatedEvent): void {
		console.log('Sending email...');
	}
}
