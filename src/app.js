import express from "express";
import routes from "./routes";
import "express-async-errors";
import Youch from "youch";
import * as Sentry from "@sentry/node";
import "./database";
import "dotenv/config";
import sentryConfig from "./config/sentry";
import setupSwagger from "./config/swagger";

class App {
    constructor() {
        this.server = express();
        Sentry.init(sentryConfig);
        this.middlewares();
        this.docs();
        this.routes();
        this.exceptionHandler();
    }

    middlewares() { 
        this.server.use(express.json());
        this.server.use(express.urlencoded({ extended: false }));
    }
    docs() {
        setupSwagger(this.server)
    }

    routes() {
        this.server.use(routes);
        Sentry.setupExpressErrorHandler(this.server);
    }
    

    exceptionHandler() {
        this.server.use(async (err, req, res) => {
            if (process.env.NODE_ENV === "development") {
                const errors = await new Youch(err, req).toJSON();
                return res.status(500).json(errors);
            }

            return res.status(500).json({ error: "Internal server error" });
        });
    }
}

export default new App().server;
