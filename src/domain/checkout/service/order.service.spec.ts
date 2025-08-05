import Order from "../entity/order";
import OrderItem from "../entity/order_item";
import OrderService from "./order.service";
import Customer from "../../customer/entity/customer";

describe("OrderService unit tests", () => {
	it("should place an order", () => {
		const customer = new Customer("c1", "John Doe");
		const orderItem1 = new OrderItem("i1", "c1", "Product 1", 100, 1);

		const order = OrderService.placeOrder(customer, [orderItem1]);

		expect(customer.rewardPoints).toBe(50)
		expect(order.totalPrice).toBe(100);
	});

	it("should calculate the total price of all orders", () => {
		// arrange
		const orderItem1 = new OrderItem("1", "1", "Product 1", 100, 1);
		const orderItem2 = new OrderItem("2", "2", "Product 2", 200, 2);
		const order1 = new Order("1", "Order 1", [orderItem1, orderItem2]);
		const orderItem3 = new OrderItem("3", "3", "Product 3", 300, 3);
		const orderItem4 = new OrderItem("4", "4", "Product 4", 400, 4);
		const order2 = new Order("2", "Order 2", [orderItem3, orderItem4]);

		// act
		const orders = [order1, order2];

		// assert
		expect(OrderService.calculateTotalPrice(orders)).toBe(3000);
	})
});
