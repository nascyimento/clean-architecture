import CreateProductUseCase, { CreateProductInputDto } from "./create.product.usecase";
import ProductRepositoryInterface from "../../domain/product/repository/product.repository.interface";

describe("CreateProductUseCase unit tests", () => {
    let usecase: CreateProductUseCase;
    let mockProductRepository: jest.Mocked<ProductRepositoryInterface>;

    beforeEach(() => {
        mockProductRepository = {
            create: jest.fn(),
            update: jest.fn(),
            findById: jest.fn(),
            findAll: jest.fn(),
        };
        usecase = new CreateProductUseCase(mockProductRepository);
    });

    it("should create a product", async () => {
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

        expect(mockProductRepository.create).toHaveBeenCalledTimes(1);
        expect(mockProductRepository.create).toHaveBeenCalledWith(
            expect.objectContaining({
                name: "Product 1",
                price: 100
            })
        );
    });

    it("should throw an error when product name is missing", async () => {
        const input: CreateProductInputDto = {
            name: "",
            price: 100
        };

        await expect(usecase.execute(input)).rejects.toThrow("Name is required");
        expect(mockProductRepository.create).not.toHaveBeenCalled();
    });

    it("should throw an error when product price is zero", async () => {
        const input: CreateProductInputDto = {
            name: "Product 1",
            price: 0
        };

        await expect(usecase.execute(input)).rejects.toThrow("Price is required and must be greater than 0");
        expect(mockProductRepository.create).not.toHaveBeenCalled();
    });

    it("should throw an error when product price is negative", async () => {
        const input: CreateProductInputDto = {
            name: "Product 1",
            price: -10
        };

        await expect(usecase.execute(input)).rejects.toThrow("Price is required and must be greater than 0");
        expect(mockProductRepository.create).not.toHaveBeenCalled();
    });
});
