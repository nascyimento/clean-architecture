import UpdateProductUseCase, { UpdateProductInputDto } from "./update.product.usecase";
import ProductRepositoryInterface from "../../domain/product/repository/product.repository.interface";
import Product from "../../domain/product/entity/product";

describe("UpdateProductUseCase unit tests", () => {
    let usecase: UpdateProductUseCase;
    let mockProductRepository: jest.Mocked<ProductRepositoryInterface>;

    beforeEach(() => {
        mockProductRepository = {
            create: jest.fn(),
            update: jest.fn(),
            findById: jest.fn(),
            findAll: jest.fn(),
        };
        usecase = new UpdateProductUseCase(mockProductRepository);
    });

    it("should update a product", async () => {
        const product = new Product("123", "Product 1", 100);
        mockProductRepository.findById.mockResolvedValue(product);

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

        expect(mockProductRepository.findById).toHaveBeenCalledTimes(1);
        expect(mockProductRepository.findById).toHaveBeenCalledWith("123");
        expect(mockProductRepository.update).toHaveBeenCalledTimes(1);
        expect(mockProductRepository.update).toHaveBeenCalledWith(product);
    });

    it("should throw an error when product is not found", async () => {
        mockProductRepository.findById.mockResolvedValue(null);

        const input: UpdateProductInputDto = {
            id: "999",
            name: "Product 1",
            price: 100
        };

        await expect(usecase.execute(input)).rejects.toThrow("Product not found");
        expect(mockProductRepository.findById).toHaveBeenCalledTimes(1);
        expect(mockProductRepository.findById).toHaveBeenCalledWith("999");
        expect(mockProductRepository.update).not.toHaveBeenCalled();
    });

    it("should throw an error when product name is empty", async () => {
        const product = new Product("123", "Product 1", 100);
        mockProductRepository.findById.mockResolvedValue(product);

        const input: UpdateProductInputDto = {
            id: "123",
            name: "",
            price: 100
        };

        await expect(usecase.execute(input)).rejects.toThrow("Name is required");
        expect(mockProductRepository.findById).toHaveBeenCalledTimes(1);
        expect(mockProductRepository.update).not.toHaveBeenCalled();
    });

    it("should throw an error when product price is zero", async () => {
        const product = new Product("123", "Product 1", 100);
        mockProductRepository.findById.mockResolvedValue(product);

        const input: UpdateProductInputDto = {
            id: "123",
            name: "Product 1",
            price: 0
        };

        await expect(usecase.execute(input)).rejects.toThrow("Price is required and must be greater than 0");
        expect(mockProductRepository.findById).toHaveBeenCalledTimes(1);
        expect(mockProductRepository.update).not.toHaveBeenCalled();
    });

    it("should throw an error when product price is negative", async () => {
        const product = new Product("123", "Product 1", 100);
        mockProductRepository.findById.mockResolvedValue(product);

        const input: UpdateProductInputDto = {
            id: "123",
            name: "Product 1",
            price: -50
        };

        await expect(usecase.execute(input)).rejects.toThrow("Price is required and must be greater than 0");
        expect(mockProductRepository.findById).toHaveBeenCalledTimes(1);
        expect(mockProductRepository.update).not.toHaveBeenCalled();
    });
});
