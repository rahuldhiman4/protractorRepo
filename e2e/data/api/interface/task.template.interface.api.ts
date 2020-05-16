export interface ITaskTemplate {
    templateName: string;
    templateSummary: string;
    templateStatus: string;
    taskCompany:string;
    ownerCompany: string;
    ownerBusinessUnit:string;
    ownerGroup:string;
    priority?: string;
    processBundle?: string;
    processName?: string;
    assignedCompany?: string;
    businessUnit?:string;
    supportGroup?:string;
    assignee?:string;
}