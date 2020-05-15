export interface ICaseTemplate {
    templateName: string;
    templateSummary: string;
    templateStatus: string;
    company?: string;
    ownerCompany?: string;
    ownerBU?: string;
    ownerGroup?: string;
    flowset?: string;
    categoryTier1?: string;
    categoryTier2?: string;
    categoryTier3?: string;
    supportGroup?: string;
    assignee?: string;
    description?: string;
    resolutionCode?: boolean;
    resolutionDescription?: boolean,
    caseStatus?: string,
    statusReason?: string,
    casePriority?: string,
    identityValidation?: string,
    assignmentMethod?: string,
    taskFailureConfiguration?: string,
    allowCaseReopen?: string,
    resolveCaseonLastTaskCompletion?:string
}