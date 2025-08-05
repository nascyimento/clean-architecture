import Product from "../entity/product";
import ProductService from "./product.service";

describe("ProductService unit tests", () => {
	it("should change the price of all products in the order", () => {
		// Arrange

		const product1 = new Product("1", "Product 1", 100);
		const product2 = new Product("2", "Product 2", 200);
		const products = [product1, product2];

		// Act
		ProductService.increasePrice(products, 10);

		// Assert
		expect(product1.price).toBe(110);
		expect(product2.price).toBe(220);
	});
});
