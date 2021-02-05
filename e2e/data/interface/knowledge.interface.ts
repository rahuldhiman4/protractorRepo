export interface IKnowledgeSet {
    knowledgeSetTitle: string,
    knowledgeSetDesc: string,
    company: string,
    lineOfBusiness?: string
};

export interface IKnowledgeArticleTemplate {
    templateName: string,
    sectionTitle: string,
    templateDescription?: string,
    lineOfBusiness?: string,
    status?:string,
    knowledgeSetTitle: string,
};

export interface IKnowledgeArticles {
    knowledgeSet: string,
    title: string,
    templateId: string,
    company?: string,
    keyword?: string,
    categoryTier1?: string,
    categoryTier2?: string,
    categoryTier3?: string,
    region?: string,
    site?: string,
    articleId?: string,
    status?: string,
    assignedCompany?: string,
    assigneeBusinessUnit?: string,
    assigneeSupportGroup?: string,
    assignee?: string,
    articleDesc?: string,
    lineOfBusiness?: string,
    siteGroup?: string;
};

export interface IknowledgeSetPermissions {
    operation: string,
    type: string,
    value: string,
    securityType: string
};

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
    category4?: string,
    lineOfBusiness?: string
};

export interface IDocumentTemplate {
    templateName: string,
    description: string,
    messageBody: string,
    company?: string,
    lineOfBusiness?: string
};

export interface IUpdateKnowledgeArticle {
    linkedCounter: number,
    helpfulPercentage: number,
    helpfulCounter: number,
    viewCounter: number,
    notHelpfulCounter: number
};