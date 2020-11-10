import { Express } from "express";
import { exampleRouter } from "./example-service"

// all new services should be places in here - this folder should be the only one touched

export function routeBuilder(app: Express) {
    app.use("/api/example", exampleRouter);
}