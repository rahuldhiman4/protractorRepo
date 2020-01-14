export interface ITaskTemplate {
    templateName: string;
    templateSummary: string;
    templateStatus: string;
    company?: string;
    processBundle?: string;
    processName?: string;
    supportGroup?:string;
    assignee?:string;
}