import { Sequelize } from "sequelize-typescript";
import CreateCustomerUseCase, { CreateCustomerInputDto } from "./create.customer.usecase";
import CustomerModel from "../../infra/customer/repository/model/customer.model";
import CustomerRepository from "../../infra/customer/repository/customer.repository";

describe("Test create customer use case", () => {
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true },
        });

        sequelize.addModels([CustomerModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it("should create a customer", async () => {
        const customerRepository = new CustomerRepository();
        const usecase = new CreateCustomerUseCase(customerRepository);

        const input: CreateCustomerInputDto = {
            name: "John Doe",
            address: {
                street: "Street 1",
                city: "New York", 
                number: 123,
                zip: "10001"
            }
        };

        const output = await usecase.execute(input);

        expect(output).toEqual({
            id: expect.any(String),
            name: "John Doe",
            address: {
                street: "Street 1",
                city: "New York",
                number: 123,
                zip: "10001"
            }
        });
    });

    it("should throw an error when customer name is missing", async () => {
        const customerRepository = new CustomerRepository();
        const usecase = new CreateCustomerUseCase(customerRepository);

        const input: CreateCustomerInputDto = {
            name: "",
            address: {
                street: "Street 1",
                city: "New York",
                number: 123,
                zip: "10001"
            }
        };

        await expect(usecase.execute(input)).rejects.toThrow("Name is required");
    });

    it("should throw an error when customer address is incomplete", async () => {
        const customerRepository = new CustomerRepository();
        const usecase = new CreateCustomerUseCase(customerRepository);

        const input: CreateCustomerInputDto = {
            name: "John Doe",
            address: {
                street: "",
                city: "New York",
                number: 123,
                zip: "10001"
            }
        };

        await expect(usecase.execute(input)).rejects.toThrow("Street is required");
    });
});