const fs = require("fs");
var archiver = require('archiver');

archiver.registerFormat('zip-encryptable', require('archiver-zip-encryptable'));

export async function saveFile(name: string, originalFilename: string, content: Buffer): Promise<boolean> {

    console.log(name, content);

    return new Promise(async (resolve, reject) => {

        await fs.writeFile("./" + originalFilename, content, (err: any) => {
            if (err) {
                console.error("ERROR WRITING FILE", err)
                return reject("File not written")
            }
            else {
                var output = fs.createWriteStream(__dirname + '/example.zip');
                var archive = archiver('zip-encryptable', {
                    zlib: { level: 9 },
                    forceLocalTime: true, 
                    password: 'test'
                });
                archive.pipe(output);

                archive.append(content, { name: originalFilename });

                archive.finalize();



                return resolve(true);


            }
        });
    });
}
