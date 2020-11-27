import Knex, { MigratorConfig } from "knex";
import { DB_HOST, DB_NAME, DB_PASS, DB_PORT, DB_USER } from "../config";
import { join } from "path";
//import { CollectionLog } from "./models/collection-log";

export function getDatabaseConnection(): Knex {
    return Knex({
        client: "postgresql",
        connection: {
            host: DB_HOST,
            database: DB_NAME,
            user: DB_USER,
            password: DB_PASS,
            port: parseInt(DB_PORT)
        }
    });
}

export async function runMigrations() {

    console.log("-------- MIGRATIONS ---------")
    let k = getDatabaseConnection();

    let config: MigratorConfig;
    config = {};
    config.directory = join(__dirname, "migrations");

    var m = await k.migrate.list(config);
    console.log("Migrations", m)

    m = await k.migrate.latest(config);

    console.log("Migrations", m)
    console.log("-------- /MIGRATIONS ---------")

    /* let logs = await k<RunLog>("run_log")
    console.log(logs);

    var newLog: RunLog;
    newLog = {
        service_name: "Testing",
        hasBody: true, 
        referrer: "12354", 
        files: ["FILES 1", "Files2"]
    };

    await k("run_log").insert(newLog); */

}