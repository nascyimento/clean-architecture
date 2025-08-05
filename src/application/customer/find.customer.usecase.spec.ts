import { Sequelize } from "sequelize-typescript";
import FindCustomerUseCase, { FindCustomerInputDto } from "./find.customer.usecase";
import CustomerModel from "../../infra/customer/repository/model/customer.model";
import CustomerRepository from "../../infra/customer/repository/customer.repository";
import Customer from "../../domain/customer/entity/customer";
import Address from "../../domain/customer/value-object/address";

describe("Test find customer use case", () => {
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

    it("should find a customer by id", async () => {
        const customerRepository = new CustomerRepository();
        const usecase = new FindCustomerUseCase(customerRepository);
        const customer = new Customer("123", "Customer 1");
        const address = new Address("Street 1", 1, "New York", "10001");
        customer.changeAddress(address);
        await customerRepository.create(customer);

        const input: FindCustomerInputDto = { id: "123" };
        const output = await usecase.execute(input);

        expect(output).toEqual({
            id: "123",
            name: "Customer 1",
            address: {
                street: "Street 1",
                city: "New York",
                number: 1,
                zip: "10001"
            }
        });
    });

    it("should throw an error if customer not found", async () => {
        const customerRepository = new CustomerRepository();
        const usecase = new FindCustomerUseCase(customerRepository);

        const input: FindCustomerInputDto = { id: "999" };
        await expect(usecase.execute(input)).rejects.toThrow("Customer not found");
    });
});