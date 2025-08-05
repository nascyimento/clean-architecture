import Customer from "../entity/customer";
import Address from "../value-object/address";
import { v4 as uuid } from 'uuid';

export default class CustomerFactory {
	static create(name: string): Customer {
		return new Customer(uuid(), name);
	}

	static createWithAddress(name: string, street: string, number: number, city: string, zip: string): Customer {
		const customer = new Customer(uuid(), name);
		customer.address = new Address(street, number, city, zip);
		return customer
	}
}
