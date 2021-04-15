export interface INotificationEvent {
    eventName: string;
    status?: number;
    company?: string;
    eventDescription?: string;
    lineOfBusiness?: string
}

export interface INotificationTemplate {
    description: string;
    module: string;
    eventName: string;
    templateName: string;
    company?: string;
    alertMessage: string;
    emailBody: string;
    emailSubject: string;
    lineOfBusiness?:string;
}

export interface IEmailConfig {
    email: string;
    incomingMailBoxName?: string;
    status?: string;
    description?: string;
    company?: string;
    lineOfBusiness?: string;
}

export interface IEmailMailboxConfig {
    mailBoxName: string;
    emailServerUser?: string;
}