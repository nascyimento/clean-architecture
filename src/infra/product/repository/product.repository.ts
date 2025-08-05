import ProductRepositoryInterface from "../../../domain/product/repository/product.repository.interface";
import Product from "../../../domain/product/entity/product";
import ProductModel from "./model/product.model";

export default class ProductRepository implements ProductRepositoryInterface {
	async create(entity: Product): Promise<void> {
		await ProductModel.create({
			id: entity.id,
			name: entity.name,
			price: entity.price
		})
	}

	async findAll(): Promise<Product[]> {
		const productModels = await ProductModel.findAll()
		return productModels.map(productModel => new Product(productModel.id, productModel.name, productModel.price))
	}

	async findById(id: string): Promise<Product> {
		const productModel = await ProductModel.findByPk(id)
		if (!productModel) {
			throw new Error("Product not found")
		}

		return new Product(productModel.id, productModel.name, productModel.price)
	}

	async update(entity: Product): Promise<void> {
		await ProductModel.update(
			{
				name: entity.name,
				price: entity.price
			},
			{
				where: {id: entity.id}
			}
		)
	}
}
