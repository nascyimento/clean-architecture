import CustomerFactory from "./customer.factory";

describe("Customer factory unit tests", () => {
	it("should create a new customer", () => {
		const customer = CustomerFactory.create( "John Doe");
		expect(customer).toBeDefined();
		expect(customer.id).toBeDefined();
		expect(customer.name).toBe("John Doe");
		expect(customer.address).toBeUndefined()
	});

	it("should create a customer with an address", () => {
		const customer = CustomerFactory.createWithAddress("John Doe", "Main St", 123, "Springfield", "12345");
		expect(customer.address).toBeDefined()
		expect(customer.address.street).toBe("Main St");
		expect(customer.address.number).toBe(123);
		expect(customer.address.city).toBe("Springfield");
		expect(customer.address.zip).toBe("12345");
	});
});
