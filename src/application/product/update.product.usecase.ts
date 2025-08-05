import ProductRepositoryInterface from "../../domain/product/repository/product.repository.interface";

export interface UpdateProductInputDto {
    id: string;
    name: string;
    price: number;
}

export interface UpdateProductOutputDto {
    id: string;
    name: string;
    price: number;
}

export default class UpdateProductUseCase {
    constructor(readonly productRepository: ProductRepositoryInterface) { }

    async execute(input: UpdateProductInputDto): Promise<UpdateProductOutputDto> {
        const product = await this.productRepository.findById(input.id);
        if (!product) {
            throw new Error("Product not found");
        }

        product.changeName(input.name);
        product.changePrice(input.price);

        await this.productRepository.update(product);

        return {
            id: product.id,
            name: product.name,
            price: product.price
        };
    }
}
