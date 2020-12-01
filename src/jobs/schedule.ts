
import { scheduleJob } from "node-schedule";
import { TestJob } from "./test-job";


export function startScheduler() {
    var test = new TestJob();

    console.log("|------------------------------------------")
    console.log("|- Starting the scheduler!");
    console.log("|-- Adding job: " + test.name);
    console.log("|------------------------------------------")

    scheduleJob(test.name, test.jobSchedule, test.run);
}
