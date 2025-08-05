import OrderItem from "./order_item";

describe("OrderItem unit tests", () => {
	it ("should throw error when id is empty", () => {
		expect(() => {
			new OrderItem("", "123", "product1", 100, 1);
		}).toThrowError("Id is required");
	})

	it ("should throw error when product id is empty", () => {
		expect(() => {
			new OrderItem("1", "", "product1", 100, 1);
		}).toThrowError("Product Id is required");
	})

	it ("should throw error when name is empty", () => {
		expect(() => {
			new OrderItem("1", "123", "", 100, 1);
		}).toThrowError("Name is required");
	})

	it ("should throw error when price is empty", () => {
		expect(() => {
			new OrderItem("1", "123", "product1", 0, 1);
		}).toThrowError("Price is required and must be greater than 0");
	})

	it ("should throw error when price is negative", () => {
		expect(() => {
			new OrderItem("1", "123", "product1", -100, 1);
		}).toThrowError("Price is required and must be greater than 0");
	})

	it ("should throw error when quantity is empty", () => {
		expect(() => {
			new OrderItem("1", "123", "product1", 100, 0);
		}).toThrowError("Quantity is required and must be greater than 0");
	})


})
