import ListProductUseCase, { ListProductInputDto } from "./list.product.usecase";
import ProductRepositoryInterface from "../../domain/product/repository/product.repository.interface";
import Product from "../../domain/product/entity/product";

describe("ListProductUseCase unit tests", () => {
    let usecase: ListProductUseCase;
    let mockProductRepository: jest.Mocked<ProductRepositoryInterface>;

    beforeEach(() => {
        mockProductRepository = {
            create: jest.fn(),
            update: jest.fn(),
            findById: jest.fn(),
            findAll: jest.fn(),
        };
        usecase = new ListProductUseCase(mockProductRepository);
    });

    it("should list all products", async () => {
        const product1 = new Product("123", "Product 1", 100);
        const product2 = new Product("456", "Product 2", 200);
        mockProductRepository.findAll.mockResolvedValue([product1, product2]);

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

        expect(mockProductRepository.findAll).toHaveBeenCalledTimes(1);
    });

    it("should return an empty list when no products exist", async () => {
        mockProductRepository.findAll.mockResolvedValue([]);

        const input: ListProductInputDto = {};
        const output = await usecase.execute(input);

        expect(output.products).toHaveLength(0);
        expect(output).toEqual({
            products: []
        });

        expect(mockProductRepository.findAll).toHaveBeenCalledTimes(1);
    });

    it("should list products in the order returned by repository", async () => {
        const product1 = new Product("111", "First Product", 50);
        const product2 = new Product("222", "Second Product", 150);
        const product3 = new Product("333", "Third Product", 250);
        mockProductRepository.findAll.mockResolvedValue([product1, product2, product3]);

        const input: ListProductInputDto = {};
        const output = await usecase.execute(input);

        expect(output.products).toHaveLength(3);
        expect(output.products[0].name).toBe("First Product");
        expect(output.products[1].name).toBe("Second Product");
        expect(output.products[2].name).toBe("Third Product");

        expect(mockProductRepository.findAll).toHaveBeenCalledTimes(1);
    });
});
