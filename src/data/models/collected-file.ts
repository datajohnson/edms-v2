
export interface CollectedFile {
    form_name: string;
    encrypted_name: string;
    name: string;
    size: number;
    mimetype: string;
    data?: Buffer;
    type: CollectedFileType;
};

export enum CollectedFileType {
    ATTACHMENT = "attachment",
    BODY = "body"
}
