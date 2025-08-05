import CreateCustomerUseCase from "../../../application/customer/create.customer.usecase";
import FindCustomerUseCase from "../../../application/customer/find.customer.usecase";
import ListCustomerUseCase from "../../../application/customer/list.customer.usecase";
import UpdateCustomerUseCase from "../../../application/customer/update.customer.usecase";
import HttpServer from "../../http/http.server";

export default class CustomerController {
    constructor(
        readonly httpServer: HttpServer,
        readonly createCustomer: CreateCustomerUseCase,
        readonly findCustomer: FindCustomerUseCase,
        readonly listCustomers: ListCustomerUseCase,
        readonly updateCustomer: UpdateCustomerUseCase
    ) {
        this.httpServer.route("post", "/customers", async (req: any, res: any) => {
            try {
                const input = req.body;
                const output = await this.createCustomer.execute(input);
                res.status(201).json(output);
            } catch (error: any) {
                res.status(400).json({ error: error.message });
            }
        });
        this.httpServer.route("get", "/customers/:id", async (req: any, res: any) => {
            try {
                const input = { id: req.params.id };
                const output = await this.findCustomer.execute(input);
                res.status(200).json(output);
            } catch (error: any) {
                res.status(404).json({ error: error.message });
            }
        });
        this.httpServer.route("get", "/customers", async (req: any, res: any) => {
            try {
                const output = await this.listCustomers.execute({});
                res.status(200).json(output);
            } catch (error: any) {
                res.status(500).json({ error: error.message });
            }
        });
        this.httpServer.route("put", "/customers/:id", async (req: any, res: any) => {
            try {
                const input = { id: req.params.id, ...req.body };
                const output = await this.updateCustomer.execute(input);
                res.status(200).json(output);
            } catch (error: any) {
                res.status(400).json({ error: error.message });
            }
        });
    }
}