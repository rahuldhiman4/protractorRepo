export interface ICreateSVT {
    "terms": string,
    "readableTerms": string,
    "startWhen": string,
    "readableStartWhen": string,
    "stopWhen": string,
    "readableStopWhen": string,
    "goalTimeMinutes": string,
    "dataSource": string,
    "company": string,
    "svtName": string,
    "lineOfBusiness"?: string
};

export interface ICreateSVTGroup {​​
    "svtGroupName": string,
    "company"?: string,
    "dataSource": string,
    "goalType"?: string,
    "lineOfBusiness"?: string
}​​;

export interface ICreateSVTGoalType {​​
    "svtGoalTypeName": string,
    "status":number,
    "lineOfBusiness"?: string
}​​;
