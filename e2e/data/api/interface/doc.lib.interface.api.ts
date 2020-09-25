export interface IDocumentLib {
    docLibTitle: string,
    company: string,
    ownerGroup: string,
    shareExternally?: boolean,
    region?: string,
    site?: string,
    keywordTag?: string,
    description?: string,
    department?: string,
    businessUnit?: string,
    category1?: string,
    category2?: string,
    category3?: string,
    category4?: string
}

export interface IDocumentTemplate {
    templateName: string;
    description: string;
    messageBody: string;
    company?: string;
}

export interface IReadAccess {
templateName:string;
templateStatus:string;
templateSummary:string;
caseStatus:string;
casePriority:string;
categoryTier1?:string;
categoryTier2?:string;
categoryTier3?:string;
categoryTier4?:string;
company: string;
}