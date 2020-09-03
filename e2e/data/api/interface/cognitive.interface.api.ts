export interface ICognitiveDataSet {
    name?: string;
    description?: string;
    locale?: string;
    recordDefinition?: string;
};

export interface ICognitiveDataSetMapping {
    name: string;
    company: string;
    dataset: string;
    enable: boolean;
    confidenceLevelAutomatic: number;
    confidenceLevelAgent: number;
}