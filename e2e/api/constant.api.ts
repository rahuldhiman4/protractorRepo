export enum CaseTemplate {
    Active = 2000,
    Draft = 1000,
    Inactive = 3000,
};

export enum NotificationEventStatus {
    Proposed = 0,
    Enabled = 1,
    Offline = 2,
    Obsolete = 3,
    Archive = 4,
    Delete = 5,
};

export enum TaskTemplate {
    Active = 2000,
    Draft = 1000,
    Inactive = 3000,
};

export enum Case {
    Assigned = 2000,
    New = 1000,
};

export enum Knowledge {
    Draft = 2000,
    SMEReview = 3000,
    Published = 5000,
    Retired = 6000,
    Closed = 9000,
    Canceled = 7000,
    PublishApproval = 4000,
    RetireApproval = 5500,
    CancelApproval = 6500,
    BeforePublished = 3500,
    AfterPublished = 5250
};

export enum MenuItemStatus {
    Active = 0,
    Inactive = 5,
    Deprecated = 10
};

export enum NotificationType {
    Alert = 1,
    Email = 2,
    AlertAndEmail = 3,
};

export enum CaseStatus {
    New = 1000,
    Assigned = 2000,
    InProgress = 3000,
    Pending = 4000,
    Resolved = 5000,
    Closed = 7000,
    Canceled = 6000,
    AfterResolved = 5500,
    ApprovalRejected = 1900
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
    AfterCompleted = 5250,
    ApprovalRejected = 1900
};

export enum CasePriority {
    Critical = 1000,
    High = 2000,
    Medium = 3000,
    Low = 4000
};

export enum ProcessLibConf {
    Active = 10
};

export enum SupportGroup {
    Offline = 2
};

export enum ApplicationConfigurationsGuid {
    ADD_DWP_SURVEY_ON_CASE = 'AGGADGG8ECDC0AQBWONEQAYYYH1NA0',
    NEXT_REVIEW_PERIOD = 'AGGAA5V0H3XY6AOTOXQROSSUUV80EW',
    RESOLUTION_CODE_MANDATORY ='AGGADGG8ECDC0APWYKX1PWAZUJ3W9J',
    RESOLUTION_DESCRIPTION_MANDATORY ='AGGADGG8ECDC0APWYKYZPWAZVW3WO3',
    IDENTITY_VALIDATION = 'AGGADG1AANVNMAP08K7NPJLS7DE71M',
};

export enum ApplicationConfigurationsValue {
    '1_MONTH' = '2629743',
    '1_MINUTE' = '60',
    'ENFORCED' = 2,
    'OPTIONAL' = 1,
    'NONE' = 0
};

export enum FunctionalRoleGuid {
    'Knowledge Coach' = 'AGGAA5V0H3XY6AOTLKINOSP72R7YAE',
    'Knowledge Publisher' = 'AGGAA5V0H3XY6AOTLL9ROSP8NW7YD9',
    'Case Agent' = 'AGGAA5V0GE9Z4AOR0BXUOQ3ZT04EJA',
    'Case Manager' = 'AGGAA5V0GE9Z4AOR7CWOOQLASE4PHJ',
    'Case Business Analyst' = 'AGGAA5V0GE9Z4AOR7DBBOQLAW74PH7',
    'Document Manager' = 'AGGADG1AAO0VGAP8SXEGP7VU2U4ZS8',
    'Person Activity Read' = 'AGGADG1AAO0VGAPSXWAEPSA6PDZAG6'
};

export enum TaskFailConfiguration {
    'Do Not Proceed' = 1000,
    'Proceed With Next Task' = 2000
};