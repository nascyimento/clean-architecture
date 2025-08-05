import ProductFactory from "./product.factory";

describe('Product factory unit tests', () => {

	it("should create a product type a", () => {
		const product = ProductFactory.create("a", "id", "name", 100);
		expect(product).toBeDefined();
		expect(product.id).toBe("id");
		expect(product.name).toBe("name");
		expect(product.price).toBe(100);
		expect(product.constructor.name).toBe("Product")
	});

	it("should create a product type b", () => {
		const product = ProductFactory.create("b", "id", "name", 100);
		expect(product).toBeDefined();
		expect(product.id).toBe("id");
		expect(product.name).toBe("name");
		expect(product.price).toBe(200);
		expect(product.constructor.name).toBe("ProductB")
	});

	it("should throw error when type is invalid", () => {
		expect(() => {
			ProductFactory.create("c", "id", "name", 100);
		}).toThrowError("Invalid product type");
	});
});
