import CreateProductUseCase from "../../../application/product/create.product.usecase";
import FindProductUseCase from "../../../application/product/find.product.usecase";
import ListProductUseCase from "../../../application/product/list.product.usecase";
import UpdateProductUseCase from "../../../application/product/update.product.usecase";
import HttpServer from "../../http/http.server";

export default class ProductController {
    constructor(
        readonly httpServer: HttpServer,
        readonly createProduct: CreateProductUseCase,
        readonly findProduct: FindProductUseCase,
        readonly listProducts: ListProductUseCase,
        readonly updateProduct: UpdateProductUseCase
    ) {
        this.httpServer.route("post", "/products", async (req: any, res: any) => {
            try {
                const input = req.body;
                const output = await this.createProduct.execute(input);
                res.status(201).json(output);
            } catch (error: any) {
                res.status(400).json({ error: error.message });
            }
        });
        this.httpServer.route("get", "/products/:id", async (req: any, res: any) => {
            try {
                const input = { id: req.params.id };
                const output = await this.findProduct.execute(input);
                res.status(200).json(output);
            } catch (error: any) {
                res.status(404).json({ error: error.message });
            }
        });
        this.httpServer.route("get", "/products", async (req: any, res: any) => {
            try {
                const output = await this.listProducts.execute({});
                res.status(200).json(output);
            } catch (error: any) {
                res.status(500).json({ error: error.message });
            }
        });
        this.httpServer.route("put", "/products/:id", async (req: any, res: any) => {
            try {
                const input = { id: req.params.id, ...req.body };
                const output = await this.updateProduct.execute(input);
                res.status(200).json(output);
            } catch (error: any) {
                res.status(400).json({ error: error.message });
            }
        });
    }
}
