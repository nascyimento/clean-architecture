import { Sequelize } from "sequelize-typescript";
import ListCustomerUseCase, { ListCustomerInputDto } from "./list.customer.usecase";
import CustomerModel from "../../infra/customer/repository/model/customer.model";
import CustomerRepository from "../../infra/customer/repository/customer.repository";
import Customer from "../../domain/customer/entity/customer";
import Address from "../../domain/customer/value-object/address";

describe("Test list customer use case", () => {
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

    it("should list all customers", async () => {
        const customerRepository = new CustomerRepository();
        const usecase = new ListCustomerUseCase(customerRepository);
        
        // Create customers first
        const customer1 = new Customer("123", "John Doe");
        const address1 = new Address("Street 1", 123, "New York", "10001");
        customer1.changeAddress(address1);
        await customerRepository.create(customer1);

        const customer2 = new Customer("456", "Jane Smith");
        const address2 = new Address("Street 2", 456, "Los Angeles", "90001");
        customer2.changeAddress(address2);
        await customerRepository.create(customer2);

        const input: ListCustomerInputDto = {};
        const output = await usecase.execute(input);

        expect(output.customers).toHaveLength(2);
        expect(output).toEqual({
            customers: [
                {
                    id: "123",
                    name: "John Doe",
                    address: {
                        street: "Street 1",
                        city: "New York",
                        number: 123,
                        zip: "10001"
                    }
                },
                {
                    id: "456",
                    name: "Jane Smith",
                    address: {
                        street: "Street 2",
                        city: "Los Angeles",
                        number: 456,
                        zip: "90001"
                    }
                }
            ]
        });
    });

    it("should return an empty list when no customers exist", async () => {
        const customerRepository = new CustomerRepository();
        const usecase = new ListCustomerUseCase(customerRepository);

        const input: ListCustomerInputDto = {};
        const output = await usecase.execute(input);

        expect(output.customers).toHaveLength(0);
        expect(output).toEqual({
            customers: []
        });
    });

    it("should list customers in the order they were created", async () => {
        const customerRepository = new CustomerRepository();
        const usecase = new ListCustomerUseCase(customerRepository);
        
        // Create customers in specific order
        const customer1 = new Customer("111", "First Customer");
        const address1 = new Address("Street A", 111, "City A", "11111");
        customer1.changeAddress(address1);
        await customerRepository.create(customer1);

        const customer2 = new Customer("222", "Second Customer");
        const address2 = new Address("Street B", 222, "City B", "22222");
        customer2.changeAddress(address2);
        await customerRepository.create(customer2);

        const customer3 = new Customer("333", "Third Customer");
        const address3 = new Address("Street C", 333, "City C", "33333");
        customer3.changeAddress(address3);
        await customerRepository.create(customer3);

        const input: ListCustomerInputDto = {};
        const output = await usecase.execute(input);

        expect(output.customers).toHaveLength(3);
        expect(output.customers[0].name).toBe("First Customer");
        expect(output.customers[1].name).toBe("Second Customer");
        expect(output.customers[2].name).toBe("Third Customer");
    });
});
