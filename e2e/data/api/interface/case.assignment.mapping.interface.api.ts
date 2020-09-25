export interface ICaseAssignmentMapping {
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
};

export interface ICreateCaseDWP {
    requester: string;
    summary: string;
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
}

export interface IUpdateCaseAccess {
    operation: string;
    type: string;
    security: string;
    username: string;
}