
import { CollectedFile, CollectedFileType } from "../data/models/collected-file";
import { createTransport } from "nodemailer";
import { Attachment } from "nodemailer/lib/mailer";
import { EMAIL_USER, EMAIL_PASS, EMAIL_HOST, EMAIL_FROM } from "../config"

const transporter = createTransport({
    host: EMAIL_HOST,
    secure: false,
    port: 587,
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS
    },
    requireTLS: true,
    tls: {
        ciphers: 'SSLv3'
    }
});

export class Emailer {

    static async sendEmail(recipients: string[], subject: string, body: string, attachments: CollectedFile[]) {
        console.log(`Sending email to: ${recipients}`);

        let attachArray = new Array<Attachment>();

        attachments.forEach(attach => {
            if (attach.type == CollectedFileType.ATTACHMENT) {
                attachArray.push({
                    filename: attach.name,
                    content: attach.data,
                    contentType: attach.mimetype
                })
            }
        });

        return transporter.sendMail({
            to: recipients,
            from: EMAIL_FROM,
            subject: subject,
            html: body,
            attachments: attachArray
        });
    }
}