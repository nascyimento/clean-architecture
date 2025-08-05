import Address from "../value-object/address";

export default class Customer {
	private readonly _id: string;
	private _name: string;
	private _address!: Address;
	private _active: boolean = false;
	private _rewardPoints: number = 0;

	constructor(id: string, name: string) {
		this._id = id;
		this._name = name;
		this.validate();
	}

	get id(): string {
		return this._id;
	}

	get name(): string {
		return this._name;
	}

	set address(address: Address) {
		this._address = address;
	}

	get address(): Address {
		return this._address;
	}

	get rewardPoints(): number {
		return this._rewardPoints;
	}

	changeName(name: string) {
		this._name = name;
		this.validate();
	}

	activate() {
		if (!this._address) {
			throw new Error('Address is mandatory to activate customer');
		}
		this._active = true;
	}

	deactivate() {
		this._active = false;
	}

	isActive(): boolean {
		return this._active;
	}

	addRewardPoints(points: number) {
		if (points < 0) {
			throw new Error('Points should be positive');
		}
		this._rewardPoints += points;
	}

	validate() {
		if (this._name.length === 0) {
			throw new Error('Name is required');
		}
		if (this._id.length === 0) {
			throw new Error('Id is required');
		}
	}

	changeAddress(address: Address) {
		this._address = address;
	}
}
