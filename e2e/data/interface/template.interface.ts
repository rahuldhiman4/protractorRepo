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
    label?: string;
    lineOfBusiness?: string;
};

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
    categoryTier4?: string;
    businessUnit?: string;
    supportGroup?: string;
    department?: string;
    assignee?: string;
    description?: string;
    resolutionCode?: string;
    resolutionDescription?: string,
    caseStatus?: string,
    statusReason?: string,
    casePriority?: string,
    identityValidation?: string,
    assignmentMethod?: string,
    taskFailureConfiguration?: string,
    allowCaseReopen?: boolean,
    resolveCaseonLastTaskCompletion?: string,
    label?: string;
    lineOfBusiness?: string;
};

export interface IEmailTemplate {
    TemplateName: string,
    Company: string
    Status: string,
    Module?: string,
    Description: string,
    EmailMessageSubject: string,
    EmailMessageBody: string,
    lineOfBusiness?: string,
};

export interface INotesTemplate {
    templateName: string;
    templateStatus: number;
    company: string;
    body: string;
    label?: string;
    lineOfBusiness?: string,
};

export interface ICaseTemplateUI {
    templateName: string;
    templateSummary: string;
    templateDescription: string;
    company: string;
    templateStatus: string;
    ownerCompany: string;
    ownerBusinessUnit: string;
    ownerGroup: string;
    flowset: string;
    categoryTier1: string;
    categoryTier2: string;
    categoryTier3: string;
    businessUnit: string;
    supportGroup: string;
    assignee: string;
    resolutionCode: boolean;
    resolutionDescription: boolean,
    caseStatus: string,
    statusReason: string,
    casePriority: string,
    identityValidation: string,
    assignmentMethod: string,
    taskFailureConfiguration: string,
    allowCaseReopen: string
};

export interface IAutomatedStatusTransitionConfigUI {
    name: string;
    company: string;
    fromStatus: string;
    toStatus: string;
    changeStatusAfter: number;
}