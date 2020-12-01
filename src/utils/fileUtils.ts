import { createWriteStream, createReadStream, existsSync, mkdirSync, readdirSync, lstatSync, unlinkSync, rmdirSync } from "fs";
import { createCipheriv, createDecipheriv } from "crypto";
import { Readable } from "stream";
import { ENCRYPTION_KEY, ENCRYPTION_IV } from "../config";
import { join } from "path";

const algorithm = 'aes-256-ctr';
const key = ENCRYPTION_KEY;
const iv = Buffer.from(ENCRYPTION_IV).slice(0, 16);


export function createDirectory(path: string): void {
    mkdirSync(path, { recursive: true });
}

export function deleteDirectory(path: string): void {
    if (existsSync(path)) {
        readdirSync(path).forEach((file, index) => {
            const curPath = join(path, file);
            if (lstatSync(curPath).isDirectory()) { // recurse
                deleteDirectory(curPath);
            } else { // delete file
                unlinkSync(curPath);
            }
        });
        rmdirSync(path);
    }
}

export async function writeEncryptedFile(filename: string, content: Buffer): Promise<string> {
    let cipher = createCipheriv(algorithm, Buffer.from(key), iv);

    return new Promise(async (resolve, reject) => {
        let reader = new Readable();
        reader._read = () => { }; // the read function is irrelevant, so dummy it in
        reader.push(content);
        reader.push(null);

        let output = createWriteStream(filename);

        await reader.pipe(cipher).pipe(output)
            .on("finish", () => {
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
