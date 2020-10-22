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
}

export interface IEmailConfig {
    email: string;
    description?: string;
    company?: string;
    lineOfBusiness?: string;
}