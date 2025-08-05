import CustomerFactory from "../../domain/customer/factory/customer.factory";
import CustomerRepositoryInterface from "../../domain/customer/repository/customer.repository.interface";

export interface CreateCustomerInputDto {
    name: string;
    address: {
        street: string;
        city: string;
        number: number;
        zip: string;
    };
}

export interface CreateCustomerOutputDto {
    id: string;
    name: string;
    address: {
        street: string;
        city: string;
        number: number;
        zip: string;
    };
}

export default class CreateCustomerUseCase {
    constructor(readonly customerRepository: CustomerRepositoryInterface) { }

    async execute(input: CreateCustomerInputDto): Promise<CreateCustomerOutputDto> {
        const customer = CustomerFactory.createWithAddress(
            input.name,
            input.address.street,
            input.address.number,
            input.address.city,
            input.address.zip
        );

        await this.customerRepository.create(customer);

        return {
            id: customer.id,
            name: customer.name,
            address: {
                street: customer.address.street,
                city: customer.address.city,
                number: customer.address.number,
                zip: customer.address.zip
            }
        }
    }
}