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