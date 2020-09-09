export interface IFlowset {
    flowsetName: string;
    flowsetStatus: string;
    company: string;
    description: string;
}

export interface IProcessLibConfig {
    applicationServicesLib: string;
    processName: string;
    processAliasName: string;
    company?: string;
    description?: string;
    status?: string;
}

export interface IProcessFlowsetMapping {
    function: string;
    registeredProcessId: string;
    status: string;
    flowsetId: string;
    company?: string;
}