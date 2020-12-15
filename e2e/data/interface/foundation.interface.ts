export interface IPerson {
    firstName: string;
    lastName: string;
    userId: string;
    emailId?: string;
    userPermission?: string[];
    company?: string;
};

export interface IFoundationEntity {
    userId?: string;
    emailId?: string;
    userPermission?: string;
    vipStatus?: string;
    confidential?: string;
    functionalRole?: string;
    abbreviation?: string;
};

export interface IDomainTag {
    domainTagName: string,
    bundleId?: string
};

export interface IBusinessUnit {
    orgName: string,
    relatedOrgId: string,
    domainTag?: string,
    orgDescription?: string
};

export interface IDepartment {
    orgName: string,
    relatedOrgId: string,
    domainTag?: string,
    orgDescroption?: string
};

export interface ISupportGroup {
    orgName: string,
    relatedOrgId: string,
    domainTag?: string,
    orgDescription?: string,
    status?: string
};

export interface ILOB {
    lobName: string,
    description: string,
    status?: string,
};

export interface IMenuItem {
    menuItemName: string;
    menuItemStatus: string;
    menuType: string;
    uiVisible?:string;
    lineOfBusiness?:string;
} 
