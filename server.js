import express from "express";
import cors from "cors";
import morgan from "morgan";
import { userRouter } from "./routers/userRouter.js";
import { selectRouter } from "./routers/selectRouter.js";
import { studentRouter } from "./routers/studentRouter.js"
import { requestRouter } from "./routers/requestRouter.js"
import { assistantshipRouter } from "./routers/assistantshipRouter.js"
import { config } from "dotenv";
import cookieParser from "cookie-parser";

const corsOptions = { // CORS politics
    origin: true,  // all IP is enabled to connect
    credentials: true,
};

config()

export class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.path = {
            api: "/api",
        };

        this.middleware();
        this.routes();
    }

    middleware() {
        this.app.use(express.json());
        this.app.use(morgan("dev"));
        this.app.use(cors(corsOptions));
        this.app.use(cookieParser());
        this.app.use(express.urlencoded({ extended: true }));
    };

    routes(){
        this.app.use(`${this.path.api}/users`, userRouter);
        this.app.use(`${this.path.api}/select`, selectRouter);
        this.app.use(`${this.path.api}/student`, studentRouter);
        this.app.use(`${this.path.api}/request`, requestRouter);
        this.app.use(`${this.path.api}/assistantship`, assistantshipRouter);
    }

    listen() {
        this.app.listen(this.port , () => {
            console.log("server runnning on port:" , this.port);
        });
    };
};



