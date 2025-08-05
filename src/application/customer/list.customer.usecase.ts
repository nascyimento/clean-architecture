import CustomerRepositoryInterface from "../../domain/customer/repository/customer.repository.interface";

export interface ListCustomerInputDto {}

export interface ListCustomerOutputDto {
    customers: {
        id: string;
        name: string;
        address: {
            street: string;
            city: string;
            number: number;
            zip: string;
        };
    }[];
}

export default class ListCustomerUseCase {
    constructor(readonly customerRepository: CustomerRepositoryInterface) { }

    async execute(input: ListCustomerInputDto): Promise<ListCustomerOutputDto> {
        const customers = await this.customerRepository.findAll();

        return {
            customers: customers.map(customer => ({
                id: customer.id,
                name: customer.name,
                address: {
                    street: customer.address.street,
                    city: customer.address.city,
                    number: customer.address.number,
                    zip: customer.address.zip
                }
            }))
        };
    }
}
