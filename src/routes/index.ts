import { Express } from "express";
import { collector } from "./collector";

// all new services should be places in here - this folder should be the only one touched

export function routeBuilder(app: Express) {

    // this is the generic collector for all submissions
    app.use("/api/collector", collector)

    //app.use("/api/example", exampleRouter);
}