export interface ICaseTemplate {
    templateName: string;
    templateSummary: string;
    templateStatus: string;
    caseCompany?: string;
    flowset?: string;
    caseStatus?: string,
    statusReason?: string,
    casePriority?: string,
    caseDescription?: string;
    categoryTier1?: string;
    categoryTier2?: string;
    categoryTier3?: string;
    assigneeCompany?: string;
    assigneeBU?: string;
    assigneeSupportGroup?: string;
    assignee?: string;
    resolutionCode?: boolean;
    resolutionDescription?: boolean,
    resolveCaseonLastTaskCompletion?:string
    identityValidation?: string,
    assignmentMethod?: string,
    taskFailureConfiguration?: string,
    allowCaseReopen?: string,
    ownerCompany?: string;
    ownerBU?: string;
    ownerGroup?: string;
}