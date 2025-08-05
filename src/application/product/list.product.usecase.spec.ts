import { Sequelize } from "sequelize-typescript";
import ListProductUseCase, { ListProductInputDto } from "./list.product.usecase";
import ProductModel from "../../infra/product/repository/model/product.model";
import ProductRepository from "../../infra/product/repository/product.repository";
import Product from "../../domain/product/entity/product";

describe("Test list product use case", () => {
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

    it("should list all products", async () => {
        const productRepository = new ProductRepository();
        const usecase = new ListProductUseCase(productRepository);
        
        // Create products first
        const product1 = new Product("123", "Product 1", 100);
        await productRepository.create(product1);

        const product2 = new Product("456", "Product 2", 200);
        await productRepository.create(product2);

        const input: ListProductInputDto = {};
        const output = await usecase.execute(input);

        expect(output.products).toHaveLength(2);
        expect(output).toEqual({
            products: [
                {
                    id: "123",
                    name: "Product 1",
                    price: 100
                },
                {
                    id: "456",
                    name: "Product 2",
                    price: 200
                }
            ]
        });
    });

    it("should return an empty list when no products exist", async () => {
        const productRepository = new ProductRepository();
        const usecase = new ListProductUseCase(productRepository);

        const input: ListProductInputDto = {};
        const output = await usecase.execute(input);

        expect(output.products).toHaveLength(0);
        expect(output).toEqual({
            products: []
        });
    });

    it("should list products in the order they were created", async () => {
        const productRepository = new ProductRepository();
        const usecase = new ListProductUseCase(productRepository);
        
        // Create products in specific order
        const product1 = new Product("111", "First Product", 50);
        await productRepository.create(product1);

        const product2 = new Product("222", "Second Product", 150);
        await productRepository.create(product2);

        const product3 = new Product("333", "Third Product", 250);
        await productRepository.create(product3);

        const input: ListProductInputDto = {};
        const output = await usecase.execute(input);

        expect(output.products).toHaveLength(3);
        expect(output.products[0].name).toBe("First Product");
        expect(output.products[1].name).toBe("Second Product");
        expect(output.products[2].name).toBe("Third Product");
    });
});
