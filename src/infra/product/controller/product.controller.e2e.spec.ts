import request from "supertest";
import { Sequelize } from "sequelize-typescript";
import { ExpressHttpServer } from "../../http/http.server";
import ProductController from "./product.controller";
import ProductModel from "../repository/model/product.model";
import ProductRepository from "../repository/product.repository";
import CreateProductUseCase from "../../../application/product/create.product.usecase";
import FindProductUseCase from "../../../application/product/find.product.usecase";
import ListProductUseCase from "../../../application/product/list.product.usecase";
import UpdateProductUseCase from "../../../application/product/update.product.usecase";
import express from "express";

describe("Product Controller E2E Tests", () => {
    let sequelize: Sequelize;
    let app: express.Application;

    beforeEach(async () => {
        // Configure in-memory database
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true },
        });

        sequelize.addModels([ProductModel]);
        await sequelize.sync();

        // Setup HTTP server and dependencies
        const httpServer = new ExpressHttpServer();
        const productRepository = new ProductRepository();

        const createProductUseCase = new CreateProductUseCase(productRepository);
        const findProductUseCase = new FindProductUseCase(productRepository);
        const listProductUseCase = new ListProductUseCase(productRepository);
        const updateProductUseCase = new UpdateProductUseCase(productRepository);

        // Initialize controller with all dependencies
        new ProductController(
            httpServer,
            createProductUseCase,
            findProductUseCase,
            listProductUseCase,
            updateProductUseCase
        );

        // Get the Express app instance
        app = (httpServer as any).app;
    });

    afterEach(async () => {
        await sequelize.close();
    });

    describe("POST /products", () => {
        it("should create a product successfully", async () => {
            const productData = {
                name: "Smartphone",
                price: 999.99
            };

            const response = await request(app)
                .post("/products")
                .send(productData)
                .expect(201);

            expect(response.body).toEqual({
                id: expect.any(String),
                name: "Smartphone",
                price: 999.99
            });

            // Verify the product was actually saved in the database
            const productModel = await ProductModel.findOne({
                where: { id: response.body.id }
            });

            expect(productModel).toBeTruthy();
            expect(productModel?.name).toBe("Smartphone");
            expect(productModel?.price).toBe(999.99);
        });

        it("should return 400 when product name is missing", async () => {
            const productData = {
                name: "",
                price: 999.99
            };

            const response = await request(app)
                .post("/products")
                .send(productData)
                .expect(400);

            expect(response.body).toEqual({
                error: "product: Name is required"
            });
        });

        it("should return 400 when product price is zero", async () => {
            const productData = {
                name: "Smartphone",
                price: 0
            };

            const response = await request(app)
                .post("/products")
                .send(productData)
                .expect(400);

            expect(response.body).toEqual({
                error: "product: Price is required and must be greater than 0"
            });
        });

        it("should return 400 when product price is negative", async () => {
            const productData = {
                name: "Smartphone",
                price: -100
            };

            const response = await request(app)
                .post("/products")
                .send(productData)
                .expect(400);

            expect(response.body).toEqual({
                error: "product: Price is required and must be greater than 0"
            });
        });

        it("should return 400 when request body is invalid JSON", async () => {
            const response = await request(app)
                .post("/products")
                .send("invalid json")
                .expect(400);

            expect(response.body).toHaveProperty("error");
        });

        it("should return 400 when price is missing", async () => {
            const productData = {
                name: "Smartphone"
                // price is missing
            };

            const response = await request(app)
                .post("/products")
                .send(productData)
                .expect(400);

            expect(response.body).toHaveProperty("error");
        });

        it("should handle special characters in product name", async () => {
            const productData = {
                name: "Smartphone 5G - Edição Especial São Paulo",
                price: 1299.90
            };

            const response = await request(app)
                .post("/products")
                .send(productData)
                .expect(201);

            expect(response.body).toEqual({
                id: expect.any(String),
                name: "Smartphone 5G - Edição Especial São Paulo",
                price: 1299.90
            });
        });

        it("should handle decimal prices correctly", async () => {
            const productData = {
                name: "Tablet",
                price: 599.99
            };

            const response = await request(app)
                .post("/products")
                .send(productData)
                .expect(201);

            expect(response.body).toEqual({
                id: expect.any(String),
                name: "Tablet",
                price: 599.99
            });
        });
    });

    describe("GET /products/:id", () => {
        it("should find a product by id", async () => {
            // First create a product
            const productData = {
                name: "Laptop",
                price: 1499.99
            };

            const createResponse = await request(app)
                .post("/products")
                .send(productData)
                .expect(201);

            const productId = createResponse.body.id;

            // Then find the product
            const response = await request(app)
                .get(`/products/${productId}`)
                .expect(200);

            expect(response.body).toEqual({
                id: productId,
                name: "Laptop",
                price: 1499.99
            });
        });

        it("should return 404 when product is not found", async () => {
            const response = await request(app)
                .get("/products/non-existent-id")
                .expect(404);

            expect(response.body).toEqual({
                error: "Product not found"
            });
        });
    });

    describe("GET /products", () => {
        it("should list all products", async () => {
            // Create multiple products
            const product1Data = {
                name: "Smartphone",
                price: 999.99
            };

            const product2Data = {
                name: "Tablet",
                price: 599.99
            };

            const createResponse1 = await request(app)
                .post("/products")
                .send(product1Data)
                .expect(201);

            const createResponse2 = await request(app)
                .post("/products")
                .send(product2Data)
                .expect(201);

            // List all products
            const response = await request(app)
                .get("/products")
                .expect(200);

            expect(response.body.products).toHaveLength(2);
            expect(response.body).toEqual({
                products: expect.arrayContaining([
                    {
                        id: createResponse1.body.id,
                        name: "Smartphone",
                        price: 999.99
                    },
                    {
                        id: createResponse2.body.id,
                        name: "Tablet",
                        price: 599.99
                    }
                ])
            });
        });

        it("should return empty list when no products exist", async () => {
            const response = await request(app)
                .get("/products")
                .expect(200);

            expect(response.body).toEqual({
                products: []
            });
        });
    });

    describe("PUT /products/:id", () => {
        it("should update a product successfully", async () => {
            // First create a product
            const productData = {
                name: "Smartphone",
                price: 999.99
            };

            const createResponse = await request(app)
                .post("/products")
                .send(productData)
                .expect(201);

            const productId = createResponse.body.id;

            // Update the product
            const updateData = {
                name: "Smartphone Pro Max",
                price: 1299.99
            };

            const response = await request(app)
                .put(`/products/${productId}`)
                .send(updateData)
                .expect(200);

            expect(response.body).toEqual({
                id: productId,
                name: "Smartphone Pro Max",
                price: 1299.99
            });

            // Verify the product was actually updated in the database
            const productModel = await ProductModel.findOne({
                where: { id: productId }
            });

            expect(productModel).toBeTruthy();
            expect(productModel?.name).toBe("Smartphone Pro Max");
            expect(productModel?.price).toBe(1299.99);
        });

        it("should return 400 when trying to update with invalid name", async () => {
            // First create a product
            const productData = {
                name: "Smartphone",
                price: 999.99
            };

            const createResponse = await request(app)
                .post("/products")
                .send(productData)
                .expect(201);

            const productId = createResponse.body.id;

            // Try to update with empty name
            const updateData = {
                name: "",
                price: 1299.99
            };

            const response = await request(app)
                .put(`/products/${productId}`)
                .send(updateData)
                .expect(400);

            expect(response.body).toEqual({
                error: "product: Name is required"
            });
        });

        it("should return 400 when trying to update with zero price", async () => {
            // First create a product
            const productData = {
                name: "Smartphone",
                price: 999.99
            };

            const createResponse = await request(app)
                .post("/products")
                .send(productData)
                .expect(201);

            const productId = createResponse.body.id;

            // Try to update with zero price
            const updateData = {
                name: "Smartphone Updated",
                price: 0
            };

            const response = await request(app)
                .put(`/products/${productId}`)
                .send(updateData)
                .expect(400);

            expect(response.body).toEqual({
                error: "product: Price is required and must be greater than 0"
            });
        });

        it("should return 400 when trying to update with negative price", async () => {
            // First create a product
            const productData = {
                name: "Smartphone",
                price: 999.99
            };

            const createResponse = await request(app)
                .post("/products")
                .send(productData)
                .expect(201);

            const productId = createResponse.body.id;

            // Try to update with negative price
            const updateData = {
                name: "Smartphone Updated",
                price: -100
            };

            const response = await request(app)
                .put(`/products/${productId}`)
                .send(updateData)
                .expect(400);

            expect(response.body).toEqual({
                error: "product: Price is required and must be greater than 0"
            });
        });

        it("should return 400 when trying to update non-existent product", async () => {
            const updateData = {
                name: "Smartphone Updated",
                price: 1299.99
            };

            const response = await request(app)
                .put("/products/non-existent-id")
                .send(updateData)
                .expect(400);

            expect(response.body).toEqual({
                error: "Product not found"
            });
        });

        it("should handle decimal price updates correctly", async () => {
            // First create a product
            const productData = {
                name: "Tablet",
                price: 599.99
            };

            const createResponse = await request(app)
                .post("/products")
                .send(productData)
                .expect(201);

            const productId = createResponse.body.id;

            // Update with precise decimal price
            const updateData = {
                name: "Tablet Pro",
                price: 899.95
            };

            const response = await request(app)
                .put(`/products/${productId}`)
                .send(updateData)
                .expect(200);

            expect(response.body).toEqual({
                id: productId,
                name: "Tablet Pro",
                price: 899.95
            });

            // Verify precision in database
            const productModel = await ProductModel.findOne({
                where: { id: productId }
            });

            expect(productModel?.price).toBe(899.95);
        });
    });
});
