export default interface EventInterface {
	time: Date;
	payload: any;
	getName(): string;
}
