import { getDatabaseConnection } from "../index";
import { ErrorLog } from "../models";

export class ErrorLogService {
    static async save(log: ErrorLog): Promise<number> {
        let knex = getDatabaseConnection()
        return (await knex("error_log").insert(log).returning("id"))[0];
    }

    static async getOne(id: number): Promise<ErrorLog | undefined> {
        let knex = getDatabaseConnection();
        return knex("error_log").where({ id }).first();
    }

    static async getAll(): Promise<ErrorLog[] | undefined> {
        let knex = getDatabaseConnection();
        return knex("error_log");
    }

    static async getAllForService(serviceName: string): Promise<ErrorLog[] | undefined> {
        let knex = getDatabaseConnection();
        return knex("error_log").where({ "service_name": serviceName })
    }
}
