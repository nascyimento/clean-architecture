import Order from './order';
import OrderItem from './order_item';

describe('Order unit tests', () => {

	it('should create an order with given id, customerId, and items', () => {
		const orderItemMock = new OrderItem('1', 'product1', 'product1', 100, 1);
		const order = new Order('1', 'customer1', [orderItemMock]);

		expect(order.id).toBe('1');
		expect(order.customerId).toBe('customer1');
		expect(order.getItems()).toEqual([orderItemMock]);
	});

	it("should throw an error when the id is empty", () => {
		const orderItemMock = new OrderItem('1', 'product1', 'product1', 100, 1);
		expect(() => new Order("", "customer1", [orderItemMock])).toThrowError("Id is required");
	});

	it("should throw an error when the customer id is empty", () => {
		const orderItemMock = new OrderItem('1', 'product1', 'product1', 100, 1);
		expect(() => new Order("1", "", [orderItemMock])).toThrowError("Customer Id is required");
	});

	it("should throw an error when there are no items", () => {
		expect(() => new Order("1", "customer1", [])).toThrowError("Items are required");
	});

	it('should calculate the total price of the order', () => {
		const orderItemMock = new OrderItem('1', 'product1', 'product1', 100, 2);
		const orderItemMock2 = new OrderItem('2', 'product2', 'product2', 50, 2);

		const order = new Order('1', 'customer1', [orderItemMock, orderItemMock2]);

		expect(order.totalPrice).toBe(300);
	});
});
