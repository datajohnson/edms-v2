import { Response } from "express";

export async function doHealthCheck(res: Response) {

    // maybe check the env vars
    // maybe check files are writing to FS

    return res.status(200).send("HEALTHY");
}