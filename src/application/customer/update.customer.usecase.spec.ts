import { Sequelize } from "sequelize-typescript";
import UpdateCustomerUseCase, { UpdateCustomerInputDto } from "./update.customer.usecase";
import CustomerModel from "../../infra/customer/repository/model/customer.model";
import CustomerRepository from "../../infra/customer/repository/customer.repository";
import Customer from "../../domain/customer/entity/customer";
import Address from "../../domain/customer/value-object/address";

describe("Test update customer use case", () => {
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

    it("should update a customer", async () => {
        const customerRepository = new CustomerRepository();
        const usecase = new UpdateCustomerUseCase(customerRepository);
        
        // Create a customer first
        const customer = new Customer("123", "John Doe");
        const address = new Address("Street 1", 123, "New York", "10001");
        customer.changeAddress(address);
        await customerRepository.create(customer);

        const input: UpdateCustomerInputDto = {
            id: "123",
            name: "John Doe Updated",
            address: {
                street: "Street 2",
                city: "Los Angeles",
                number: 456,
                zip: "90001"
            }
        };

        const output = await usecase.execute(input);

        expect(output).toEqual({
            id: "123",
            name: "John Doe Updated",
            address: {
                street: "Street 2",
                city: "Los Angeles",
                number: 456,
                zip: "90001"
            }
        });
    });

    it("should throw an error when customer is not found", async () => {
        const customerRepository = new CustomerRepository();
        const usecase = new UpdateCustomerUseCase(customerRepository);

        const input: UpdateCustomerInputDto = {
            id: "999",
            name: "John Doe",
            address: {
                street: "Street 1",
                city: "New York",
                number: 123,
                zip: "10001"
            }
        };

        await expect(usecase.execute(input)).rejects.toThrow("Customer not found");
    });

    it("should throw an error when customer name is empty", async () => {
        const customerRepository = new CustomerRepository();
        const usecase = new UpdateCustomerUseCase(customerRepository);
        
        // Create a customer first
        const customer = new Customer("123", "John Doe");
        const address = new Address("Street 1", 123, "New York", "10001");
        customer.changeAddress(address);
        await customerRepository.create(customer);

        const input: UpdateCustomerInputDto = {
            id: "123",
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

    it("should throw an error when address street is empty", async () => {
        const customerRepository = new CustomerRepository();
        const usecase = new UpdateCustomerUseCase(customerRepository);
        
        // Create a customer first
        const customer = new Customer("123", "John Doe");
        const address = new Address("Street 1", 123, "New York", "10001");
        customer.changeAddress(address);
        await customerRepository.create(customer);

        const input: UpdateCustomerInputDto = {
            id: "123",
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

    it("should throw an error when address city is empty", async () => {
        const customerRepository = new CustomerRepository();
        const usecase = new UpdateCustomerUseCase(customerRepository);
        
        // Create a customer first
        const customer = new Customer("123", "John Doe");
        const address = new Address("Street 1", 123, "New York", "10001");
        customer.changeAddress(address);
        await customerRepository.create(customer);

        const input: UpdateCustomerInputDto = {
            id: "123",
            name: "John Doe",
            address: {
                street: "Street 1",
                city: "",
                number: 123,
                zip: "10001"
            }
        };

        await expect(usecase.execute(input)).rejects.toThrow("City is required");
    });

    it("should throw an error when address zip is empty", async () => {
        const customerRepository = new CustomerRepository();
        const usecase = new UpdateCustomerUseCase(customerRepository);
        
        // Create a customer first
        const customer = new Customer("123", "John Doe");
        const address = new Address("Street 1", 123, "New York", "10001");
        customer.changeAddress(address);
        await customerRepository.create(customer);

        const input: UpdateCustomerInputDto = {
            id: "123",
            name: "John Doe",
            address: {
                street: "Street 1",
                city: "New York",
                number: 123,
                zip: ""
            }
        };

        await expect(usecase.execute(input)).rejects.toThrow("Zip is required");
    });
});
