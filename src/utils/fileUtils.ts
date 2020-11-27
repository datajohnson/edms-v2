import { createWriteStream, createReadStream, existsSync, mkdirSync } from "fs";
import { createCipheriv, createDecipheriv } from "crypto";
import { Readable, Writable } from "stream";
import { ENCRYPTION_KEY, ENCRYPTION_IV } from "../config";

const algorithm = 'aes-256-ctr';
const key = ENCRYPTION_KEY;
const iv = Buffer.from(ENCRYPTION_IV).slice(0, 16);


export function createDirectory(path: string): void {
    console.log("TRYING TO CREATE DIRECTORY: " + path)
    mkdirSync(path, { recursive: true });
}

export async function writeEncryptedFile(filename: string, content: Buffer): Promise<string> {
    let cipher = createCipheriv(algorithm, Buffer.from(key), iv);

    console.log(filename, content)

    return new Promise(async (resolve, reject) => {
        let reader = new Readable();
        reader._read = () => { }; // the read function is irrelevant, so dummy it in
        reader.push(content);
        reader.push(null);

        console.log("TRYING TO WRITE LOG TO : ", filename)

        let output = createWriteStream(filename);

        await reader.pipe(cipher).pipe(output)
            .on("finish", () => {
                console.log("IN FINISH")
                resolve(filename);
            })
            .on("error", () => {
                console.error("ERROR ENCRYPTING FILE")
                reject("Trouble writing the encrypted file.")
            });
    });
};

export async function readEncryptedFile(filename: string): Promise<Buffer> {
    return new Promise(async (resolve, reject) => {

        if (!existsSync(filename))
            return reject("File does not exist");

        let decipher = createDecipheriv(algorithm, Buffer.from(key), iv);
        let input = createReadStream(filename);
        let output = createWriteStream(filename + ".new.txt");
        let writer = new Writable();

        let buff = new Array<Uint8Array>();

        input.pipe(decipher)
            .on("data", (data) => {
                buff.push(data);
            })
            .on("end", () => {
                resolve(Buffer.concat(buff));
            })
            .on("error", () => {
                console.error("ERROR DECRYPTING FILE")
                reject("Trouble reading the encrypted file.")
            });
    });
}
