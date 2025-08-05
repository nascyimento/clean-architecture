import OrderRepositoryInterface from "../../../../domain/checkout/repository/order.repository.interface";
import Order from "../../../../domain/checkout/entity/order";
import OrderModel from "./model/order.model";
import OrderItemModel from "./model/order_item.model";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import sequelize from "sequelize"


export default class OrderRepository implements OrderRepositoryInterface {
	async create(entity: Order): Promise<void> {
		try {
			await OrderModel.create({
				id: entity.id,
				customer_id: entity.customerId,
				total: entity.totalPrice,
				items: entity.getItems().map((item) => ({
					id: item.id,
					product_id: item.productId,
					quantity: item.quantity,
					name: item.name,
					price: item.price,
				})),
			}, {include: [{model: OrderItemModel}]});
		} catch (error) {
			console.error("Error creating order: " + error);
			console.error(error)
			throw error
		}
	}

	async findAll(): Promise<Order[]> {
		const orders = await OrderModel.findAll({include: ["items"]});
		return orders.map((order) => {
			const items = order.items.map((item) => new OrderItem(item.id, item.product_id, item.name, item.price, item.quantity));
			return new Order(order.id, order.customer_id, items);
		});
	}

	async findById(id: string): Promise<Order> {
		try {
			const order = await OrderModel.findOne({where: {id}, include: ["items"]});
			const items = order.items.map((item) => new OrderItem(item.id, item.product_id, item.name, item.price, item.quantity));
			return new Order(order.id, order.customer_id, items);
		} catch (error) {
			console.error(`Error finding order with id ${id}: ${error} `)
			throw error
		}
	}

	async update(entity: Order): Promise<void> {
		const transaction = await OrderModel.sequelize.transaction()

		try {
			const order = await OrderModel.findByPk(entity.id, {transaction});
			if (!order) {
				throw new Error("Order not found");
			}
			await order.update({
				customer_id: entity.customerId,
				total: entity.totalPrice,
			}, {transaction});

			for (const itemData of entity.getItems()) {
				await OrderItemModel.upsert({
					id: itemData.id,
					order_id: entity.id,
					product_id: itemData.productId,
					quantity: itemData.quantity,
					name: itemData.name,
					price: itemData.price,
				}, {
					transaction
				});
			}

			const itemIds = entity.getItems().map(item => item.id);
			await OrderItemModel.destroy({
				where: {
					[sequelize.Op.and]: [
						{order_id: entity.id},
						{id: {[sequelize.Op.notIn]: itemIds}}
					]
				},
				transaction
			});

			await transaction.commit();

		} catch (error) {
			await transaction.rollback();
			console.error("Error updating order:", error);
			throw error
		}
	}
}
