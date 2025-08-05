import request from "supertest";
import { Sequelize } from "sequelize-typescript";
import { ExpressHttpServer } from "../../http/http.server";
import CustomerController from "./customer.controller";
import CustomerModel from "../repository/model/customer.model";
import CustomerRepository from "../repository/customer.repository";
import CreateCustomerUseCase from "../../../application/customer/create.customer.usecase";
import FindCustomerUseCase from "../../../application/customer/find.customer.usecase";
import ListCustomerUseCase from "../../../application/customer/list.customer.usecase";
import UpdateCustomerUseCase from "../../../application/customer/update.customer.usecase";
import express from "express";

describe("Customer Controller E2E Tests", () => {
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

        sequelize.addModels([CustomerModel]);
        await sequelize.sync();

        // Setup HTTP server and dependencies
        const httpServer = new ExpressHttpServer();
        const customerRepository = new CustomerRepository();

        const createCustomerUseCase = new CreateCustomerUseCase(customerRepository);
        const findCustomerUseCase = new FindCustomerUseCase(customerRepository);
        const listCustomerUseCase = new ListCustomerUseCase(customerRepository);
        const updateCustomerUseCase = new UpdateCustomerUseCase(customerRepository);

        // Initialize controller with all dependencies
        new CustomerController(
            httpServer,
            createCustomerUseCase,
            findCustomerUseCase,
            listCustomerUseCase,
            updateCustomerUseCase
        );

        // Get the Express app instance
        app = (httpServer as any).app;
    });

    afterEach(async () => {
        await sequelize.close();
    });

    describe("POST /customers", () => {
        it("should create a customer successfully", async () => {
            const customerData = {
                name: "John Doe",
                address: {
                    street: "123 Main St",
                    city: "New York",
                    number: 123,
                    zip: "10001"
                }
            };

            const response = await request(app)
                .post("/customers")
                .send(customerData)
                .expect(201);

            expect(response.body).toEqual({
                id: expect.any(String),
                name: "John Doe",
                address: {
                    street: "123 Main St",
                    city: "New York",
                    number: 123,
                    zip: "10001"
                }
            });

            // Verify the customer was actually saved in the database
            const customerModel = await CustomerModel.findOne({
                where: { id: response.body.id }
            });

            expect(customerModel).toBeTruthy();
            expect(customerModel?.name).toBe("John Doe");
            expect(customerModel?.street).toBe("123 Main St");
            expect(customerModel?.city).toBe("New York");
            expect(customerModel?.number).toBe(123);
            expect(customerModel?.zipcode).toBe("10001");
        });

        it("should return 400 when customer name is missing", async () => {
            const customerData = {
                name: "",
                address: {
                    street: "123 Main St",
                    city: "New York",
                    number: 123,
                    zip: "10001"
                }
            };

            const response = await request(app)
                .post("/customers")
                .send(customerData)
                .expect(400);

            expect(response.body).toEqual({
                error: "Name is required"
            });
        });

        it("should return 400 when address street is missing", async () => {
            const customerData = {
                name: "John Doe",
                address: {
                    street: "",
                    city: "New York",
                    number: 123,
                    zip: "10001"
                }
            };

            const response = await request(app)
                .post("/customers")
                .send(customerData)
                .expect(400);

            expect(response.body).toEqual({
                error: "Street is required"
            });
        });

        it("should return 400 when address city is missing", async () => {
            const customerData = {
                name: "John Doe",
                address: {
                    street: "123 Main St",
                    city: "",
                    number: 123,
                    zip: "10001"
                }
            };

            const response = await request(app)
                .post("/customers")
                .send(customerData)
                .expect(400);

            expect(response.body).toEqual({
                error: "City is required"
            });
        });

        it("should return 400 when address zip is missing", async () => {
            const customerData = {
                name: "John Doe",
                address: {
                    street: "123 Main St",
                    city: "New York",
                    number: 123,
                    zip: ""
                }
            };

            const response = await request(app)
                .post("/customers")
                .send(customerData)
                .expect(400);

            expect(response.body).toEqual({
                error: "Zip is required"
            });
        });

        it("should return 400 when request body is invalid JSON", async () => {
            const response = await request(app)
                .post("/customers")
                .send("invalid json")
                .expect(400);

            expect(response.body).toHaveProperty("error");
        });

        it("should return 400 when address is missing", async () => {
            const customerData = {
                name: "John Doe"
                // address is missing
            };

            const response = await request(app)
                .post("/customers")
                .send(customerData)
                .expect(400);

            expect(response.body).toHaveProperty("error");
        });

        it("should handle special characters in customer name", async () => {
            const customerData = {
                name: "José María Rodríguez-González",
                address: {
                    street: "Calle de la Constitución",
                    city: "São Paulo",
                    number: 456,
                    zip: "01234-567"
                }
            };

            const response = await request(app)
                .post("/customers")
                .send(customerData)
                .expect(201);

            expect(response.body).toEqual({
                id: expect.any(String),
                name: "José María Rodríguez-González",
                address: {
                    street: "Calle de la Constitución",
                    city: "São Paulo",
                    number: 456,
                    zip: "01234-567"
                }
            });
        });
    });

    describe("GET /customers/:id", () => {
        it("should find a customer by id", async () => {
            // First create a customer
            const customerData = {
                name: "John Doe",
                address: {
                    street: "123 Main St",
                    city: "New York",
                    number: 123,
                    zip: "10001"
                }
            };

            const createResponse = await request(app)
                .post("/customers")
                .send(customerData)
                .expect(201);

            const customerId = createResponse.body.id;

            // Then find the customer
            const response = await request(app)
                .get(`/customers/${customerId}`)
                .expect(200);

            expect(response.body).toEqual({
                id: customerId,
                name: "John Doe",
                address: {
                    street: "123 Main St",
                    city: "New York",
                    number: 123,
                    zip: "10001"
                }
            });
        });

        it("should return 404 when customer is not found", async () => {
            const response = await request(app)
                .get("/customers/non-existent-id")
                .expect(404);

            expect(response.body).toEqual({
                error: "Customer not found"
            });
        });
    });

    describe("GET /customers", () => {
        it("should list all customers", async () => {
            // Create multiple customers
            const customer1Data = {
                name: "John Doe",
                address: {
                    street: "123 Main St",
                    city: "New York",
                    number: 123,
                    zip: "10001"
                }
            };

            const customer2Data = {
                name: "Jane Smith",
                address: {
                    street: "456 Oak Ave",
                    city: "Los Angeles",
                    number: 456,
                    zip: "90001"
                }
            };

            const createResponse1 = await request(app)
                .post("/customers")
                .send(customer1Data)
                .expect(201);

            const createResponse2 = await request(app)
                .post("/customers")
                .send(customer2Data)
                .expect(201);

            // List all customers
            const response = await request(app)
                .get("/customers")
                .expect(200);

            expect(response.body.customers).toHaveLength(2);
            expect(response.body).toEqual({
                customers: expect.arrayContaining([
                    {
                        id: createResponse1.body.id,
                        name: "John Doe",
                        address: {
                            street: "123 Main St",
                            city: "New York",
                            number: 123,
                            zip: "10001"
                        }
                    },
                    {
                        id: createResponse2.body.id,
                        name: "Jane Smith",
                        address: {
                            street: "456 Oak Ave",
                            city: "Los Angeles",
                            number: 456,
                            zip: "90001"
                        }
                    }
                ])
            });

        });

        it("should return empty list when no customers exist", async () => {
            const response = await request(app)
                .get("/customers")
                .expect(200);

            expect(response.body).toEqual({
                customers: []
            });
        });
    });

    describe("PUT /customers/:id", () => {
        it("should update a customer successfully", async () => {
            // First create a customer
            const customerData = {
                name: "John Doe",
                address: {
                    street: "123 Main St",
                    city: "New York",
                    number: 123,
                    zip: "10001"
                }
            };

            const createResponse = await request(app)
                .post("/customers")
                .send(customerData)
                .expect(201);

            const customerId = createResponse.body.id;

            // Update the customer
            const updateData = {
                name: "John Doe Updated",
                address: {
                    street: "456 Updated St",
                    city: "Updated City",
                    number: 456,
                    zip: "54321"
                }
            };

            const response = await request(app)
                .put(`/customers/${customerId}`)
                .send(updateData)
                .expect(200);

            expect(response.body).toEqual({
                id: customerId,
                name: "John Doe Updated",
                address: {
                    street: "456 Updated St",
                    city: "Updated City",
                    number: 456,
                    zip: "54321"
                }
            });

            // Verify the customer was actually updated in the database
            const customerModel = await CustomerModel.findOne({
                where: { id: customerId }
            });

            expect(customerModel).toBeTruthy();
            expect(customerModel?.name).toBe("John Doe Updated");
            expect(customerModel?.street).toBe("456 Updated St");
            expect(customerModel?.city).toBe("Updated City");
            expect(customerModel?.number).toBe(456);
            expect(customerModel?.zipcode).toBe("54321");
        });

        it("should return 400 when trying to update with invalid data", async () => {
            // First create a customer
            const customerData = {
                name: "John Doe",
                address: {
                    street: "123 Main St",
                    city: "New York",
                    number: 123,
                    zip: "10001"
                }
            };

            const createResponse = await request(app)
                .post("/customers")
                .send(customerData)
                .expect(201);

            const customerId = createResponse.body.id;

            // Try to update with empty name
            const updateData = {
                name: "",
                address: {
                    street: "456 Updated St",
                    city: "Updated City",
                    number: 456,
                    zip: "54321"
                }
            };

            const response = await request(app)
                .put(`/customers/${customerId}`)
                .send(updateData)
                .expect(400);

            expect(response.body).toEqual({
                error: "Name is required"
            });
        });

        it("should return 400 when trying to update customer with empty street", async () => {
            // First create a customer
            const customerData = {
                name: "John Doe",
                address: {
                    street: "123 Main St",
                    city: "New York",
                    number: 123,
                    zip: "10001"
                }
            };

            const createResponse = await request(app)
                .post("/customers")
                .send(customerData)
                .expect(201);

            const customerId = createResponse.body.id;

            // Try to update with empty street
            const updateData = {
                name: "John Doe Updated",
                address: {
                    street: "",
                    city: "Updated City",
                    number: 456,
                    zip: "54321"
                }
            };

            const response = await request(app)
                .put(`/customers/${customerId}`)
                .send(updateData)
                .expect(400);

            expect(response.body).toEqual({
                error: "Street is required"
            });
        });

        it("should return 400 when trying to update customer with empty city", async () => {
            // First create a customer
            const customerData = {
                name: "John Doe",
                address: {
                    street: "123 Main St",
                    city: "New York",
                    number: 123,
                    zip: "10001"
                }
            };

            const createResponse = await request(app)
                .post("/customers")
                .send(customerData)
                .expect(201);

            const customerId = createResponse.body.id;

            // Try to update with empty city
            const updateData = {
                name: "John Doe Updated",
                address: {
                    street: "456 Updated St",
                    city: "",
                    number: 456,
                    zip: "54321"
                }
            };

            const response = await request(app)
                .put(`/customers/${customerId}`)
                .send(updateData)
                .expect(400);

            expect(response.body).toEqual({
                error: "City is required"
            });
        });

        it("should return 400 when trying to update customer with empty zip", async () => {
            // First create a customer
            const customerData = {
                name: "John Doe",
                address: {
                    street: "123 Main St",
                    city: "New York",
                    number: 123,
                    zip: "10001"
                }
            };

            const createResponse = await request(app)
                .post("/customers")
                .send(customerData)
                .expect(201);

            const customerId = createResponse.body.id;

            // Try to update with empty zip
            const updateData = {
                name: "John Doe Updated",
                address: {
                    street: "456 Updated St",
                    city: "Updated City",
                    number: 456,
                    zip: ""
                }
            };

            const response = await request(app)
                .put(`/customers/${customerId}`)
                .send(updateData)
                .expect(400);

            expect(response.body).toEqual({
                error: "Zip is required"
            });
        });

        it("should return 400 when trying to update non-existent customer", async () => {
            const updateData = {
                name: "John Doe Updated",
                address: {
                    street: "456 Updated St",
                    city: "Updated City",
                    number: 456,
                    zip: "54321"
                }
            };

            const response = await request(app)
                .put("/customers/non-existent-id")
                .send(updateData)
                .expect(400);

            expect(response.body).toEqual({
                error: "Customer not found"
            });
        });
    });
});