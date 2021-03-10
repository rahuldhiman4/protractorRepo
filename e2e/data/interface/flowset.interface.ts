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
    flowsetId: string;
    processName: string
    processNameFull: string;
    function?: string;
    status?: string;
    company?: string;
    lineOfBusiness?: string;
}