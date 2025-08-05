import express, { Request, Response } from 'express';
import cors from 'cors';

export default interface HttpServer {
    route(method: string, path: string, callback: Function): void;
    listen(port: number): void;
}

export class ExpressHttpServer implements HttpServer {
    private app: any;

    constructor() {
        this.app = express();
        this.app.use(cors());
        this.app.use(express.json());
    }

    route(method: string, path: string, callback: Function): void {
        this.app[method](path, (req: Request, res: Response) => {
            callback(req, res);
        });
    }

    listen(port: number): void {
        this.app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    }
}