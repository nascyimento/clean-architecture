import { Sequelize } from "sequelize-typescript";
import UpdateProductUseCase, { UpdateProductInputDto } from "./update.product.usecase";
import ProductModel from "../../infra/product/repository/model/product.model";
import ProductRepository from "../../infra/product/repository/product.repository";
import Product from "../../domain/product/entity/product";

describe("Test update product use case", () => {
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true },
        });

        sequelize.addModels([ProductModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it("should update a product", async () => {
        const productRepository = new ProductRepository();
        const usecase = new UpdateProductUseCase(productRepository);
        
        // Create a product first
        const product = new Product("123", "Product 1", 100);
        await productRepository.create(product);

        const input: UpdateProductInputDto = {
            id: "123",
            name: "Product 1 Updated",
            price: 150
        };

        const output = await usecase.execute(input);

        expect(output).toEqual({
            id: "123",
            name: "Product 1 Updated",
            price: 150
        });
    });

    it("should throw an error when product is not found", async () => {
        const productRepository = new ProductRepository();
        const usecase = new UpdateProductUseCase(productRepository);

        const input: UpdateProductInputDto = {
            id: "999",
            name: "Product 1",
            price: 100
        };

        await expect(usecase.execute(input)).rejects.toThrow("Product not found");
    });

    it("should throw an error when product name is empty", async () => {
        const productRepository = new ProductRepository();
        const usecase = new UpdateProductUseCase(productRepository);
        
        // Create a product first
        const product = new Product("123", "Product 1", 100);
        await productRepository.create(product);

        const input: UpdateProductInputDto = {
            id: "123",
            name: "",
            price: 100
        };

        await expect(usecase.execute(input)).rejects.toThrow("Name is required");
    });

    it("should throw an error when product price is zero", async () => {
        const productRepository = new ProductRepository();
        const usecase = new UpdateProductUseCase(productRepository);
        
        // Create a product first
        const product = new Product("123", "Product 1", 100);
        await productRepository.create(product);

        const input: UpdateProductInputDto = {
            id: "123",
            name: "Product 1",
            price: 0
        };

        await expect(usecase.execute(input)).rejects.toThrow("Price is required and must be greater than 0");
    });

    it("should throw an error when product price is negative", async () => {
        const productRepository = new ProductRepository();
        const usecase = new UpdateProductUseCase(productRepository);
        
        // Create a product first
        const product = new Product("123", "Product 1", 100);
        await productRepository.create(product);

        const input: UpdateProductInputDto = {
            id: "123",
            name: "Product 1",
            price: -50
        };

        await expect(usecase.execute(input)).rejects.toThrow("Price is required and must be greater than 0");
    });
});
