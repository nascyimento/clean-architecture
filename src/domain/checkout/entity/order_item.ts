export default class OrderItem {
	private readonly _id: string;
	private readonly _productId: string;
	private readonly _name: string;
	private readonly _price: number;
	private readonly _quantity: number;

	constructor(id: string, productId: string, name: string, price: number, quantity: number) {
		this._id = id;
		this._productId = productId;
		this._name = name;
		this._price = price;
		this._quantity = quantity;

		this.validate()
	}

	get id(): string {
		return this._id;
	}

	get productId(): string {
		return this._productId;
	}

	get name(): string {
		return this._name;
	}

	get price(): number {
		return this._price;
	}

	get quantity(): number {
		return this._quantity;
	}

	validate() {
		if (!this._id) {
			throw new Error("Id is required");
		}
		if (!this._productId) {
			throw new Error("Product Id is required");
		}
		if (!this._name) {
			throw new Error("Name is required");
		}
		if (this._price <= 0) {
			throw new Error("Price is required and must be greater than 0");
		}
		if (this._quantity <= 0) {
			throw new Error("Quantity is required and must be greater than 0");
		}
	}
}
