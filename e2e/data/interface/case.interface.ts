export interface ICaseAssignmentMapping {
    siteGroup?: string;
    assignmentMappingName: string;
    company: string;
    supportCompany: string;
    supportGroup: string;
    flowset?: string;
    categoryTier1?: string;
    categoryTier2?: string;
    categoryTier3?: string;
    categoryTier4?: string;
    priority?: string;
    label?: string;
    region?: string;
    site?: string;
    useAsDefault?: boolean;
    businessUnit?: string;
    department?: string;
    assignee?: string;
    lineOfBusiness?: string;
};

export interface ICreateCaseDWP {
    requester: string;
    summary: string;
    "Line of Business"?: string;
    "Service Request Display ID"?: string;
}

export interface ICreateCase {
    Requester: string;
    Summary?: string;
    Description?: string;
    Assignee?: string;
    Status?: string;
    Priority?: string;
    Department?: string;
    Company?: string;
    Contact?: string;
    "Assigned Company"?: string;
    "Business Unit"?: string;
    "Support Group"?: string;
    "Case Template ID"?: string;
    Origin?: string;
    Source?: string;
    "Service Request ID"?: string;
    "Category Tier 1"?: string;
    "Category Tier 2"?: string;
    "Category Tier 3"?: string;
    "Category Tier 4"?: string;
    "Target Date"?:string;
    "Label"?: string;
    "Line of Business"?: string;
}

export interface IUpdateCaseAccess {
    operation: string;
    type: string;
    security: string;
    username: string;
}

export interface IReadAccess {
    category1?: string;
    category2?: string;
    category3?: string;
    category4?: string;
    company: string;
    label?: string;
    priority?: string;
    businessUnit: string;
    supportGroup: string;
    assignedCompany: string;
    configName: string;
    lineOfBusiness?: string;
};

export interface ICaseUpdate {
    summary?: string;
    description?: string;
    statusChangedDate?: string;
    casePriority?: string;
};
