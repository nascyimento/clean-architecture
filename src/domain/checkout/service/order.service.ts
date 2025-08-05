import Order from "../entity/order";
import Customer from "../../customer/entity/customer";
import OrderItem from "../entity/order_item";
import { v4 as uuid } from "uuid";

export default class OrderService {
	static placeOrder(customer: Customer, orderItems: OrderItem[]): Order {
		const order = new Order(uuid(), customer.id, orderItems);
		customer.addRewardPoints(order.totalPrice / 2);
		return order;
	}
	static calculateTotalPrice(orders: Order[]): number {
		return orders.reduce((totalPrice, order) => totalPrice + order.totalPrice, 0);
	}
}
