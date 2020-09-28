export interface IKnowledgeSet {
    knowledgeSetTitle: string,
    knowledgeSetDesc: string,
    company: string
}

export interface IKnowledgeArticleTemplate {
templateName: string;
company: string;
knowledgeSetId: string;
title: string;
}