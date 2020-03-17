export const CASE_TEMPLATE_DYNAMIC_FIELDS =
{
    "name": "case template",
    "templateId": "xalkdjasd",
    "templateRecordDefinition": "com.bmc.dsm.case-lib:Case Template",
    "attributeDefinitions": [
        {
            "name": "temp",
            "description": "temp",
            "dataType": "TEXT",
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "temp1",
            "description": "temp1",
            "dataType": "NUMBER",
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "temp2",
            "description": "temp2",
            "dataType": "DATE",
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "temp3",
            "description": "temp3",
            "dataType": "BOOLEAN",
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "temp4",
            "description": "temp4",
            "dataType": "DATE_TIME",
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "temp5",
            "description": "temp5",
            "dataType": "TIME",
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "newfilesd",
            "description": "asd",
            "dataType": "LIST",
            "dataProviderUserRole": "Agent",
            "displayDataListDefinitions": [
                {
                    "nameKey": "listvalues",
                    "displayText": "listvalues"
                }
            ],
            "active": true,
            "type": "SIMPLE_FIELD"
        },
        {
            "name": "attachment1",
            "description": "attachment1",
            "dataType": "ATTACHMENT",
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "attachment2",
            "description": "attachment2",
            "dataType": "ATTACHMENT",
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "attachment3",
            "description": "attachment3",
            "dataType": "ATTACHMENT",
            "dataProviderUserRole": "Agent",
        }
    ]
};
export const TASK_TEMPLATE__DYNAMIC_FIELDS =
{
    "name": "case template",
    "templateRecordDefinition": "com.bmc.dsm.task-lib:Task Template",
    "templateId": "nnn",
    "attributeDefinitions": [
        {
            "name": "temp",
            "description": "temp",
            "dataType": "TEXT",
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "temp1",
            "description": "temp1",
            "dataType": "NUMBER",
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "temp2",
            "description": "temp2",
            "dataType": "DATE",
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "temp3",
            "description": "temp3",
            "dataType": "BOOLEAN",
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "temp4",
            "description": "temp4",
            "dataType": "DATE_TIME",
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "temp5",
            "description": "temp5",
            "dataType": "TIME",
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "attachment1",
            "description": "attachment1",
            "dataType": "ATTACHMENT",
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "attachment2",
            "description": "attachment2",
            "dataType": "ATTACHMENT",
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "attachment3",
            "description": "attachment3",
            "dataType": "ATTACHMENT",
            "dataProviderUserRole": "Agent",
        }
    ]
};
export const SAVE_EXISTING_AND_NEW_CASE_DYNAMIC_DATA_DEFINITION = {
    "templateRecordDefinition": "com.bmc.dsm.case-lib:Case Template",
    "templateId": "",
    "name": "case template",
    "status": 0,
    "processName": null,
    "processDocumentDefinitionId": null,
    "attributeDefinitions": [
        {
            "name": "casePetramco1",
            "description": "casePetramco1Desc",
            "dataType": "NUMBER",
            "required": true,
            "dataProviderUserRole": "Requester"
        },
        {
            "name": "casePetramco2",
            "description": "casePetramcoDesc2",
            "dataType": "TEXT",
            "required": true,
            "dataProviderUserRole": "Requester"
        }
    ]
};
export const GLOBAL_DYNAMIC_DATA_CASE_TEMPLATE = {
    "templateRecordDefinition": "com.bmc.dsm.case-lib:Case Template",
    "templateId": "",
    "name": "case template",
    "status": 0,
    "processName": null,
    "processDocumentDefinitionId": null,
    "attributeDefinitions": [
        {
            "name": "GlobalField1",
            "description": "GlobalField1Desc",
            "dataType": "NUMBER",
            "required": true,
            "dataProviderUserRole": "Requester"
        },
        {
            "name": "GlobalField2",
            "description": "GlobalField2Desc",
            "dataType": "TEXT",
            "required": true,
            "dataProviderUserRole": "Requester"
        }
    ]
};
export const GLOBAL_TASK_TEMPLATE = {
    "templateRecordDefinition": "com.bmc.dsm.task-lib:Task Template",
    "templateId": "",
    "name": "case template",
    "status": 0,
    "processName": null,
    "processDocumentDefinitionId": null,
    "attributeDefinitions": [
        {
            "name": "GlobalTaskField1",
            "description": "GlobalTaskFieldDesc",
            "dataType": "NUMBER",
            "required": true,
            "dataProviderUserRole": "Requester"
        },
        {
            "name": "GlobalTaskField2",
            "description": "GlobalTaskFieldDesc1",
            "dataType": "TEXT",
            "required": true,
            "dataProviderUserRole": "Requester"
        }
    ]
};
export const DYNAMIC_DATA_FOR_TASK_TEMPLATE = {
    "templateRecordDefinition": "com.bmc.dsm.task-lib:Task Template",
    "templateId": "",
    "name": "task template",
    "status": 0,
    "processName": null,
    "processDocumentDefinitionId": null,
    "attributeDefinitions": [
        {
            "name": "ddfield1",
            "description": "ddfielddec1",
            "dataType": "TEXT",
            "required": false,
            "confidential": false,
            "dataProviderUserRole": "Agent"
        },
        {
            "name": "ddfield2",
            "description": "ddfielddec2",
            "dataType": "TEXT",
            "required": false,
            "confidential": false,
            "dataProviderUserRole": "Agent"
        }
    ]
};
export const CASE_TEMPLATE_WITH_CONFIDENTIAL = {
    "templateRecordDefinition": "com.bmc.dsm.case-lib:Case Template",
    "templateId": " ",
    "name": "casetemplate",
    "status": 0,
    "processName": null,
    "processDocumentDefinitionId": null,
    "attributeDefinitions": [
        {
            "name": "GroupLocalCaseTemplate",
            "description": "GroupLocalCaseTemplate",
            "externalId": "",
            "type": "GROUP_FIELD",
            "active": true,
            "published": false,
            "shouldPublish": false,
            "attributes": [
                {
                    "name": "LocalNonConfidential",
                    "description": "LocalNonConfidentialDesc",
                    "dataType": "TEXT",
                    "required": false,
                    "confidential": false,
                    "dataProviderUserRole": "Agent"
                },
                {
                    "name": "LocalConfidentail",
                    "description": "LocalConfidentialDesc",
                    "dataType": "NUMBER",
                    "required": false,
                    "confidential": true,
                    "dataProviderUserRole": "Agent",
                    "type": "SIMPLE_FIELD"
                }
            ]
        },
        {
            "name": "PulishCaseTemplateData",
            "description": "PulishCaseTemplateData",
            "externalId": "",
            "type": "GROUP_FIELD",
            "active": true,
            "attributes": [
                {
                    "name": "nonConfidentialPulic",
                    "description": "nonConfidentialPulicDesc",
                    "dataType": "BOOLEAN",
                    "required": false,
                    "confidential": false,
                    "dataProviderUserRole": "Agent"
                },
                {
                    "name": "confidentialPublic",
                    "description": "confidentialPublicDesc",
                    "dataType": "DATE",
                    "required": false,
                    "confidential": true,
                    "dataProviderUserRole": "Agent"
                }
            ],
            "published": false,
            "shouldPublish": true
        },
        {
            "name": "OuterNonConfidential",
            "description": "OuterNonConfidentialDesc",
            "dataType": "TIME",
            "required": false,
            "confidential": false,
            "dataProviderUserRole": "Agent"
        },
        {
            "name": "ListOfDataName",
            "description": "ListOfDataNameDesc",
            "dataType": "LIST",
            "required": false,
            "confidential": false,
            "dataProviderUserRole": "Agent",
            "displayDataListDefinitions": [
                {
                    "nameKey": "value121",
                    "displayText": "value121"
                }
            ]
        },
        {
            "name": "OuterConfidential",
            "description": "OuterConfidentialDesc",
            "dataType": "TEXT",
            "required": false,
            "confidential": true,
            "dataProviderUserRole": "Agent"
        }
    ]
};
export const TASK_TEMPLATE_WITH_CONFIDENTIAL = {
    "templateRecordDefinition": "com.bmc.dsm.task-lib:Task Template",
    "templateId": "",
    "name": "Tasktemplate",
    "status": 0,
    "processName": null,
    "processDocumentDefinitionId": null,
    "attributeDefinitions": [
        {
            "name": "TaskGroupLocalCaseTemplate",
            "description": "TaskGroupLocalCaseTemplate",
            "externalId": "",
            "type": "GROUP_FIELD",
            "active": true,
            "published": false,
            "shouldPublish": false,
            "attributes": [
                {
                    "name": "TaskLocalNonConfidential",
                    "description": "TaskLocalNonConfidentialDesc",
                    "dataType": "TEXT",
                    "required": false,
                    "confidential": false,
                    "dataProviderUserRole": "Agent"
                },
                {
                    "name": "TaskLocalConfidentail",
                    "description": "TaskLocalConfidentialDesc",
                    "dataType": "NUMBER",
                    "required": false,
                    "confidential": true,
                    "dataProviderUserRole": "Agent"
                }
            ]
        },
        {
            "name": "TaskPulishCaseTemplateData",
            "description": "TaskPulishCaseTemplateData",
            "externalId": "",
            "type": "GROUP_FIELD",
            "active": true,
            "attributes": [
                {
                    "name": "TasknonConfidentialPulic",
                    "description": "TasknonConfidentialPulicDesc",
                    "dataType": "BOOLEAN",
                    "required": false,
                    "confidential": false,
                    "dataProviderUserRole": "Agent"
                },
                {
                    "name": "TaskconfidentialPublic",
                    "description": "TaskconfidentialPublicDesc",
                    "dataType": "DATE",
                    "required": false,
                    "confidential": true,
                    "dataProviderUserRole": "Agent"
                }
            ],
            "published": false,
            "shouldPublish": true
        },
        {
            "name": "TaskOuterNonConfidential",
            "description": "TaskOuterNonConfidentialDesc",
            "dataType": "TIME",
            "required": false,
            "confidential": false,
            "dataProviderUserRole": "Agent"
        },
        {
            "name": "TaskListOfDataName",
            "description": "TaskListOfDataNameDesc",
            "dataType": "LIST",
            "required": false,
            "confidential": false,
            "dataProviderUserRole": "Agent",
            "displayDataListDefinitions": [
                {
                    "nameKey": "Taskvalue121",
                    "displayText": "Taskvalue121"
                }
            ]
        },
        {
            "name": "TaskOuterConfidential",
            "description": "TaskOuterConfidentialDesc",
            "dataType": "TEXT",
            "required": false,
            "confidential": true,
            "dataProviderUserRole": "Agent"
        }
    ]
};
export const TASK_TEMPLATE_LONG__DYNAMIC_FIELDS =
{
    "name": "case template",
    "templateRecordDefinition": "com.bmc.dsm.task-lib:Task Template",
    "templateId": "nnn",
    "attributeDefinitions": [
        {
            "name": "theNewDynamicFieldsIsgettingMouseOveredMouseOvered",
            "description": "theNewDynamicFieldsIsgettingMouseOveredMouseOvered",
            "dataType": "TEXT",
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "theSecondDynamicFieldsIsgettingMouseOveredMouseOvered",
            "description": "theSecondDynamicFieldsIsgettingMouseOveredMouseOvered",
            "dataType": "TEXT",
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "theThirdDynamicFieldsIsgettingMouseOveredMouseOvered",
            "description": "theThirdDynamicFieldsIsgettingMouseOveredMouseOvered",
            "dataType": "TEXT",
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "temp1theNewDynamicFieldsIsgettingMouseOveredMouseOvered",
            "description": "temp1theNewDynamicFieldsIsgettingMouseOveredMouseOvered",
            "dataType": "NUMBER",
            "dataProviderUserRole": "Agent",
        }
    ]
};
export const EXTERNAL_TASK_TEMPLATE_LONG__DYNAMIC =
{
    "name": "case template",
    "templateRecordDefinition": "com.bmc.dsm.task-lib:Task Template",
    "templateId": "nnn",
    "attributeDefinitions": [
        {
            "name": "theExternalDynamicFieldsIsgettingMouseOveredMouseOvered",
            "description": "theExternalDynamicFieldsIsgettingMouseOveredMouseOvered",
            "dataType": "TEXT",
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "theSecondExternalDynamicFieldsIsgettingMouseOveredMouseOvered",
            "description": "theSecondExternalDynamicFieldsIsgettingMouseOveredMouseOvered",
            "dataType": "TEXT",
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "theThirdDynamicExternalFieldsIsgettingMouseOveredMouseOvered",
            "description": "theThirdDynamicExternalFieldsIsgettingMouseOveredMouseOvered",
            "dataType": "TEXT",
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "temp1theNewExternalDynamicFieldsIsgettingMouseOveredMouseOvered",
            "description": "temp1theNewExternalDynamicFieldsIsgettingMouseOveredMouseOvered",
            "dataType": "NUMBER",
            "dataProviderUserRole": "Agent",
        }
    ]
};
export const AUTOMATED_TASK_TEMPLATE_LONG__DYNAMIC =
{
    "name": "case template",
    "templateRecordDefinition": "com.bmc.dsm.task-lib:Task Template",
    "templateId": "nnn",
    "attributeDefinitions": [
        {
            "name": "theautomatedDynamicFieldsIsgettingMouseOveredMouseOvered",
            "description": "theautomatedDynamicFieldsIsgettingMouseOveredMouseOvered",
            "dataType": "TEXT",
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "theSecondautomatedDynamicFieldsIsgettingMouseOveredMouseOvered",
            "description": "theSecondautomatedDynamicFieldsIsgettingMouseOveredMouseOvered",
            "dataType": "TEXT",
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "theThirdDynamicautomatedFieldsIsgettingMouseOveredMouseOvered",
            "description": "theThirdDynamicautomatedFieldsIsgettingMouseOveredMouseOvered",
            "dataType": "TEXT",
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "temp1theNewautomatedDynamicFieldsIsgettingMouseOveredMouseOvered",
            "description": "temp1theNewautomatedDynamicFieldsIsgettingMouseOveredMouseOvered",
            "dataType": "NUMBER",
            "dataProviderUserRole": "Agent",
        }
    ]
};
