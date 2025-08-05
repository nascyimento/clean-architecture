import OrderFactory from "./order.factory";

describe("Order factory unit tests", () => {
	it("should create an order", () => {
		const orderProperties = {
			id: "o1",
			customerId: "c1",
			items: [
				{
					id: "p1",
					productId: "p1",
					name: "Product 1",
					quantity: 1,
					price: 10,
				}
			]
		}
		const order = OrderFactory.create(orderProperties);
		expect(order.id).toBe(orderProperties.id);
		expect(order.customerId).toBe(orderProperties.customerId);
		expect(order.getItems().length).toBe(orderProperties.items.length);
	});
});
