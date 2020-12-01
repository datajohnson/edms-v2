import { Emailer } from "../utils/emailer";
import { CollectorLogService } from "../data/services/collector-log-service";
import { CollectedFileType } from "../data/models/collected-file";

const SCHEDULE = "*/5 * * * *"; // every 5 minutes
const SERVICE_NAME = "magic";
const JOB_NAME = "Test Job"

export class TestJob {
    name = JOB_NAME;
    jobSchedule = SCHEDULE;

    async run(fireDate: Date) {
        console.log(`|------------------------------------------`);;
        console.log(`|--- Running ${this.name} @ ${fireDate}`);

        let submissions = await CollectorLogService.getAllForService(SERVICE_NAME);
        console.log(`|--- ${this.name} found ${submissions.length} unprocessed submissions`)

        // this just sends a simple emails with the request body in the body and attachments with it
        // after it processes each submission, it gets marked as 'processed' and the files are deleted
        submissions.forEach(async (submission) => {
            let files = await CollectorLogService.getFilesFor(submission).then(res => res);
            let body = "";

            files.forEach(file => {
                if (file.type == CollectedFileType.BODY) {
                    body += JSON.stringify(file.data) + "<br/>";
                }
            })

            await Emailer.sendEmail(new Array<string>("michael@icefoganalytics.com"), "SENT FROM COLLECTOR", body, files);
            await CollectorLogService.completeProcessing(submission);
        });

        console.log(`|---${this.name} completed --------------------`)
    }
}
