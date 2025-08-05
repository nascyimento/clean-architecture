import ProductRepositoryInterface from "../../domain/product/repository/product.repository.interface";

export interface FindProductInputDto {
    id: string;
}

export interface FindProductOutputDto {
    id: string;
    name: string;
    price: number;
}

export default class FindProductUseCase {
    constructor(readonly productRepository: ProductRepositoryInterface) { }

    async execute(input: FindProductInputDto): Promise<FindProductOutputDto> {
        const product = await this.productRepository.findById(input.id);
        if (!product) throw new Error("Product not found");

        return {
            id: product.id,
            name: product.name,
            price: product.price
        };
    }
}
