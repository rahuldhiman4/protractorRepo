export interface ITaskUpdate {
    summary?: string;
    description?: string;
    priority?: string;
};

export interface IAdhocTask {
    taskName: string;
    company: string;
    description?: string;
    businessUnit: string;
    supportGroup: string;
    assignee?: string;
    priority?: string;
    label?: string;
    category1?: string;
    category2?: string;
    category3?: string;
    targetDate?: string;
    lineOfBusiness?: string;
    requester?: string;
};