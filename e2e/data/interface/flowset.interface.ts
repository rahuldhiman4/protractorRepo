export interface IFlowset {
    flowsetName: string;
    flowsetStatus: number;
    company: string;
    description: string;
    lineOfBusiness?: string;
}

export interface IFlowsetProcess {
    applicationServicesLib: string;
    processName: string;
    processAliasName: string;
    company?: string;
    description?: string;
    status?: string;
    lineOfBusiness?: string;
}

export interface IFlowsetProcessMapping {
    function: string;
    processNameFull: string;
    processName: string
    status: string;
    flowsetId: string;
    company?: string;
    lineOfBusiness?: string;
}