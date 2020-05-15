export interface ITaskTemplate {
    templateName: string;
    templateSummary: string;
    templateStatus: string;
    priority?: string;
    company?: string;
    processBundle?: string;
    processName?: string;
    assignedCompany?: string;
    businessUnit?:string;
    supportGroup?:string;
    assignee?:string;
    ownerGroup?:string;
    taskCompany?:string;
}