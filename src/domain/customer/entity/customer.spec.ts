import Customer from "./customer";
import Address from "../value-object/address";

describe("Customer unit tests", () => {
	it("should throw error when id is empty", () => {
		expect(() => new Customer("", "John"))
			.toThrowError('Id is required');
	});

	it("should throw error when name is empty", () => {
		expect(() => new Customer("1", ""))
			.toThrowError('Name is required');
	});

	it("should change name", () => {
		const customer = new Customer("1", "John");
		customer.changeName("Jane");
		expect(customer.name).toBe("Jane");
	});

	it("should not change name when empty", () => {
		const customer = new Customer("1", "John");
		expect(() => customer.changeName(""))
			.toThrowError('Name is required');
	});

	it("should activate customer", () => {
		const customer = new Customer("1", "John");
		customer.address = new Address("St 1", 256, "New York", "12356")
		customer.activate();
		expect(customer.isActive()).toBe(true);
	});

	it("should throw error when activating without address", () => {
		const customer = new Customer("1", "John");
		expect(() => customer.activate())
			.toThrowError('Address is mandatory to activate customer');
	});

	it("should deactivate customer", () => {
		const customer = new Customer("1", "John");
		customer.deactivate();
		expect(customer.isActive()).toBe(false);
	});

	it("should add reward points", () => {
		const customer = new Customer("1", "John");
		expect(customer.rewardPoints).toBe(0);
		customer.addRewardPoints(100);
		expect(customer.rewardPoints).toBe(100);

		customer.addRewardPoints(200);
		expect(customer.rewardPoints).toBe(300);
	});

	it("should throw error when adding negative points", () => {
		const customer = new Customer("1", "John");
		expect(() => customer.addRewardPoints(-100))
			.toThrowError('Points should be positive');
	});
});
