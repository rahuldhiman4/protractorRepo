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
}