import {Sequelize} from "sequelize-typescript";
import CustomerModel from "../../../customer/repository/model/customer.model";
import OrderModel from "./model/order.model";
import ProductModel from "../../../product/repository/model/product.model";
import OrderItemModel from "./model/order_item.model";
import Customer from "../../../../domain/customer/entity/customer";
import Address from "../../../../domain/customer/value-object/address";
import CustomerRepository from "../../../customer/repository/customer.repository";
import ProductRepository from "../../../product/repository/product.repository";
import Product from "../../../../domain/product/entity/product";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import Order from "../../../../domain/checkout/entity/order";
import OrderRepository from "./order.repository";

describe("Order repository test", () => {
	let sequelize: Sequelize;

	beforeEach(async () => {
		sequelize = new Sequelize({
			dialect: "sqlite",
			storage: ":memory:",
			logging: false,
			sync: {force: true},
		});

		sequelize.addModels([CustomerModel, OrderModel, OrderItemModel, ProductModel,]);
		await sequelize.sync();
	});

	afterEach(async () => {
		await sequelize.close();
	});

	it("should create a new order", async () => {
		let {
			customer,
			customerRepository,
			product1,
			product2,
			productRepository,
			orderItem1,
			orderItem2,
			order1,
			orderRepository
		} = prepareOrderRepositoryTest();

		await customerRepository.create(customer);
		await productRepository.create(product1);
		await productRepository.create(product2);
		await orderRepository.create(order1);

		const orderModel = await OrderModel.findOne({where: {id: order1.id}, include: ["items"]});

		expect(orderModel.toJSON()).toStrictEqual({
			id: order1.id,
			customer_id: customer.id,
			total: order1.totalPrice,
			items: [
				{
					id: orderItem1.id,
					order_id: order1.id,
					product_id: orderItem1.productId,
					quantity: orderItem1.quantity,
					name: orderItem1.name,
					price: orderItem1.price,
				},
				{
					id: orderItem2.id,
					order_id: order1.id,
					product_id: orderItem2.productId,
					quantity: orderItem2.quantity,
					name: orderItem2.name,
					price: orderItem2.price,
				}
			]
		});
	});

	it("should find all orders", async () => {
		let {
			customer,
			customerRepository,
			product1,
			product2,
			productRepository,
			order1,
			order2,
			orderRepository
		} = prepareOrderRepositoryTest();

		await productRepository.create(product1);
		await customerRepository.create(customer);
		await productRepository.create(product2);
		await orderRepository.create(order1);
		await orderRepository.create(order2);

		const orders = await orderRepository.findAll();

		expect(orders).toEqual([order1, order2]);
	});

	it("should find order by id", async () => {
		let {
			customer,
			customerRepository,
			product1,
			product2,
			productRepository,
			order1,
			order2,
			orderRepository,
		} = prepareOrderRepositoryTest();

		await customerRepository.create(customer);
		await productRepository.create(product1);
		await productRepository.create(product2);
		await orderRepository.create(order1);
		await orderRepository.create(order2);

		const order = await orderRepository.findById(order1.id);

		expect(order).toEqual(order1);
	});

	it("should update order without side effects", async () => {
		let {
			customer,
			customerRepository,
			product1,
			product2,
			productRepository,
			order1,
			order2,
			orderRepository
		} = prepareOrderRepositoryTest();

		await productRepository.create(product1);
		await customerRepository.create(customer);
		await productRepository.create(product2);
		await orderRepository.create(order1);
		await orderRepository.create(order2);

		const orderItem4 = new OrderItem("oi4", product2.id, product2.name, product2.price, 4);
		const orderItem5 = new OrderItem("oi5", product1.id, product1.name, product1.price, 5);

		order1.addItems(orderItem4, orderItem5);
		await orderRepository.update(order1);
		const updatedOrder1 = await orderRepository.findById(order1.id);
		expect(updatedOrder1).toEqual(order1);

		const foundOrder2 = await orderRepository.findById(order2.id);
		expect(foundOrder2).toEqual(order2);
	});
});


function prepareOrderRepositoryTest() {

	const productRepository = new ProductRepository();
	const orderRepository = new OrderRepository();
	const customerRepository = new CustomerRepository();

	const customer = new Customer("c1", "Customer 1");
	const address = new Address("Street 1", 1, "City 1", "Zipcode 1");
	customer.changeAddress(address);
	customer.activate()

	const product1 = new Product("p1", "Product 1", 100);
	const product2 = new Product("p2", "Product 2", 200);

	const orderItem1 = new OrderItem("oi1", product1.id, product1.name, product1.price, 2);
	const orderItem2 = new OrderItem("oi2", product2.id, product2.name, product2.price, 3);
	const order1 = new Order("o1", customer.id, [orderItem1, orderItem2]);

	const orderItem3 = new OrderItem("oi3", product1.id, product1.name, product1.price, 1);
	const order2 = new Order("o2", customer.id, [orderItem3]);

	return {
		productRepository,
		orderRepository,
		customerRepository,
		customer,
		address,
		product1,
		product2,
		orderItem1,
		orderItem2,
		order1,
		orderItem3,
		order2
	}
}
