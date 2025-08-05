import Address from "../../domain/customer/value-object/address";
import CustomerRepositoryInterface from "../../domain/customer/repository/customer.repository.interface";

export interface UpdateCustomerInputDto {
    id: string;
    name: string;
    address: {
        street: string;
        city: string;
        number: number;
        zip: string;
    };
}

export interface UpdateCustomerOutputDto {
    id: string;
    name: string;
    address: {
        street: string;
        city: string;
        number: number;
        zip: string;
    };
}

export default class UpdateCustomerUseCase {
    constructor(readonly customerRepository: CustomerRepositoryInterface) { }

    async execute(input: UpdateCustomerInputDto): Promise<UpdateCustomerOutputDto> {
        const customer = await this.customerRepository.findById(input.id);
        if (!customer) {
            throw new Error("Customer not found");
        }

        customer.changeName(input.name);
        
        const address = new Address(
            input.address.street,
            input.address.number,
            input.address.city,
            input.address.zip
        );
        customer.changeAddress(address);

        await this.customerRepository.update(customer);

        return {
            id: customer.id,
            name: customer.name,
            address: {
                street: customer.address.street,
                city: customer.address.city,
                number: customer.address.number,
                zip: customer.address.zip
            }
        };
    }
}
