export interface ICaseApprovalMapping {
    triggerStatus: string,
    approvedStatus: string,
    noApprovalFoundStatus:string,
    rejectStatus: string
    mappingName:string
    errorStatus: string;
    company?: string;
}