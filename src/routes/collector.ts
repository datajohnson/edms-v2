import { CollectorLog, CollectorStatus } from "../data/models";
import express, { Request, Response } from "express";
import { writeEncryptedFile, createDirectory } from "../utils/fileUtils";
import { CollectorLogService } from "../data/services/collector-log-service";
import { FILE_PATH } from "../config";
import { join } from "path";
import { existsSync } from "fs";
import { v4 as uuidv4 } from "uuid";
import { CollectedFileType } from "../data/models/collected-file";
import { NODE_ENV } from "../config";

export const collector = express.Router();

collector.post("/:service_name", async (req: Request, res: Response) => {
    let log: CollectorLog;
    log = {
        service_name: req.params.service_name,
        source_ip: req.ip,
        url: req.originalUrl,
        query: JSON.stringify(req.query),
        headers: JSON.stringify(req.headers),
        signed_cookies: req.signedCookies,
        files: new Array<string>(),
        status: CollectorStatus.COLLECTED
    };

    let fileArray = new Array<any>();

    if (req.body) {
        let bodyData: any;
        bodyData = {};
        bodyData.name = "REQUEST_BODY"
        bodyData.form_name = "body";
        bodyData.encrypted_name = uuidv4();
        bodyData.type = CollectedFileType.BODY;

        log.files.push(JSON.stringify(bodyData));

        bodyData.data = JSON.stringify(req.body);
        fileArray.push(bodyData);
    }

    if (req.files) {
        for (var attributename in req.files) {
            var file = req.files[attributename];

            if (Array.isArray(file)) {

                file.forEach(childFile => {
                    childFile.form_name = attributename;
                    childFile.encrypted_name = uuidv4();
                    fileArray.push(childFile);

                    log.files.push(JSON.stringify({
                        form_name: attributename,
                        name: childFile.name,
                        size: childFile.size,
                        mimetype: childFile.mimetype,
                        encrypted_name: childFile.encrypted_name,
                        type: CollectedFileType.ATTACHMENT
                    }));
                })
            }
            else {
                file.form_name = attributename;
                file.encrypted_name = uuidv4();
                fileArray.push(file);

                log.files.push(JSON.stringify({
                    form_name: attributename,
                    name: file.name,
                    size: file.size,
                    mimetype: file.mimetype,
                    encrypted_name: file.encrypted_name,
                    type: CollectedFileType.ATTACHMENT
                }));
            }
        }
    }

    let newRowId = await CollectorLogService.save(log);
    let dataPath = join(FILE_PATH, log.service_name, newRowId.toString());

    createDirectory(dataPath);

    fileArray.forEach(async function (fileData) {
        let filePath = join(dataPath, fileData.encrypted_name as string);
        var fileIndex = 1;

        // just in case a file name collision (which should never happen)
        while (existsSync(filePath)) {
            filePath = join(dataPath, fileData.form_name + "_" + fileIndex.toString());
            fileIndex++;
        }

        await writeEncryptedFile(filePath, fileData.data)
            .then(val => {
                console.log("Encrypted file written: ", val);
            })
            .catch(err => {
                console.error("THE ERROR MESSAGE", err);
            })
    });

    res.status(200).send("Recieved");
});

// only allow pull the submission when running in development
// this is used for testing only
if (NODE_ENV === "development" || NODE_ENV === "docker") {
    collector.get("/:service_name/:id", async (req: Request, res: Response) => {
        var row = await CollectorLogService.getOne(parseInt(req.params.id));

        if (row) {
            let files = await CollectorLogService.getFilesFor(row).then(res => res);
            console.log("TESTING FILES:", files);
        }

        res.send(row)
    });
}
