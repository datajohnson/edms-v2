import { Emailer } from "../utils/emailer";
import { CollectorLogService } from "../data/services/collector-log-service";
import { CollectedFileType } from "../data/models/collected-file";

export const SCHEDULE = "*/1 * * * *"; // every 2 minutes
const SERVICE_NAME = "magic";
export const JOB_NAME = "Test Job"
const RECIPIENT = "info@icefoganalytics.com";

const service = new CollectorLogService();

export class TestJob {
    name = JOB_NAME;
    jobSchedule = SCHEDULE;

    async run(fireDate: Date) {
        console.log(`|------------------------------------------`);;
        console.log(`|--- Running ${this.name} @ ${fireDate}`);

        let submissions = await service.getAllForService(SERVICE_NAME);

        console.log(`|--- ${this.name} found ${submissions.length} unprocessed submissions`)

        // this just sends a simple emails with the request body in the body and attachments with it
        // after it processes each submission, it gets marked as 'processed' and the files are deleted
        submissions.forEach(async (submission) => {
            let files = await service.getFilesFor(submission).then(res => res);
            let body = "";

            files.forEach(file => {
                if (file.type == CollectedFileType.BODY) {
                    body += JSON.stringify(file.data) + "<br/>";
                }
            })

            await Emailer.sendEmail(new Array<string>(RECIPIENT), "SENT FROM COLLECTOR", body, files)
                .then(res => {
                    //console.log("EMAIL response:", res);
                    service.completeProcessing(submission);
                }).catch(res => {
                    console.log("EMAIL error:", res);
                });
        });

        console.log(`|---${this.name} completed --------------------`)
    }
}
