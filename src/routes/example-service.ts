import express, { Request, Response } from "express";
import { saveFile } from "../utils/fileUtils";

export const exampleRouter = express.Router();

exampleRouter.post("/", async (req: Request, res: Response) => {

    if (req.files && req.files.file1) {

        console.log(req.files.file1)

        const worked = await saveFile("SUBMISSION", req.files.file1.name, req.files.file1.data);
        console.log("BODY", req.body)

        if (worked)
            res.send("THIS WORKED");
        else
            res.send("FEILED")

        return;
    }

    res.send("You didn't include a file");
});
