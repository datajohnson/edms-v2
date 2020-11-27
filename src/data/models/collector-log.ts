import { CollectedFile } from "./collected-file";

export interface CollectorLog {
    id?: number;
    create_date?: Date;
    service_name: string;
    source_ip: string;
    url: string;
    query: string;
    headers: string;
    signed_cookies: string;
    files: string[];
    status: CollectorStatus;
    fileData?:CollectedFile[];
};

export enum CollectorStatus {
    COLLECTED = "collected",
    READ = "read",
    PROCESSED = "processed",
    ERROR = "error"
}
