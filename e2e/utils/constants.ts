export enum security {
    readAccess = "READ",
    witeAccess = "WRITE"
}

export enum operation {
    deleteAccess = "DELETE",
    addAccess = "ADD"
}

export enum type {
    user = "USER",
    group = "GROUP"
}

export enum DropDownType {
    Label,
    WebElement,
    Name,
}

export const BWF_BASE_URL = '/helix/index.html#/com.bmc.dsm.bwfa';

export const BWF_PAGE_TITLES = {

    APPLICATION_CONFIGURATIONS: {
        ADOBE_SIGN_CONFIGURATION: 'Adobe Sign Configuration - Settings - Business Workflows',
        COMMON_CONFIGURATION: 'Common Configurations - Settings - Business Workflows',
        DOCU_SIGN_CONFIGURATION: 'Docu Sign Configurations - Settings - Business Workflows',
        DOMAIN_CONFIGURATION: 'Domain Configurations - Settings - Business Workflows',
        DYNAMIC_FILED_LIBRARY: 'Dynamic Field Library - Settings - Business Workflows',
        DYNAMIC_GROUP_LIBRARY: 'Dynamic Group Library - Settings - Business Workflows',
        FIELD_ASSOCIATIONS: 'Field Associations - Settings - Business Workflows',
        MENU_ITEMS: 'Menu Items - Settings - Business Workflows',
        WHITELIST_CONFIGURATION: 'Whitelist Configurations - Settings - Business Workflows',

    },
    APPROVALS: {
        APPROVAL_CONFIGURATION: 'Approval Configuration - Settings - Business Workflows',
        NOTIFICATION_CONFIGURATION: 'Notification Configuration - Settings - Business Workflows',

    },
    CASE_MANAGEMENT: {
        APPROVALS: 'Approval Mappings - Settings - Business Workflows',
        ASSIGNMENTS: 'Assignments - Settings - Business Workflows',
        AUTOMATED_STATUS_TRANSITION: 'Automated Status Transition - Settings - Business Workflows',
        COGNITIVE: {
            CATEGORIZATION: 'Categorization - Settings - Business Workflows',
            TEMPLATE: 'Template - Settings - Business Workflows',
        },
        NOTES_TEMPLATES: 'Notes Template - Settings - Business Workflows',
        READ_ACCESS: 'Read Access - Settings - Business Workflows',
        STATUS_CONFIGURATION: 'Status Configuration - Settings - Business Workflows',
        TEMPLATES: 'Templates - Settings - Business Workflows'
    },
    DOCUMENT_MANAGEMENT: {
        LIBRARY: 'Library - Settings - Business Workflows',
        TEMPLATES: 'Templates - Settings - Business Workflows',
    },
    EMAIL: {
        ACKNOWLEDGMENT_TEMPLATES: 'Acknowledgment Templates - Settings - Business Workflows',
        CONFIGURATION: 'Configuration - Settings - Business Workflows',
        TEMPLATES: 'Templates - Settings - Business Workflows'
    },
    KNOWLEDGE_MANAGEMENT: {
        APPROVALS: 'Approval Mappings - Settings - Business Workflows',
        ARTICLE_TEMPLATE_STYLE: 'Article Template Styles - Settings - Business Workflows',
        ARTICLE_TEMPLATES: 'Article Templates - Settings - Business Workflows',
        KNOWLEDGE_SETS: 'Knowledge Sets - Settings - Business Workflows',
        NOTES_TEMPLATES: 'Notes Template - Settings - Business Workflows',
        STATUS_CONFIGURATION: 'Status Configuration - Settings - Business Workflows',
    },
    LINE_OF_BUSINESS: {
        DEFINE_LINE_OF_BUSINESS: 'Define Line of Business - Settings - Business Workflows',
        MANAGE_LINE_OF_BUSINESS: 'Manage Line of Business - Settings - Business Workflows',
    },
    MANAGE_FLOWSETS: {
        DEFINE_FLOWSETS: 'Define Flowsets - Settings - Business Workflows',
    },
    NOTIFICATION_CONFIGURATION: {
        MANAGE_EVENTS: 'Manage Events - Settings - Business Workflows',
        MANAGE_TEMPLATES: 'Manage Templates - Settings - Business Workflows',
    },
    PEOPLE: {
        NOTES_TEMPLATES: 'Notes Template - Settings - Business Workflows',
    },
    RELATIONSHIPS: {
        CASE_TO_CASE: 'Case to Case - Settings - Business Workflows',
        CASE_TO_PERSON: 'Case to Person - Settings - Business Workflows',
        PERSON_TO_PERSON: 'Person to Person - Settings - Business Workflows'
    },
    SERVICE_LEVEL_MANAGEMENT: {
        BUSINESS_TIME_SEGMENT: 'Business Time Segment - Settings - Business Workflows',
        BUSINESS_TIME_SHARED_ENTITY: 'Business Time Shared Entity - Settings - Business Workflows',
        CONFIGURE_DATA_SOURCE: 'Configure Data Source - Settings - Business Workflows',
        GOAL_TYPE: 'Goal Type - Settings - Business Workflows',
        SERVICE_TARGET: 'Service Target - Settings - Business Workflows',
        SERVICE_TARGET_GROUP: 'Service Target Group - Settings - Business Workflows',
    },
    TASK_MANAGEMENT: {
        APPROVALS: 'Approval Mappings - Settings - Business Workflows',
        NOTES_TEMPLATES: 'Notes Template - Settings - Business Workflows',
        STATUS_CONFIGURATION: 'Status Configuration - Settings - Business Workflows',
        TEMPLATES: 'Templates - Settings - Business Workflows'
    }
}
