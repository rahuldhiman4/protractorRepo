export interface INOTIFICATIONEVENT {
    eventName: string;
    status?: number;
    company?: string;
    eventDescription?: string;
}

export interface INOTIFICATIONTEMPLATE {
    description: string;
    module: string;
    eventName: string;
    templateName: string;
    company?: string;
    alertMessage: string;
    emailBody: string;
    emailSubject: string;
}