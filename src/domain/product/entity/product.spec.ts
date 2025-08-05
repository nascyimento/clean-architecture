import Product from "./product";

describe('Product unit tests', () => {
	it("should throw error when id is empty", () => {
		expect(() => {
			new Product("", "name", 100);
		}).toThrowError("product: Id is required");
	});

	it("should throw error when name is empty", () => {
		expect(() => {
			new Product("id", "", 100);
		}).toThrowError("product: Name is required");
	});

	it("should throw error when price is empty", () => {
		expect(() => {
			new Product("id", "name", 0);
		}).toThrowError("product: Price is required and must be greater than 0");
	});

	it("should throw error when price is negative", () => {
		expect(() => {
			new Product("id", "name", -100);
		}).toThrowError("product: Price is required and must be greater than 0");
	});

	it("should create product when all fields are valid", () => {
		const product = new Product("id", "name", 100);
		expect(product).toBeDefined();
	});

	it("should change product name", () => {
		const product = new Product("id", "name", 100);
		product.changeName("new name")
		expect(product.name).toBe("new name");
	})

	it("should throw error when name is empty after changing name", () => {
		const product = new Product("id", "name", 100);
		expect(() => {
			product.changeName("");
		}).toThrowError("product: Name is required");
	})

	it("should change product price", () => {
		const product = new Product("id", "name", 100);
		product.changePrice(200)
		expect(product.price).toBe(200);
	})

	it("should throw error when price is empty after changing price", () => {
		const product = new Product("id", "name", 100);
		expect(() => {
			product.changePrice(0);
		}).toThrowError("product: Price is required and must be greater than 0");
	})

	it("should throw error with all validation errors", () => {
		expect(() => {
			new Product("", "", 0);
		}).toThrowError("product: Price is required and must be greater than 0, product: Name is required, product: Id is required");
	})

	it("should throw error with multiple validation errors", () => {
		expect(() => {
			new Product("", "name", -10);
		}).toThrowError("product: Price is required and must be greater than 0, product: Id is required");
	})
})
