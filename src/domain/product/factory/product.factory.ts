import ProductInterface from "../entity/product.interface";
import Product from "../entity/product";
import ProductB from "../entity/product_b";

export default class ProductFactory {
	static create(type: string, id: string, name: string, price: number): ProductInterface {
		if (type === 'a') {
			return new Product(id, name, price);
		} else if (type === 'b') {
			return new ProductB(id, name, price);
		} else {
			throw new Error("Invalid product type");
		}
	}
}
