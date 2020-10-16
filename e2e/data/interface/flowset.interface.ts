export interface IFlowset {
    flowsetName: string;
    flowsetStatus: number;
    company: string;
    description: string;
    lineOfBusiness?:string;
}

export interface IFlowsetProcess {
    applicationServicesLib: string;
    processName: string;
    processAliasName: string;
    company?: string;
    description?: string;
    status?: string;
}

export interface IFlowsetProcessMapping {
    function: string;
    registeredProcessId: string;
    status: string;
    flowsetId: string;
    company?: string;
}