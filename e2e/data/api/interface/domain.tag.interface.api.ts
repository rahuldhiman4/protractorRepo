export interface IDomainTag {
    domainTagName: string,
    bundleId?: string
}

export interface IUpdateKnowledgeArticle {
    linkedCounter: number;
    helpfulPercentage: number;
    helpfulCounter: number;
    viewCounter: number;
    notHelpfulCounter: number;
}