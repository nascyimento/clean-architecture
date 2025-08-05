import EventInterface from "../../@shared/event/event.interface";

export default class ProductCreatedEvent implements EventInterface {
	payload: any;
	time: Date;
	private name = "product.created";

	constructor(payload: any) {
		this.payload = payload;
		this.time = new Date();
	}

	getName(): string {
		return this.name;
	}
}
