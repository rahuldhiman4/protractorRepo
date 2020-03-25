export enum CaseTemplate {
    Active = 2000,
    Draft = 1000,
    Inactive = 3000,
}

export enum TaskTemplate {
    Active = 2000,
    Draft = 1000,
    Inactive = 3000,
}

export enum Case {
    Assigned = 2000,
    New = 1000,
}

export enum Knowledge {
    Draft = 2000,
    SMEReview = 3000,
    Published = 5000,
    Retired = 6000,
    Closed = 9000,
    Canceled = 7000,
}
export enum MenuItemStatus {
    Active = 0,
    Inactive = 5,
}

export enum NotificationType {
    Alert = 1,
    Email = 2,
    AlertAndEmail = 3,
}

export enum CaseStatus {
    New = 1000,
    Assigned = 2000,
    InProgress = 3000,
    Pending = 4000,
    Resolved = 5000,
    Closed = 7000,
    Canceled = 6000,
    AfterResolved = 5500
};

export enum TaskStatus {
    Staged = 1000,
    Assigned = 2000,
    InProgress = 3000,
    Pending = 4000,
    Completed = 5000,
    Canceled = 6000,
    Closed = 7000,
    Failed = 5500,
    BeforeCompleted = 3500,
    AfterCompleted = 5250
};

export enum CasePriority {
    Critical = 1000,
    High = 2000,
    Medium = 3000,
    Low = 4000
};

export enum ProcessLibConf {
    Active = 10
}