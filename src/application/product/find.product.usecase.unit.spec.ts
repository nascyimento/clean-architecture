import FindProductUseCase, { FindProductInputDto } from "./find.product.usecase";
import ProductRepositoryInterface from "../../domain/product/repository/product.repository.interface";
import Product from "../../domain/product/entity/product";

describe("FindProductUseCase unit tests", () => {
    let usecase: FindProductUseCase;
    let mockProductRepository: jest.Mocked<ProductRepositoryInterface>;

    beforeEach(() => {
        mockProductRepository = {
            create: jest.fn(),
            update: jest.fn(),
            findById: jest.fn(),
            findAll: jest.fn(),
        };
        usecase = new FindProductUseCase(mockProductRepository);
    });

    it("should find a product by id", async () => {
        const product = new Product("123", "Product 1", 100);
        mockProductRepository.findById.mockResolvedValue(product);

        const input: FindProductInputDto = { id: "123" };
        const output = await usecase.execute(input);

        expect(output).toEqual({
            id: "123",
            name: "Product 1",
            price: 100
        });

        expect(mockProductRepository.findById).toHaveBeenCalledTimes(1);
        expect(mockProductRepository.findById).toHaveBeenCalledWith("123");
    });

    it("should throw an error if product not found", async () => {
        mockProductRepository.findById.mockResolvedValue(null);

        const input: FindProductInputDto = { id: "999" };
        
        await expect(usecase.execute(input)).rejects.toThrow("Product not found");
        expect(mockProductRepository.findById).toHaveBeenCalledTimes(1);
        expect(mockProductRepository.findById).toHaveBeenCalledWith("999");
    });
});
