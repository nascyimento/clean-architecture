import { Sequelize } from "sequelize-typescript";
import CreateProductUseCase, { CreateProductInputDto } from "./create.product.usecase";
import ProductModel from "../../infra/product/repository/model/product.model";
import ProductRepository from "../../infra/product/repository/product.repository";

describe("Test create product use case", () => {
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

    it("should create a product", async () => {
        const productRepository = new ProductRepository();
        const usecase = new CreateProductUseCase(productRepository);

        const input: CreateProductInputDto = {
            name: "Product 1",
            price: 100
        };

        const output = await usecase.execute(input);

        expect(output).toEqual({
            id: expect.any(String),
            name: "Product 1",
            price: 100
        });
    });

    it("should throw an error when product name is missing", async () => {
        const productRepository = new ProductRepository();
        const usecase = new CreateProductUseCase(productRepository);

        const input: CreateProductInputDto = {
            name: "",
            price: 100
        };

        await expect(usecase.execute(input)).rejects.toThrow("Name is required");
    });

    it("should throw an error when product price is zero", async () => {
        const productRepository = new ProductRepository();
        const usecase = new CreateProductUseCase(productRepository);

        const input: CreateProductInputDto = {
            name: "Product 1",
            price: 0
        };

        await expect(usecase.execute(input)).rejects.toThrow("Price is required and must be greater than 0");
    });

    it("should throw an error when product price is negative", async () => {
        const productRepository = new ProductRepository();
        const usecase = new CreateProductUseCase(productRepository);

        const input: CreateProductInputDto = {
            name: "Product 1",
            price: -10
        };

        await expect(usecase.execute(input)).rejects.toThrow("Price is required and must be greater than 0");
    });
});
