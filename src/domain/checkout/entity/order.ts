import OrderItem from "./order_item";

export default class Order {
	private _id: string;
	private _customerId: string;
	private _items: OrderItem[];

	constructor(id: string, customerId: string, items: OrderItem[]) {
		this._id = id;
		this._customerId = customerId;
		this._items = items;

		this.validate();
	}

	validate() {
		if (!this._id) {
			throw new Error("Id is required");
		}
		if (!this._customerId) {
			throw new Error("Customer Id is required");
		}
		if (!this._items.length) {
			throw new Error("Items are required");
		}
	}

	get id() {
		return this._id;
	}

	get customerId() {
		return this._customerId;
	}

	getItems() {
		return this._items;
	}

	addItems(...items: OrderItem[]): void {
		this._items.push(...items);
	}

	get totalPrice() {
		return this._items.reduce((acc, item) => acc + item.price * item.quantity, 0);
	}
}
