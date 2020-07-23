export interface ITaskTemplate {
    templateName: string;
    templateSummary: string;
    templateStatus: string;
    taskCompany: string;
    ownerCompany: string;
    ownerBusinessUnit: string;
    ownerGroup: string;
    description?: string;
    category1?: string;
    category2?: string;
    category3?: string;
    category4?: string;
    priority?: string;
    processBundle?: string;
    processName?: string;
    assignedCompany?: string;
    businessUnit?: string;
    supportGroup?: string;
    assignee?: string;
    label?: string
};

export interface IAdhocTask {
    taskName: string;
    company: string;
    description?:string;
    businessUnit: string;
    supportGroup: string;
    assignee?: string;
    priority?: string;
}