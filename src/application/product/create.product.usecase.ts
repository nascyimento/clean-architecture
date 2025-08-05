import { v4 as uuid } from 'uuid';
import Product from "../../domain/product/entity/product";
import ProductRepositoryInterface from "../../domain/product/repository/product.repository.interface";

export interface CreateProductInputDto {
    name: string;
    price: number;
}

export interface CreateProductOutputDto {
    id: string;
    name: string;
    price: number;
}

export default class CreateProductUseCase {
    constructor(readonly productRepository: ProductRepositoryInterface) { }

    async execute(input: CreateProductInputDto): Promise<CreateProductOutputDto> {
        const product = new Product(uuid(), input.name, input.price);

        await this.productRepository.create(product);

        return {
            id: product.id,
            name: product.name,
            price: product.price
        };
    }
}
