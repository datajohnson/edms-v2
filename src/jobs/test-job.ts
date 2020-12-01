import { Job } from "node-schedule";


export class TestJob {

    name = "Test Job";
    jobSchedule = "*/1 * * * *"; // every 1/2 hour

    run(fireDate: Date) {
        console.log("RUNNING " + this.name + " : " + fireDate)
    }
}
