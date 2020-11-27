import { FILE_PATH } from "../../config";
import { CollectedFile, CollectedFileType } from "../models/collected-file";
import { existsSync } from "fs";
import { join, parse } from "path";
import { readEncryptedFile } from "../../utils/fileUtils";
import { getDatabaseConnection } from "../index";
import { CollectorLog, CollectorStatus } from "../models";

export class CollectorLogService {
    static async save(log: CollectorLog): Promise<number> {
        let knex = getDatabaseConnection()
        return (await knex("collector_log").insert(log).returning("id"))[0];
    }

    static async getOne(id: number): Promise<CollectorLog | undefined> {
        let knex = getDatabaseConnection();
        var log = await knex("collector_log").where({ id }).first();

        // mark this record as read
        if (log) {
            log.status = CollectorStatus.READ;
            this.updateStatus(log, CollectorStatus.READ);
        }

        return log;
    }

    static async updateStatus(log: CollectorLog, status: CollectorStatus): Promise<void> {
        let knex = getDatabaseConnection();
        return knex.raw(`UPDATE collector_log SET status = '${status}' WHERE id = ${log.id}`);
    }

    static async getAll(): Promise<CollectorLog[]> {
        let knex = getDatabaseConnection();
        return knex("collector_log");
    }

    static async getAllForService(serviceName: string): Promise<CollectorLog[]> {
        let knex = getDatabaseConnection();
        return knex("collector_log").where({ "service_name": serviceName })
    }

    static async getFilesFor(log: CollectorLog): Promise<CollectedFile[]> {
        return new Promise(async (resolve, reject) => {
            let serviceName = log.service_name;
            let id = log.id || 0;
            let results = new Array<CollectedFile>();

            await Promise.all(log.files.map(async (file) => {
                var parsed = JSON.parse(file) as CollectedFile;
                let filePath = join(FILE_PATH, serviceName, id.toString(), parsed.encrypted_name);

                if (existsSync(filePath)) {
                    parsed.data = await readEncryptedFile(filePath).then(b => b)
                }

                if (parsed.data && parsed.type == CollectedFileType.BODY) {

                    var data = JSON.parse(parsed.data.toString());
                    parsed.data = data;
                }

                results.push(parsed);
            }));

            resolve(results);
        });
    }
}
