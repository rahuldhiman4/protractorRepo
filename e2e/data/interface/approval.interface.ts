export interface ICaseApprovalMapping {
    triggerStatus: string,
    approvedStatus: string,
    noApprovalFoundStatus: string,
    rejectStatus: string
    mappingName: string
    errorStatus: string;
    company?: string;
    flowset?:string;
};

export interface ITaskApprovalMapping {
    triggerStatus: string,
    approvedStatus: string,
    noApprovalFoundStatus: string,
    rejectStatus: string
    mappingName: string
    errorStatus: string;
    company?: string;
};

export interface IKnowledgeApprovalMapping {
    publishApproval?: string,
    requestCancelation?: string,
    retireApproval?: string,
    mappingName: string
    company?: string;
};