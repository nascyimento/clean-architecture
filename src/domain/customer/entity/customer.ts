import Entity from "../../@shared/entity/entity.abstract";
import NotificationError from "../../@shared/notification/notification.error";
import CustomerValidatorFactory from "../factory/customer.validator.factory";
import Address from "../value-object/address";

export default class Customer extends Entity {
	private _name: string;
	private _address!: Address;
	private _active: boolean = false;
	private _rewardPoints: number = 0;

	constructor(id: string, name: string) {
		super();
		this._id = id;
		this._name = name;
		this.validate();
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
		CustomerValidatorFactory.create().validate(this);
		if (this.notification.hasErrors()) {
			throw new NotificationError(this.notification.getErrors());
		}
	}

	changeAddress(address: Address) {
		this._address = address;
	}
}
