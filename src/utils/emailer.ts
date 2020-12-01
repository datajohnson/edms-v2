
import { CollectedFile, CollectedFileType } from "../data/models/collected-file";
import { createTransport } from "nodemailer";
import { Attachment } from "nodemailer/lib/mailer";
import { EMAIL_USER, EMAIL_PASS, EMAIL_HOST } from "../config"

const transporter = createTransport({
    service: EMAIL_HOST,
    secure: true,
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS
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
        })

        transporter.sendMail({
            to: recipients,
            from: EMAIL_USER,
            subject: subject,
            html: body,
            attachments: attachArray
        }).then(res => {
            console.log("EMAIL response:", res);
        }).catch(res => {
            console.log("EMAIL error:", res);
        });
    }
}