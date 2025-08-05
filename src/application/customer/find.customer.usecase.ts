import CustomerRepositoryInterface from "../../domain/customer/repository/customer.repository.interface";


export interface FindCustomerInputDto {
    id: string;
}

export interface FindCustomerOutputDto {
    id: string;
    name: string;
    address: {
        street: string;
        city: string;
        number: number;
        zip: string;
    };
}

export default class FindCustomerUseCase {
    constructor(readonly customerRepository: CustomerRepositoryInterface) { }

    async execute(input: FindCustomerInputDto): Promise<FindCustomerOutputDto> {
        const customer = await this.customerRepository.findById(input.id);
        if (!customer) throw new Error("Customer not found");

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