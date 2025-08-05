import ProductRepositoryInterface from "../../domain/product/repository/product.repository.interface";

export interface ListProductInputDto {}

export interface ListProductOutputDto {
    products: {
        id: string;
        name: string;
        price: number;
    }[];
}

export default class ListProductUseCase {
    constructor(readonly productRepository: ProductRepositoryInterface) { }

    async execute(input: ListProductInputDto): Promise<ListProductOutputDto> {
        const products = await this.productRepository.findAll();

        return {
            products: products.map(product => ({
                id: product.id,
                name: product.name,
                price: product.price
            }))
        };
    }
}
