import { Sequelize } from "sequelize-typescript";
import FindProductUseCase, { FindProductInputDto } from "./find.product.usecase";
import ProductModel from "../../infra/product/repository/model/product.model";
import ProductRepository from "../../infra/product/repository/product.repository";
import Product from "../../domain/product/entity/product";

describe("Test find product use case", () => {
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

    it("should find a product by id", async () => {
        const productRepository = new ProductRepository();
        const usecase = new FindProductUseCase(productRepository);
        const product = new Product("123", "Product 1", 100);
        await productRepository.create(product);

        const input: FindProductInputDto = { id: "123" };
        const output = await usecase.execute(input);

        expect(output).toEqual({
            id: "123",
            name: "Product 1",
            price: 100
        });
    });

    it("should throw an error if product not found", async () => {
        const productRepository = new ProductRepository();
        const usecase = new FindProductUseCase(productRepository);

        const input: FindProductInputDto = { id: "999" };
        await expect(usecase.execute(input)).rejects.toThrow("Product not found");
    });
});
