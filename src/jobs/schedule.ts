import { scheduleJob } from "node-schedule";
import { TestJob, SCHEDULE, JOB_NAME } from "./test-job";

export function startScheduler() {

    console.log("|------------------------------------------")
    console.log("|- Starting the scheduler!");
    console.log("|-- Adding job: " + JOB_NAME);
    console.log("|------------------------------------------")

    scheduleJob(SCHEDULE, (fireDate) => {
        let t2 = new TestJob()
        t2.run(fireDate);        
    });
}
