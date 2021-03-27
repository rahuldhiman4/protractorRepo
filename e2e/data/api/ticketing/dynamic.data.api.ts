export const CASE_TEMPLATE_DYNAMIC_FIELDS =
{
    "name": "case template",
    "templateId": "xalkdjasd",
    "templateRecordDefinition": "com.bmc.dsm.case-lib:Case Template",
    "lineOfBusiness": "HumanResource",
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
            "description": "dynamicList",
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
    "lineOfBusiness": "HumanResource",
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
    "lineOfBusiness": "HumanResource",
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
    "lineOfBusiness": "HumanResource",
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
    "lineOfBusiness": "HumanResource",
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
    "lineOfBusiness": "HumanResource",
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
    "lineOfBusiness": "HumanResource",
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
    "lineOfBusiness": "HumanResource",
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
    "lineOfBusiness": "HumanResource",
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
    "lineOfBusiness": "HumanResource",
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
    "lineOfBusiness": "HumanResource",
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
export const CASE_TEMPLATE_REQUESTER_DYNAMIC_FIELDS =
{
    "name": "case template",
    "templateId": "xalkdjasd",
    "templateRecordDefinition": "com.bmc.dsm.case-lib:Case Template",
    "lineOfBusiness": "HumanResource",
    "attributeDefinitions": [
        {
            "name": "temp",
            "description": "temp",
            "dataType": "TEXT",
            "dataProviderUserRole": "Requester",
        },
        {
            "name": "temp1",
            "description": "temp1",
            "dataType": "NUMBER",
            "dataProviderUserRole": "Requester",
        },
        {
            "name": "temp2",
            "description": "temp2",
            "dataType": "DATE",
            "dataProviderUserRole": "Requester",
        },
        {
            "name": "temp3",
            "description": "temp3",
            "dataType": "BOOLEAN",
            "dataProviderUserRole": "Requester",
        },
        {
            "name": "temp4",
            "description": "temp4",
            "dataType": "DATE_TIME",
            "dataProviderUserRole": "Requester",
        },
        {
            "name": "temp5",
            "description": "temp5",
            "dataType": "TIME",
            "dataProviderUserRole": "Requester",
        },
        {
            "name": "newfilesd",
            "description": "dynamicList",
            "dataType": "LIST",
            "dataProviderUserRole": "Requester",
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
            "dataProviderUserRole": "Requester",
        },
        {
            "name": "temp6",
            "description": "temp6",
            "dataType": "TEXT",
            "dataProviderUserRole": "Requester",
        },
        {
            "name": "temp7",
            "description": "temp7",
            "dataType": "NUMBER",
            "dataProviderUserRole": "Requester",
        },
        {
            "name": "temp8",
            "description": "temp8",
            "dataType": "NUMBER",
            "dataProviderUserRole": "Requester",
        },
        {
            "name": "temp9",
            "description": "temp9",
            "dataType": "DATE",
            "dataProviderUserRole": "Requester",
        },
        {
            "name": "temp10",
            "description": "temp10",
            "dataType": "BOOLEAN",
            "dataProviderUserRole": "Requester",
        },
        {
            "name": "temp11",
            "description": "temp11",
            "dataType": "DATE_TIME",
            "dataProviderUserRole": "Requester",
        },
        {
            "name": "temp12",
            "description": "temp12",
            "dataType": "TIME",
            "dataProviderUserRole": "Requester",
        }
    ]
};
export const AUTOMATED_TASK_TEMPLATE__DYNAMIC_FIELDS =
{
    "name": "task template",
    "templateRecordDefinition": "com.bmc.dsm.task-lib:Task Template",
    "templateId": "nnn",
    "lineOfBusiness": "HumanResource",
    "attributeDefinitions": [
        {
            "name": "automatedText",
            "description": "automatedText",
            "dataType": "TEXT",
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "automatedNumber",
            "description": "automatedNumber",
            "dataType": "NUMBER",
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "automatedDate",
            "description": "automatedDate",
            "dataType": "DATE",
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "automatedBoolean",
            "description": "automatedBoolean",
            "dataType": "BOOLEAN",
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "automatedDateTime",
            "description": "automatedDateTime",
            "dataType": "DATE_TIME",
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "automatedTime",
            "description": "automatedTime",
            "dataType": "TIME",
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "automatedAttachment1",
            "description": "automatedAttachment1",
            "dataType": "ATTACHMENT",
            "dataProviderUserRole": "Agent",
        }
    ]
};
export const EXTERNAL_TASK_TEMPLATE__DYNAMIC_FIELDS = {
    "name": "task template",
    "templateRecordDefinition": "com.bmc.dsm.task-lib:Task Template",
    "templateId": "nnn",
    "lineOfBusiness": "HumanResource",
    "attributeDefinitions": [
        {
            "name": "externalText",
            "description": "externalText",
            "dataType": "TEXT",
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "externalNumber",
            "description": "externalNumber",
            "dataType": "NUMBER",
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "externalDate",
            "description": "externalDate",
            "dataType": "DATE",
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "externalBoolean",
            "description": "externalBoolean",
            "dataType": "BOOLEAN",
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "externalDateTime",
            "description": "externalDateTime",
            "dataType": "DATE_TIME",
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "externalTime",
            "description": "externalTime",
            "dataType": "TIME",
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "externalAttachment1",
            "description": "externalAttachment1",
            "dataType": "ATTACHMENT",
            "dataProviderUserRole": "Agent",

        }
    ]
};
export const CASE_TEMPLATE_EACH_15_FIELD = {
    "name": "case template",
    "templateId": "xalkdjasd",
    "lineOfBusiness": "HumanResource",
    "templateRecordDefinition": "com.bmc.dsm.case-lib:Case Template",
    "attributeDefinitions": [
        {
            "name": "text1",
            "description": "text1",
            "dataType": "TEXT",
            "dataProviderUserRole": "Agent"
        },
        {
            "name": "text2",
            "description": "text2",
            "dataType": "TEXT",
            "dataProviderUserRole": "Agent"
        },
        {
            "name": "text3",
            "description": "text3",
            "dataType": "TEXT",
            "dataProviderUserRole": "Agent"
        },
        {
            "name": "text4",
            "description": "text4",
            "dataType": "TEXT",
            "dataProviderUserRole": "Agent"
        },
        {
            "name": "text5",
            "description": "text5",
            "dataType": "TEXT",
            "dataProviderUserRole": "Agent"
        },
        {
            "name": "text6",
            "description": "text6",
            "dataType": "TEXT",
            "dataProviderUserRole": "Agent"
        },
        {
            "name": "text7",
            "description": "text7",
            "dataType": "TEXT",
            "dataProviderUserRole": "Agent"
        },
        {
            "name": "text8",
            "description": "text8",
            "dataType": "TEXT",
            "dataProviderUserRole": "Agent"
        },
        {
            "name": "text9",
            "description": "text9",
            "dataType": "TEXT",
            "dataProviderUserRole": "Agent"
        },
        {
            "name": "text10",
            "description": "text10",
            "dataType": "TEXT",
            "dataProviderUserRole": "Agent"
        },
        {
            "name": "text11",
            "description": "text11",
            "dataType": "TEXT",
            "dataProviderUserRole": "Agent"
        },
        {
            "name": "text12",
            "description": "text12",
            "dataType": "TEXT",
            "dataProviderUserRole": "Agent"
        },
        {
            "name": "text13",
            "description": "text13",
            "dataType": "TEXT",
            "dataProviderUserRole": "Agent"
        },
        {
            "name": "text14",
            "description": "text14",
            "dataType": "TEXT",
            "dataProviderUserRole": "Agent"
        },
        {
            "name": "text15",
            "description": "text15",
            "dataType": "TEXT",
            "dataProviderUserRole": "Agent"
        },
        {
            "name": "number1",
            "description": "number1",
            "dataType": "NUMBER",
            "dataProviderUserRole": "Agent"
        },
        {
            "name": "number2",
            "description": "number2",
            "dataType": "NUMBER",
            "dataProviderUserRole": "Agent"
        },
        {
            "name": "number3",
            "description": "number3",
            "dataType": "NUMBER",
            "dataProviderUserRole": "Agent"
        },
        {
            "name": "number4",
            "description": "number4",
            "dataType": "NUMBER",
            "dataProviderUserRole": "Agent"
        },
        {
            "name": "number5",
            "description": "number5",
            "dataType": "NUMBER",
            "dataProviderUserRole": "Agent"
        },
        {
            "name": "number6",
            "description": "number6",
            "dataType": "NUMBER",
            "dataProviderUserRole": "Agent"
        },
        {
            "name": "number7",
            "description": "number7",
            "dataType": "NUMBER",
            "dataProviderUserRole": "Agent"
        },
        {
            "name": "number8",
            "description": "number8",
            "dataType": "NUMBER",
            "dataProviderUserRole": "Agent"
        },
        {
            "name": "number9",
            "description": "number9",
            "dataType": "NUMBER",
            "dataProviderUserRole": "Agent"
        },
        {
            "name": "number10",
            "description": "number10",
            "dataType": "NUMBER",
            "dataProviderUserRole": "Agent"
        },
        {
            "name": "number11",
            "description": "number11",
            "dataType": "NUMBER",
            "dataProviderUserRole": "Agent"
        },
        {
            "name": "number12",
            "description": "number12",
            "dataType": "NUMBER",
            "dataProviderUserRole": "Agent"
        },
        {
            "name": "number13",
            "description": "number13",
            "dataType": "NUMBER",
            "dataProviderUserRole": "Agent"
        },
        {
            "name": "number14",
            "description": "number14",
            "dataType": "NUMBER",
            "dataProviderUserRole": "Agent"
        },
        {
            "name": "number15",
            "description": "number15",
            "dataType": "NUMBER",
            "dataProviderUserRole": "Agent"
        },
        {
            "name": "date1",
            "description": "date1",
            "dataType": "DATE",
            "dataProviderUserRole": "Agent"
        },
        {
            "name": "date2",
            "description": "date2",
            "dataType": "DATE",
            "dataProviderUserRole": "Agent"
        },
        {
            "name": "date3",
            "description": "date3",
            "dataType": "DATE",
            "dataProviderUserRole": "Agent"
        },
        {
            "name": "date4",
            "description": "date4",
            "dataType": "DATE",
            "dataProviderUserRole": "Agent"
        },
        {
            "name": "date5",
            "description": "date5",
            "dataType": "DATE",
            "dataProviderUserRole": "Agent"
        },
        {
            "name": "date6",
            "description": "date6",
            "dataType": "DATE",
            "dataProviderUserRole": "Agent"
        },
        {
            "name": "date7",
            "description": "date7",
            "dataType": "DATE",
            "dataProviderUserRole": "Agent"
        },
        {
            "name": "date8",
            "description": "date8",
            "dataType": "DATE",
            "dataProviderUserRole": "Agent"
        },
        {
            "name": "date9",
            "description": "date9",
            "dataType": "DATE",
            "dataProviderUserRole": "Agent"
        },
        {
            "name": "date10",
            "description": "date10",
            "dataType": "DATE",
            "dataProviderUserRole": "Agent"
        },
        {
            "name": "date11",
            "description": "date11",
            "dataType": "DATE",
            "dataProviderUserRole": "Agent"
        },
        {
            "name": "date12",
            "description": "date12",
            "dataType": "DATE",
            "dataProviderUserRole": "Agent"
        },
        {
            "name": "date13",
            "description": "date13",
            "dataType": "DATE",
            "dataProviderUserRole": "Agent"
        },
        {
            "name": "date14",
            "description": "date14",
            "dataType": "DATE",
            "dataProviderUserRole": "Agent"
        },
        {
            "name": "date15",
            "description": "date15",
            "dataType": "DATE",
            "dataProviderUserRole": "Agent"
        },
        {
            "name": "boolean1",
            "description": "boolean1",
            "dataType": "BOOLEAN",
            "dataProviderUserRole": "Agent"
        },
        {
            "name": "boolean2",
            "description": "boolean2",
            "dataType": "BOOLEAN",
            "dataProviderUserRole": "Agent"
        },
        {
            "name": "boolean3",
            "description": "boolean3",
            "dataType": "BOOLEAN",
            "dataProviderUserRole": "Agent"
        },
        {
            "name": "boolean4",
            "description": "boolean4",
            "dataType": "BOOLEAN",
            "dataProviderUserRole": "Agent"
        },
        {
            "name": "boolean5",
            "description": "boolean5",
            "dataType": "BOOLEAN",
            "dataProviderUserRole": "Agent"
        },
        {
            "name": "boolean6",
            "description": "boolean6",
            "dataType": "BOOLEAN",
            "dataProviderUserRole": "Agent"
        },
        {
            "name": "boolean7",
            "description": "boolean7",
            "dataType": "BOOLEAN",
            "dataProviderUserRole": "Agent"
        },
        {
            "name": "boolean8",
            "description": "boolean8",
            "dataType": "BOOLEAN",
            "dataProviderUserRole": "Agent"
        },
        {
            "name": "boolean9",
            "description": "boolean9",
            "dataType": "BOOLEAN",
            "dataProviderUserRole": "Agent"
        },
        {
            "name": "boolean10",
            "description": "boolean10",
            "dataType": "BOOLEAN",
            "dataProviderUserRole": "Agent"
        },
        {
            "name": "boolean11",
            "description": "boolean11",
            "dataType": "BOOLEAN",
            "dataProviderUserRole": "Agent"
        },
        {
            "name": "boolean12",
            "description": "boolean12",
            "dataType": "BOOLEAN",
            "dataProviderUserRole": "Agent"
        },
        {
            "name": "boolean13",
            "description": "boolean13",
            "dataType": "BOOLEAN",
            "dataProviderUserRole": "Agent"
        },
        {
            "name": "boolean14",
            "description": "boolean14",
            "dataType": "BOOLEAN",
            "dataProviderUserRole": "Agent"
        },
        {
            "name": "boolean15",
            "description": "boolean15",
            "dataType": "BOOLEAN",
            "dataProviderUserRole": "Agent"
        },
        {
            "name": "datetime1",
            "description": "datetime1",
            "dataType": "DATE_TIME",
            "dataProviderUserRole": "Agent"
        },
        {
            "name": "datetime2",
            "description": "datetime2",
            "dataType": "DATE_TIME",
            "dataProviderUserRole": "Agent"
        },
        {
            "name": "datetime3",
            "description": "datetime3",
            "dataType": "DATE_TIME",
            "dataProviderUserRole": "Agent"
        },
        {
            "name": "datetime4",
            "description": "datetime4",
            "dataType": "DATE_TIME",
            "dataProviderUserRole": "Agent"
        },
        {
            "name": "datetime5",
            "description": "datetime5",
            "dataType": "DATE_TIME",
            "dataProviderUserRole": "Agent"
        },
        {
            "name": "datetime6",
            "description": "datetime6",
            "dataType": "DATE_TIME",
            "dataProviderUserRole": "Agent"
        },
        {
            "name": "datetime7",
            "description": "datetime7",
            "dataType": "DATE_TIME",
            "dataProviderUserRole": "Agent"
        },
        {
            "name": "datetime8",
            "description": "datetime8",
            "dataType": "DATE_TIME",
            "dataProviderUserRole": "Agent"
        },
        {
            "name": "datetime9",
            "description": "datetime9",
            "dataType": "DATE_TIME",
            "dataProviderUserRole": "Agent"
        },
        {
            "name": "datetime10",
            "description": "datetime10",
            "dataType": "DATE_TIME",
            "dataProviderUserRole": "Agent"
        },
        {
            "name": "datetime11",
            "description": "datetime11",
            "dataType": "DATE_TIME",
            "dataProviderUserRole": "Agent"
        },
        {
            "name": "datetime12",
            "description": "datetime12",
            "dataType": "DATE_TIME",
            "dataProviderUserRole": "Agent"
        },
        {
            "name": "datetime13",
            "description": "datetime13",
            "dataType": "DATE_TIME",
            "dataProviderUserRole": "Agent"
        },
        {
            "name": "datetime14",
            "description": "datetime14",
            "dataType": "DATE_TIME",
            "dataProviderUserRole": "Agent"
        },
        {
            "name": "datetime15",
            "description": "datetime15",
            "dataType": "DATE_TIME",
            "dataProviderUserRole": "Agent"
        },
        {
            "name": "time1",
            "description": "time1",
            "dataType": "TIME",
            "dataProviderUserRole": "Agent"
        },
        {
            "name": "time2",
            "description": "time2",
            "dataType": "TIME",
            "dataProviderUserRole": "Agent"
        },
        {
            "name": "time3",
            "description": "time3",
            "dataType": "TIME",
            "dataProviderUserRole": "Agent"
        },
        {
            "name": "time4",
            "description": "time4",
            "dataType": "TIME",
            "dataProviderUserRole": "Agent"
        },
        {
            "name": "time5",
            "description": "time5",
            "dataType": "TIME",
            "dataProviderUserRole": "Agent"
        },
        {
            "name": "time6",
            "description": "time6",
            "dataType": "TIME",
            "dataProviderUserRole": "Agent"
        },
        {
            "name": "time7",
            "description": "time7",
            "dataType": "TIME",
            "dataProviderUserRole": "Agent"
        },
        {
            "name": "time8",
            "description": "time8",
            "dataType": "TIME",
            "dataProviderUserRole": "Agent"
        },
        {
            "name": "time9",
            "description": "time9",
            "dataType": "TIME",
            "dataProviderUserRole": "Agent"
        },
        {
            "name": "time10",
            "description": "time10",
            "dataType": "TIME",
            "dataProviderUserRole": "Agent"
        },
        {
            "name": "newfilesd",
            "description": "dynamicList",
            "dataType": "LIST",
            "dataProviderUserRole": "Agent",
            "displayDataListDefinitions": [
                {
                    "nameKey": "listvalues",
                    "displayText": "listvalues"
                },
                {
                    "nameKey": "listvalues1",
                    "displayText": "listvalues1"
                },
                {
                    "nameKey": "listvalues2",
                    "displayText": "listvalues2"
                },
                {
                    "nameKey": "listvalues3",
                    "displayText": "listvalues3"
                },
                {
                    "nameKey": "listvalues4",
                    "displayText": "listvalues4"
                },
                {
                    "nameKey": "listvalues5",
                    "displayText": "listvalues5"
                },
                {
                    "nameKey": "listvalues6",
                    "displayText": "listvalues6"
                },
                {
                    "nameKey": "listvalues8",
                    "displayText": "listvalues8"
                },
                {
                    "nameKey": "listvalues9",
                    "displayText": "listvalues9"
                },
                {
                    "nameKey": "listvalues10",
                    "displayText": "listvalues10"
                }
            ],
            "active": true,
            "type": "SIMPLE_FIELD"
        },
        {
            "name": "attachment1",
            "description": "attachment1",
            "dataType": "ATTACHMENT",
            "dataProviderUserRole": "Agent"
        },
        {
            "name": "attachment2",
            "description": "attachment2",
            "dataType": "ATTACHMENT",
            "dataProviderUserRole": "Agent"
        },
        {
            "name": "attachment3",
            "description": "attachment3",
            "dataType": "ATTACHMENT",
            "dataProviderUserRole": "Agent"
        },
        {
            "name": "attachment4",
            "description": "attachment4",
            "dataType": "ATTACHMENT",
            "dataProviderUserRole": "Agent"
        },
        {
            "name": "attachment5",
            "description": "attachment5",
            "dataType": "ATTACHMENT",
            "dataProviderUserRole": "Agent"
        },
        {
            "name": "attachment6",
            "description": "attachment6",
            "dataType": "ATTACHMENT",
            "dataProviderUserRole": "Agent"
        },
        {
            "name": "attachment7",
            "description": "attachment7",
            "dataType": "ATTACHMENT",
            "dataProviderUserRole": "Agent"
        },
        {
            "name": "attachment8",
            "description": "attachment8",
            "dataType": "ATTACHMENT",
            "dataProviderUserRole": "Agent"
        },
        {
            "name": "attachment9",
            "description": "attachment9",
            "dataType": "ATTACHMENT",
            "dataProviderUserRole": "Agent"
        },
        {
            "name": "attachment10",
            "description": "attachment10",
            "dataType": "ATTACHMENT",
            "dataProviderUserRole": "Agent"
        }
    ]
};

export const CASE_TEMPLATE_REMOVE_FIELDS =
{
    "name": "case template",
    "templateId": "xalkdjasd",
    "lineOfBusiness": "HumanResource",
    "templateRecordDefinition": "com.bmc.dsm.case-lib:Case Template",
    "attributeDefinitions": [
        {
            "name": "temp",
            "description": "temp",
            "dataType": "TEXT",
            "dataProviderUserRole": "Requester",
        },
        {
            "name": "temp1",
            "description": "temp1",
            "dataType": "NUMBER",
            "dataProviderUserRole": "Requester",
        },
        {
            "name": "temp2",
            "description": "temp2",
            "dataType": "BOOLEAN",
            "dataProviderUserRole": "Requester",
        }
    ]
};
export const CASE_TEMPLATE_LONG_FIELDS = {
    "name": "case template",
    "templateRecordDefinition": "com.bmc.dsm.case-lib:Case Template",
    "templateId": "nnn",
    "lineOfBusiness": "HumanResource",
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
            "dataType": "NUMBER",
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "theThirdDynamicautomatedFieldsIsgettingMouseOveredMouseOvered",
            "description": "theThirdDynamicautomatedFieldsIsgettingMouseOveredMouseOvered",
            "dataType": "DATE",
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "temp1theNewautomatedDynamicFieldsIsgettingMouseOveredMouseOvered",
            "description": "temp1theNewautomatedDynamicFieldsIsgettingMouseOveredMouseOvered",
            "dataType": "BOOLEAN",
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "GroupLocalCaseTemplateGroupLocalCaseTemplateLocalCaseTemplate",
            "description": "GroupLocalCaseTemplateGroupLocalCaseTemplateLocalCaseTemplate",
            "externalId": "",
            "type": "GROUP_FIELD",
            "active": true,
            "published": false,
            "shouldPublish": false,
            "attributes": [
                {
                    "name": "LocalNonConfidentialLocalNonConfidentialLocalNonConfidential",
                    "description": "LocalNonConfidentialDescLocalNonConfidentialDescLocalNonConfidentialDesc",
                    "dataType": "TEXT",
                    "required": false,
                    "confidential": false,
                    "dataProviderUserRole": "Agent"
                },
                {
                    "name": "LocalConfidentailLocalConfidentailLocalNonConfidentialDesc",
                    "description": "LocalConfidentialDescLocalConfidentialDescLocalNonConfidentialDesc",
                    "dataType": "NUMBER",
                    "required": false,
                    "confidential": false,
                    "dataProviderUserRole": "Agent",
                    "type": "SIMPLE_FIELD"
                }
            ]
        }
    ]
};

export const hiddenField = {
    "name": "case template",
    "templateRecordDefinition": "com.bmc.dsm.task-lib:Task Template",
    "templateId": "nnn",
    "lineOfBusiness": "HumanResource",
    "attributeDefinitions": [{
        "name": "Field1OutsideDRDMV21415",
        "description": "Field1OutsideDRDMV21415",
        "dataType": "TEXT",
        "required": false,
        "confidential": false,
        "dataProviderUserRole": "Agent",
        "dataProviderApplication": "",
        "active": true,
        "attachmentGroupId": null,
        "type": "SIMPLE_FIELD",
        "hidden": true,
        "lineOfBusiness": "HumanResource"
    }
    ]
};

export const ALL_DATA_TYPE = {
    "name": "case template",
    "templateRecordDefinition": "com.bmc.dsm.task-lib:Task Template",
    "templateId": "nnn",
    "lineOfBusiness": "HumanResource",
    "attributeDefinitions": [{
        "name": "requiredFieldTrue",
        "description": "requiredTrueFieldDescription",
        "dataType": "TEXT",
        "required": true,
        "confidential": false,
        "dataProviderUserRole": "Agent",
        "dataProviderApplication": "",
        "active": true,
        "attachmentGroupId": null,
        "type": "SIMPLE_FIELD",
        "hidden": false
    },
    {
        "name": "confidentialFieldTrue",
        "description": "confidentialTrueFieldDescription",
        "dataType": "TEXT",
        "required": false,
        "confidential": true,
        "dataProviderUserRole": "Agent",
        "dataProviderApplication": "",
        "active": true,
        "attachmentGroupId": null,
        "type": "SIMPLE_FIELD",
        "hidden": false
    },
    {
        "name": "hiddenFieldTrue",
        "description": "hiddenTrueFieldDescription",
        "dataType": "TEXT",
        "required": false,
        "confidential": false,
        "dataProviderUserRole": "Agent",
        "dataProviderApplication": "",
        "active": true,
        "attachmentGroupId": null,
        "type": "SIMPLE_FIELD",
        "hidden": true
    }]
};

export const DuplicateOFhiddenFieldDRDMV21418 = {
    "name": "case template",
    "templateRecordDefinition": "com.bmc.dsm.task-lib:Task Template",
    "templateId": "nnn",
    "lineOfBusiness": "HumanResource",
    "attributeDefinitions": [{
        "name": "Field1OutsideDRDMV21415",
        "description": "Field1OutsideDRDMV21415",
        "dataType": "TEXT",
        "required": false,
        "confidential": false,
        "dataProviderUserRole": "Agent",
        "dataProviderApplication": "",
        "active": true,
        "attachmentGroupId": null,
        "type": "SIMPLE_FIELD",
        "hidden": false,
        "lineOfBusiness": "HumanResource"
    }]
};
export const UnhiddenField = {
    "name": "Not Applicable",
    "processDocumentDefinitionId": "",
    "processInputDocName": "com.bmc.dsm.bwfa:ssss",
    "processName": null,
    "templateId": "",
    "id": "",
    "lineOfBusiness": "HumanResource",
    "attributeDefinitions": [
        {
            "name": "Field1OutsideDRDMV21415",
            "description": "Field1OutsideDRDMV21415",
            "dataType": "TEXT",
            "required": false,
            "confidential": false,
            "dataProviderUserRole": "Agent",
            "active": true,
            "type": "SIMPLE_FIELD",
            "hidden": false,
            "lineOfBusiness": "HumanResource"
        }
    ],
    "templateRecordDefinition": "com.bmc.dsm.task-lib:Task Template"
};

export const RequiredHiddenDRDMV21451 = {
    "name": "case template",
    "templateRecordDefinition": "com.bmc.dsm.task-lib:Task Template",
    "templateId": "nnn",
    "lineOfBusiness": "HumanResource",
    "attributeDefinitions": [{
        "name": "Field1OutsideDRDMV21451",
        "description": "Field1OutsideDRDMV21451",
        "dataType": "TEXT",
        "required": true,
        "confidential": false,
        "dataProviderUserRole": "Requester",
        "dataProviderApplication": "",
        "active": true,
        "attachmentGroupId": null,
        "type": "SIMPLE_FIELD",
        "hidden": true,
        "lineOfBusiness": "HumanResource"
    }
    ]
};

export const ConfidentialsHiddenDRDMV21452 = {
    "name": "case template",
    "templateRecordDefinition": "com.bmc.dsm.task-lib:Task Template",
    "templateId": "nnn",
    "lineOfBusiness": "HumanResource",
    "attributeDefinitions": [{
        "name": "Field1OutsideDRDMV21452",
        "description": "Field1OutsideDRDMV21452",
        "dataType": "TEXT",
        "required": false,
        "confidential": true,
        "dataProviderUserRole": "Requester",
        "dataProviderApplication": "",
        "active": true,
        "attachmentGroupId": null,
        "type": "SIMPLE_FIELD",
        "hidden": true,
        "lineOfBusiness": "HumanResource"
    }
    ]
};

export const CASE_TEMPLATE_WITH_REQUESTER = {
    "name": null,
    "processDocumentDefinitionId": null,
    "processInputDocName": null,
    "processName": null,
    "templateId": "",
    "id": null,
    "lineOfBusiness": "HumanResource",
    "attributeDefinitions": [
        {
            "name": "GroupOne",
            "description": "GroupOne",
            "externalId": "",
            "type": "GROUP_FIELD",
            "active": true,
            "attributes": [
                {
                    "name": "FieldGroup1",
                    "description": "FieldGroup1",
                    "dataType": "TEXT",
                    "required": false,
                    "confidential": false,
                    "dataProviderUserRole": "Requester",
                    "dataProviderApplication": "",
                    "active": true,
                    "externalId": "",
                    "attachmentGroupId": null,
                    "type": "SIMPLE_FIELD",
                    "hidden": false
                },
                {
                    "name": "Field2Group1",
                    "description": "Field2Group1",
                    "dataType": "TEXT",
                    "required": false,
                    "confidential": false,
                    "dataProviderUserRole": "Requester",
                    "dataProviderApplication": "",
                    "active": true,
                    "attachmentGroupId": null,
                    "type": "SIMPLE_FIELD",
                    "hidden": false
                }
            ],
            "published": false,
            "shouldPublish": false
        },
        {
            "name": "GroupTwo",
            "description": "GroupTwo",
            "externalId": "",
            "type": "GROUP_FIELD",
            "active": true,
            "attributes": [
                {
                    "name": "Field2Group2",
                    "description": "Field2Group2",
                    "dataType": "TEXT",
                    "required": false,
                    "confidential": false,
                    "dataProviderUserRole": "Requester",
                    "dataProviderApplication": "",
                    "active": true,
                    "type": "SIMPLE_FIELD",
                    "hidden": false
                },
                {
                    "name": "FieldGroup2",
                    "description": "FieldGroup2",
                    "dataType": "TEXT",
                    "required": false,
                    "confidential": false,
                    "dataProviderUserRole": "Requester",
                    "dataProviderApplication": "",
                    "active": true,
                    "attachmentGroupId": null,
                    "type": "SIMPLE_FIELD",
                    "hidden": false
                }
            ],
            "published": false,
            "shouldPublish": false
        },
        {
            "name": "Field1Outside",
            "description": "Field1Outside",
            "dataType": "TEXT",
            "required": false,
            "confidential": false,
            "dataProviderUserRole": "Requester",
            "dataProviderApplication": "",
            "active": true,
            "attachmentGroupId": null,
            "type": "SIMPLE_FIELD",
            "hidden": false
        }
    ],
    "templateRecordDefinition": "com.bmc.dsm.case-lib:Case Template"
};

export const DynamicGroupContainsHiddenFieldDRDMV21416 = {
    "name": null,
    "processDocumentDefinitionId": null,
    "processInputDocName": null,
    "processName": null,
    "lineOfBusiness": "HumanResource",
    "templateId": "",
    "id": null,
    "attributeDefinitions": [
        {
            "name": "GroupOne",
            "description": "GroupOne",
            "externalId": "",
            "type": "GROUP_FIELD",
            "active": true,
            "attributes": [
                {
                    "name": "FieldGroup1",
                    "description": "FieldGroup1",
                    "dataType": "TEXT",
                    "required": false,
                    "confidential": false,
                    "dataProviderUserRole": "Requester",
                    "dataProviderApplication": "",
                    "active": true,
                    "externalId": "",
                    "attachmentGroupId": null,
                    "type": "SIMPLE_FIELD",
                    "hidden": true,
                    "lineOfBusiness": "HumanResource"
                },
            ]
        }
    ]
};

export const AllSourceAndTypeDRDMV21515 = {
    "name": "Not Applicable",
    "processDocumentDefinitionId": "IDGADGG8ECDC0AQ0JI9JQJ1GGVTOG0",
    "processInputDocName": "com.bmc.dsm.bwfa:AllTypeOFData",
    "processName": null,
    "lineOfBusiness": "HumanResource",
    "templateId": "AGGADGG8ECDC0AQ0JI7VQJ1GF8TNYG",
    //"id":"AGGADGG8ECDC0AQ0JI9JQJ1GGWTOG3",
    "attributeDefinitions": [
        {
            "id": "",
            "fieldId": "FLD-646e7c60-5424-4e37-a041-35e4b3bc6d66",
            "name": "Number Field",
            "description": "Number Field",
            "dataType": "NUMBER",
            "required": false,
            "confidential": false,
            "dataProviderUserRole": "Requester",
            "dataProviderApplication": "",
            "active": true,
            "externalId": "",
            "attachmentGroupId": null,
            "type": "SIMPLE_FIELD",
            "hidden": true,
            "lineOfBusiness": "HumanResource"
        },
        {
            "id": "",
            "fieldId": "FLD-22a1f90f-2369-40f4-b060-27db6e7cb567",
            "name": "Date Field",
            "description": "Date Field",
            "dataType": "DATE",
            "required": false,
            "confidential": false,
            "dataProviderUserRole": "Agent",
            "dataProviderApplication": "",
            "active": true,
            "externalId": "",
            "attachmentGroupId": null,
            "type": "SIMPLE_FIELD",
            "hidden": true,
            "lineOfBusiness": "HumanResource"
        },
        {
            "id": "",
            "fieldId": "FLD-ab274061-6c72-48da-a834-647f3e3fb8a1",
            "name": "Boolean Field",
            "description": "Boolean Field",
            "dataType": "BOOLEAN",
            "required": false,
            "confidential": false,
            "dataProviderUserRole": "Task Assignee",
            "dataProviderApplication": "",
            "active": true,
            "externalId": "",
            "attachmentGroupId": null,
            "type": "SIMPLE_FIELD",
            "hidden": true,
            "lineOfBusiness": "HumanResource"
        },
        {
            "id": "",
            "fieldId": "FLD-75789cae-abbe-4ddf-84ed-8f2299c4b34d",
            "name": "List Field",
            "description": "List Field",
            "dataType": "LIST",
            "required": false,
            "confidential": false,
            "dataProviderUserRole": "System",
            "dataProviderApplication": "",
            "displayDataListDefinitions": [
                {
                    "nameKey": "new Value1",
                    "displayText": "new Value1"
                }
            ],
            "active": true,
            "externalId": "",
            "attachmentGroupId": null,
            "type": "SIMPLE_FIELD",
            "hidden": true,
            "lineOfBusiness": "HumanResource"
        },
        {
            "id": "",
            "fieldId": "FLD-a0b2eb76-7668-4168-a4b3-943efcb84f2a",
            "name": "Attachment Field",
            "description": "Attachment Field",
            "dataType": "ATTACHMENT",
            "required": false,
            "confidential": false,
            "dataProviderUserRole": "Agent",
            "dataProviderApplication": "",
            "active": true,
            "externalId": "",
            "attachmentGroupId": null,
            "type": "SIMPLE_FIELD",
            "hidden": true,
            "lineOfBusiness": "HumanResource"
        },
        {
            "id": "",
            "fieldId": "FLD-be694d80-20e4-4739-9584-b4da2b7b3ac5",
            "name": "Date and Time",
            "description": "Date and Time",
            "dataType": "DATE_TIME",
            "required": false,
            "confidential": false,
            "dataProviderUserRole": "Agent",
            "dataProviderApplication": "",
            "active": true,
            "externalId": "",
            "attachmentGroupId": null,
            "type": "SIMPLE_FIELD",
            "hidden": true,
            "lineOfBusiness": "HumanResource"
        },
        {
            "id": "",
            "fieldId": "FLD-83e12be7-8073-4590-9ce3-74207bc2768d",
            "name": "Time",
            "description": "Time",
            "dataType": "TEXT",
            "required": false,
            "confidential": false,
            "dataProviderUserRole": "Agent",
            "dataProviderApplication": "",
            "active": true,
            "externalId": "",
            "attachmentGroupId": null,
            "type": "SIMPLE_FIELD",
            "hidden": true,
            "lineOfBusiness": "HumanResource"
        },
        {
            "id": "",
            "fieldId": "FLD-bdae5b8a-c241-4cf6-bce4-0ae8d1b26025",
            "name": "Number1 field",
            "description": "Number1 field",
            "dataType": "NUMBER",
            "required": false,
            "confidential": false,
            "dataProviderUserRole": "Agent",
            "dataProviderApplication": "",
            "active": true,
            "externalId": "",
            "attachmentGroupId": null,
            "type": "SIMPLE_FIELD",
            "hidden": false,
            "lineOfBusiness": "HumanResource"
        },
        {
            "id": "",
            "fieldId": "FLD-77d488cd-77c3-4919-85b4-1c9970c3e4ed",
            "name": "Date1 field",
            "description": "Date1 field",
            "dataType": "DATE",
            "required": false,
            "confidential": false,
            "dataProviderUserRole": "Agent",
            "dataProviderApplication": "",
            "active": true,
            "externalId": "",
            "attachmentGroupId": null,
            "type": "SIMPLE_FIELD",
            "hidden": false,
            "lineOfBusiness": "HumanResource"
        },
        {
            "id": "",
            "fieldId": "FLD-3061b4c4-f250-4de2-b7d6-dcfe27f2a968",
            "name": "Boolean1 field",
            "description": "Boolean1 field",
            "dataType": "BOOLEAN",
            "required": false,
            "confidential": false,
            "dataProviderUserRole": "Agent",
            "dataProviderApplication": "",
            "active": true,
            "externalId": "",
            "attachmentGroupId": null,
            "type": "SIMPLE_FIELD",
            "hidden": false,
            "lineOfBusiness": "HumanResource"
        },
        {
            "id": "",
            "fieldId": "FLD-a1d8415d-92ea-4815-ad80-ecc76bc55ae2",
            "name": "List1 Field",
            "description": "List1 Field",
            "dataType": "LIST",
            "required": false,
            "confidential": false,
            "dataProviderUserRole": "Agent",
            "dataProviderApplication": "",
            "displayDataListDefinitions": [
                {
                    "nameKey": "new Value",
                    "displayText": "new Value"
                }
            ],
            "active": true,
            "externalId": "",
            "attachmentGroupId": null,
            "type": "SIMPLE_FIELD",
            "hidden": false,
            "lineOfBusiness": "HumanResource"
        },
        {
            "id": "",
            "fieldId": "FLD-f88e9391-f598-4a88-904f-a7c15a36ad0a",
            "name": "Attachment1 Field",
            "description": "Attachment1 Field",
            "dataType": "ATTACHMENT",
            "required": false,
            "confidential": false,
            "dataProviderUserRole": "Agent",
            "dataProviderApplication": "",
            "active": true,
            "externalId": "",
            "attachmentGroupId": null,
            "type": "SIMPLE_FIELD",
            "hidden": false,
            "lineOfBusiness": "HumanResource"
        },
        {
            "id": "",
            "fieldId": "FLD-de9b7f7a-a6d1-4546-b22d-c66fdc8b7641",
            "name": "Date1 and time1",
            "description": "Date1 and time1",
            "dataType": "DATE_TIME",
            "required": false,
            "confidential": false,
            "dataProviderUserRole": "Agent",
            "dataProviderApplication": "",
            "active": true,
            "externalId": "",
            "attachmentGroupId": null,
            "type": "SIMPLE_FIELD",
            "hidden": false,
            "lineOfBusiness": "HumanResource"
        },
        {
            "id": "",
            "fieldId": "FLD-225f68c7-a8db-430e-b5e3-d54806af48b3",
            "name": "time1",
            "description": "time1",
            "dataType": "TIME",
            "required": false,
            "confidential": false,
            "dataProviderUserRole": "Agent",
            "dataProviderApplication": "",
            "active": true,
            "externalId": "",
            "attachmentGroupId": null,
            "type": "SIMPLE_FIELD",
            "hidden": false,
            "lineOfBusiness": "HumanResource"
        }
    ],
    "templateRecordDefinition": "com.bmc.dsm.task-lib:Task Template"
};

export const DynamicGroupField = {
    "name": null,
    "processDocumentDefinitionId": null,
    "processInputDocName": null,
    "processName": null,
    "templateId": "",
    "id": null,
    "lineOfBusiness": "HumanResource",
    "attributeDefinitions": [
        {
            "name": "GroupOne",
            "description": "GroupOne",
            "externalId": "",
            "type": "GROUP_FIELD",
            "active": true,
            "attributes": [
                {
                    "name": "FieldGroup1",
                    "description": "FieldGroup1",
                    "dataType": "TEXT",
                    "dataProviderUserRole": "Agent",
                },
                {
                    "name": "externalNumber",
                    "description": "externalNumber",
                    "dataType": "NUMBER",
                    "dataProviderUserRole": "Agent",
                },
                {
                    "name": "externalDate",
                    "description": "externalDate",
                    "dataType": "DATE",
                    "dataProviderUserRole": "Agent",
                },
                {
                    "name": "externalBoolean",
                    "description": "externalBoolean",
                    "dataType": "BOOLEAN",
                    "dataProviderUserRole": "Agent",
                },
                {
                    "name": "externalDateTime",
                    "description": "externalDateTime",
                    "dataType": "DATE_TIME",
                    "dataProviderUserRole": "Agent",
                },
                {
                    "name": "externalTime",
                    "description": "externalTime",
                    "dataType": "TIME",
                    "dataProviderUserRole": "Agent",
                },
                {
                    "name": "newfiles",
                    "description": "dynamicList",
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
                    "name": "externalAttachment1",
                    "description": "externalAttachment1",
                    "dataType": "ATTACHMENT",
                    "dataProviderUserRole": "Agent",
                }
            ]
        },
        {
            "name": "FieldGroupOutside",
            "description": "FieldGroupOutside",
            "dataType": "TEXT",
            "dataProviderUserRole": "Agent",
        },

        {
            "name": "FieldGroupOutside1",
            "description": "FieldGroupOutside1",
            "dataType": "TEXT",
            "dataProviderUserRole": "Agent",
        }
    ]
};

export const DynamicGroupFieldDRDMV13129Data1 = {
    "name": null,
    "processDocumentDefinitionId": null,
    "processInputDocName": null,
    "processName": null,
    "templateId": "",
    "id": null,
    "lineOfBusiness": "HumanResource",
    "attributeDefinitions": [
        {
            "name": "GroupOne",
            "description": "GroupOne",
            "externalId": "",
            "type": "GROUP_FIELD",
            "active": true,
            "attributes": [
                {
                    "name": "FieldGroup1",
                    "description": "FieldGroup1",
                    "dataType": "TEXT",
                    "dataProviderUserRole": "Agent"
                },
                {
                    "name": "externalNumber",
                    "description": "externalNumber",
                    "dataType": "NUMBER",
                    "dataProviderUserRole": "Agent"
                },
                {
                    "name": "externalDate",
                    "description": "externalDate",
                    "dataType": "DATE",
                    "dataProviderUserRole": "Agent"
                },
                {
                    "name": "externalBoolean",
                    "description": "externalBoolean",
                    "dataType": "BOOLEAN",
                    "dataProviderUserRole": "Agent"
                },
                {
                    "name": "externalDateTime",
                    "description": "externalDateTime",
                    "dataType": "DATE_TIME",
                    "dataProviderUserRole": "Agent"
                }
            ]
        },
        {
            "name": "FieldGroupOutside",
            "description": "FieldGroupOutside",
            "dataType": "TEXT",
            "dataProviderUserRole": "Agent"
        }
    ]
};

export const DynamicGroupFieldDRDMV13129Data2 = {
    "name": null,
    "processDocumentDefinitionId": null,
    "processInputDocName": null,
    "processName": null,
    "templateId": "",
    "id": null,
    "lineOfBusiness": "HumanResource",
    "attributeDefinitions": [
        {
            "name": "GroupTwo",
            "description": "GroupTwo",
            "externalId": "",
            "type": "GROUP_FIELD",
            "active": true,
            "attributes": [
                {
                    "name": "externalDate1",
                    "description": "externalDate1",
                    "dataType": "DATE",
                    "dataProviderUserRole": "Agent"
                },
                {
                    "name": "externalBoolean1",
                    "description": "externalBoolean1",
                    "dataType": "BOOLEAN",
                    "dataProviderUserRole": "Agent"
                },
                {
                    "name": "externalDateTime1",
                    "description": "externalDateTime1",
                    "dataType": "DATE_TIME",
                    "dataProviderUserRole": "Agent"
                },
                {
                    "name": "externalTime",
                    "description": "externalTime",
                    "dataType": "TIME",
                    "dataProviderUserRole": "Agent"
                },
                {
                    "name": "newfiles",
                    "description": "dynamicList",
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
                    "name": "externalAttachment1",
                    "description": "externalAttachment1",
                    "dataType": "ATTACHMENT",
                    "dataProviderUserRole": "Agent"
                }
            ]
        }
    ]
};

export const DynamicGroupContainsConfidentialsFieldDRDMV15041 = {
    "name": null,
    "processDocumentDefinitionId": null,
    "processInputDocName": null,
    "processName": null,
    "templateId": "",
    "id": null,
    "lineOfBusiness": "HumanResource",
    "attributeDefinitions": [
        {
            "name": "GroupOne",
            "description": "GroupOne",
            "externalId": "",
            "type": "GROUP_FIELD",
            "active": true,
            "attributes": [
                {
                    "name": "FieldGroup1",
                    "description": "FieldGroup1",
                    "dataType": "TEXT",
                    "required": false,
                    "confidential": true,
                    "dataProviderUserRole": "Requester",
                    "dataProviderApplication": "",
                    "active": true,
                    "externalId": "",
                    "attachmentGroupId": null,
                    "type": "SIMPLE_FIELD",
                    "hidden": false,
                    "lineOfBusiness": "HumanResource"
                },
                {
                    "name": "externalDate",
                    "description": "externalDate",
                    "dataType": "DATE",
                    "dataProviderUserRole": "Agent",
                },
                {
                    "name": "externalBoolean",
                    "description": "externalBoolean",
                    "dataType": "BOOLEAN",
                    "dataProviderUserRole": "Agent",
                },
                {
                    "name": "externalDateTime",
                    "description": "externalDateTime",
                    "dataType": "DATE_TIME",
                    "dataProviderUserRole": "Agent",
                }]
        }
    ]
};
export const TASK_TEMPLATE__DYNAMIC_FIELDS_DRDMV_13948 =
{
    "name": "case template",
    "templateRecordDefinition": "com.bmc.dsm.task-lib:Task Template",
    "templateId": "nnn",
    "lineOfBusiness": "HumanResource",
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
            "name": "attachment4",
            "description": "attachment4",
            "dataType": "ATTACHMENT",
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "attachment5",
            "description": "attachment5",
            "dataType": "ATTACHMENT",
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "attachment6",
            "description": "attachment6",
            "dataType": "ATTACHMENT",
            "dataProviderUserRole": "Agent",
        }
    ]
};

export const MULTIPLE_ATTACHMENTS = {
    "name": "case template",
    "templateRecordDefinition": "com.bmc.dsm.task-lib:Task Template",
    "templateId": "nnn",
    "lineOfBusiness": "HumanResource",
    "attributeDefinitions": [{
        "name": "attachment1",
        "description": "attachmentFirst",
        "dataType": "ATTACHMENT",
        "dataProviderUserRole": "Agent",
    },
    {
        "name": "attachment2",
        "description": "attachmentSecond",
        "dataType": "ATTACHMENT",
        "dataProviderUserRole": "Agent",
    },
    {
        "name": "attachment3",
        "description": "attachmentThird",
        "dataType": "ATTACHMENT",
        "dataProviderUserRole": "Agent",
    },
    {
        "name": "attachment4",
        "description": "attachmentFour",
        "dataType": "ATTACHMENT",
        "dataProviderUserRole": "Agent",
    }
    ]
}; 

export const TASK_TEMPLATE__DYNAMIC_FIELDS_MANUAL =
{
    "name": "case template",
    "templateRecordDefinition": "com.bmc.dsm.task-lib:Task Template",
    "templateId": "nnn",
    "lineOfBusiness": "HumanResource",
    "attributeDefinitions": [
        {
            "name": "manualtempTextC",
            "description": "manualtempTextC",
            "dataType": "TEXT",
            "confidential": true,
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "manualtempNumberC",
            "description": "manualtempNumberC",
            "dataType": "NUMBER",
            "confidential": true,
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "manualtempDateC",
            "description": "manualtempDateC",
            "dataType": "DATE",
            "confidential": true,
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "manualtempBooleanC",
            "description": "manualtempBooleanC",
            "dataType": "BOOLEAN",
            "confidential": true,
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "manualtempDateTimeC",
            "description": "manualtempDateTimeC",
            "dataType": "DATE_TIME",
            "confidential": true,
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "manualtempTimeC",
            "description": "manualtempTimeC",
            "dataType": "TIME",
            "confidential": true,
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "manualtempAttachmentC",
            "description": "manualtempAttachmentC",
            "dataType": "ATTACHMENT",
            "confidential": true,
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "manualtempText",
            "description": "manualtempText",
            "dataType": "TEXT",
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "manualtempNumber",
            "description": "manualtempNumber",
            "dataType": "NUMBER",
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "manualtempDate",
            "description": "manualtempDate",
            "dataType": "DATE",
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "manualtempBoolean",
            "description": "manualtempBoolean",
            "dataType": "BOOLEAN",
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "manualtempDateTime",
            "description": "manualtempDateTime",
            "dataType": "DATE_TIME",
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "manualtempTime",
            "description": "manualtempTime",
            "dataType": "TIME",
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "manualtempAttachment",
            "description": "manualtempAttachment",
            "dataType": "ATTACHMENT",
            "dataProviderUserRole": "Agent",
        }
    ]
};

export const TASK_TEMPLATE__DYNAMIC_FIELDS_EXTERNAL =
{
    "name": "case template",
    "templateRecordDefinition": "com.bmc.dsm.task-lib:Task Template",
    "templateId": "nnn",
    "lineOfBusiness": "HumanResource",
    "attributeDefinitions": [
        {
            "name": "externaltempTextC",
            "description": "externaltempTextC",
            "dataType": "TEXT",
            "confidential": true,
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "externaltempNumberC",
            "description": "externaltempNumberC",
            "dataType": "NUMBER",
            "confidential": true,
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "externaltempDateC",
            "description": "externaltempDateC",
            "dataType": "DATE",
            "confidential": true,
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "externaltempBooleanC",
            "description": "externaltempBooleanC",
            "dataType": "BOOLEAN",
            "confidential": true,
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "externaltempDateTimeC",
            "description": "externaltempDateTimeC",
            "dataType": "DATE_TIME",
            "confidential": true,
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "externaltempTimeC",
            "description": "externaltempTimeC",
            "dataType": "TIME",
            "confidential": true,
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "externaltempAttachmentC",
            "description": "externaltempAttachmentC",
            "dataType": "ATTACHMENT",
            "confidential": true,
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "externaltempText",
            "description": "externaltempText",
            "dataType": "TEXT",
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "externaltempNumber",
            "description": "externaltempNumber",
            "dataType": "NUMBER",
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "externaltempDate",
            "description": "externaltempDate",
            "dataType": "DATE",
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "externaltempBoolean",
            "description": "externaltempBoolean",
            "dataType": "BOOLEAN",
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "externaltempDateTime",
            "description": "externaltempDateTime",
            "dataType": "DATE_TIME",
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "externaltempTime",
            "description": "externaltempTime",
            "dataType": "TIME",
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "externaltempAttachment",
            "description": "externaltempAttachment",
            "dataType": "ATTACHMENT",
            "dataProviderUserRole": "Agent",
        }
    ]
};

export const TASK_TEMPLATE__DYNAMIC_FIELDS_AUTOMATED =
{
    "name": "case template",
    "templateRecordDefinition": "com.bmc.dsm.task-lib:Task Template",
    "templateId": "nnn",
    "lineOfBusiness": "HumanResource",
    "attributeDefinitions": [
        {
            "name": "automatedtempTextC",
            "description": "automatedtempTextC",
            "dataType": "TEXT",
            "confidential": true,
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "automatedtempNumberC",
            "description": "automatedtempNumberC",
            "dataType": "NUMBER",
            "confidential": true,
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "automatedtempDateC",
            "description": "automatedtempDateC",
            "dataType": "DATE",
            "confidential": true,
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "automatedtempBooleanC",
            "description": "automatedtempBooleanC",
            "dataType": "BOOLEAN",
            "confidential": true,
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "externaltempDateTimeC",
            "description": "externaltempDateTimeC",
            "dataType": "DATE_TIME",
            "confidential": true,
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "automatedtempTimeC",
            "description": "automatedtempTimeC",
            "dataType": "TIME",
            "confidential": true,
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "automatedtempAttachmentC",
            "description": "externaltempAttachmentC",
            "dataType": "ATTACHMENT",
            "confidential": true,
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "externaltempText",
            "description": "externaltempText",
            "dataType": "TEXT",
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "automatedtempNumber",
            "description": "automatedtempNumber",
            "dataType": "NUMBER",
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "automatedtempDate",
            "description": "automatedtempDate",
            "dataType": "DATE",
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "automatedtempBoolean",
            "description": "externaltempBoolean",
            "dataType": "BOOLEAN",
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "automatedtempDateTime",
            "description": "externaltempDateTime",
            "dataType": "DATE_TIME",
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "automatedtempTime",
            "description": "externaltempTime",
            "dataType": "TIME",
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "automatedtempAttachment",
            "description": "externaltempAttachment",
            "dataType": "ATTACHMENT",
            "dataProviderUserRole": "Agent",
        }
    ]
};

export const BULK_DYNAMIC_FIELDS_INSIDE_OUTSIDE_GROUP = {
    "name": null,
    "processDocumentDefinitionId": null,
    "processInputDocName": null,
    "processName": null,
    "templateId": "",
    "id": null,
    "lineOfBusiness": "HumanResource",
    "attributeDefinitions": [
        {
            "name": "GroupOne",
            "description": "GroupOne",
            "externalId": "",
            "type": "GROUP_FIELD",
            "active": true,
            "attributes": [
                {
                    "name": "WithInGroupNUMBER1",
                    "description": "WithInGroupNUMBER1",
                    "dataType": "NUMBER",
                    "dataProviderUserRole": "Requester",
                },
                {
                    "name": "WithInGroupNUMBER2",
                    "description": "WithInGroupNUMBER2",
                    "dataType": "NUMBER",
                    "dataProviderUserRole": "Requester",
                },
                {
                    "name": "WithInGroupNUMBER3",
                    "description": "WithInGroupNUMBER3",
                    "dataType": "NUMBER",
                    "dataProviderUserRole": "Requester",
                },
                {
                    "name": "WithInGroupNUMBER4",
                    "description": "WithInGroupNUMBER4",
                    "dataType": "NUMBER",
                    "dataProviderUserRole": "Requester",
                },
                {
                    "name": "WithInGroupNUMBER5",
                    "description": "WithInGroupNUMBER5",
                    "dataType": "NUMBER",
                    "dataProviderUserRole": "Requester",
                },
                {
                    "name": "WithInGroupNUMBER6",
                    "description": "WithInGroupNUMBER6",
                    "dataType": "NUMBER",
                    "dataProviderUserRole": "Requester",
                },
                {
                    "name": "WithInGroupNUMBER7",
                    "description": "WithInGroupNUMBER7",
                    "dataType": "NUMBER",
                    "dataProviderUserRole": "Requester",
                },
                {
                    "name": "WithInGroupNUMBER8",
                    "description": "WithInGroupNUMBER8",
                    "dataType": "NUMBER",
                    "dataProviderUserRole": "Requester",
                },
                {
                    "name": "WithInGroupNUMBER9",
                    "description": "WithInGroupNUMBER9",
                    "dataType": "NUMBER",
                    "dataProviderUserRole": "Requester",
                },
                {
                    "name": "WithInGroupNUMBER10",
                    "description": "WithInGroupNUMBER10",
                    "dataType": "NUMBER",
                    "dataProviderUserRole": "Requester",
                },
                {
                    "name": "WithInGroupNUMBER11",
                    "description": "WithInGroupNUMBER11",
                    "dataType": "NUMBER",
                    "dataProviderUserRole": "Requester",
                },
                {
                    "name": "WithInGroupNUMBER12",
                    "description": "WithInGroupNUMBER12",
                    "dataType": "NUMBER",
                    "dataProviderUserRole": "Requester",
                },
                {
                    "name": "WithInGroupNUMBER13",
                    "description": "WithInGroupNUMBER13",
                    "dataType": "NUMBER",
                    "dataProviderUserRole": "Requester",
                },
                {
                    "name": "WithInGroupNUMBER14",
                    "description": "WithInGroupNUMBER14",
                    "dataType": "NUMBER",
                    "dataProviderUserRole": "Requester",
                },
                {
                    "name": "WithInGroupNUMBER15",
                    "description": "WithInGroupNUMBER15",
                    "dataType": "NUMBER",
                    "dataProviderUserRole": "Requester",
                },
                {
                    "name": "WithInGroupDATE1",
                    "description": "WithInGroupDATE1",
                    "dataType": "DATE",
                    "dataProviderUserRole": "Requester",
                },
                {
                    "name": "WithInGroupDATE2",
                    "description": "WithInGroupDATE2",
                    "dataType": "DATE",
                    "dataProviderUserRole": "Requester",
                },
                {
                    "name": "WithInGroupDATE3",
                    "description": "WithInGroupDATE3",
                    "dataType": "DATE",
                    "dataProviderUserRole": "Requester",
                },
                {
                    "name": "WithInGroupDATE4",
                    "description": "WithInGroupDATE4",
                    "dataType": "DATE",
                    "dataProviderUserRole": "Requester",
                },
                {
                    "name": "WithInGroupDATE5",
                    "description": "WithInGroupDATE5",
                    "dataType": "DATE",
                    "dataProviderUserRole": "Requester",
                },
                {
                    "name": "WithInGroupDATE6",
                    "description": "WithInGroupDATE6",
                    "dataType": "DATE",
                    "dataProviderUserRole": "Requester",
                },
                {
                    "name": "WithInGroupDATE7",
                    "description": "WithInGroupDATE7",
                    "dataType": "DATE",
                    "dataProviderUserRole": "Requester",
                },
                {
                    "name": "WithInGroupDATE8",
                    "description": "WithInGroupDATE8",
                    "dataType": "DATE",
                    "dataProviderUserRole": "Requester",
                },
                {
                    "name": "WithInGroupDATE9",
                    "description": "WithInGroupDATE9",
                    "dataType": "DATE",
                    "dataProviderUserRole": "Requester",
                },
                {
                    "name": "WithInGroupDATE10",
                    "description": "WithInGroupDATE10",
                    "dataType": "DATE",
                    "dataProviderUserRole": "Requester",
                },
                {
                    "name": "WithInGroupDATE11",
                    "description": "WithInGroupDATE11",
                    "dataType": "DATE",
                    "dataProviderUserRole": "Requester",
                },
                {
                    "name": "WithInGroupDATE12",
                    "description": "WithInGroupDATE12",
                    "dataType": "DATE",
                    "dataProviderUserRole": "Requester",
                },
                {
                    "name": "WithInGroupDATE13",
                    "description": "WithInGroupDATE13",
                    "dataType": "DATE",
                    "dataProviderUserRole": "Requester",
                },
                {
                    "name": "WithInGroupDATE14",
                    "description": "WithInGroupDATE14",
                    "dataType": "DATE",
                    "dataProviderUserRole": "Requester",
                },
                {
                    "name": "WithInGroupDATE15",
                    "description": "WithInGroupDATE15",
                    "dataType": "DATE",
                    "dataProviderUserRole": "Requester",
                },
                {
                    "name": "WithInGroupBOOLEAN1",
                    "description": "WithInGroupBOOLEAN1",
                    "dataType": "BOOLEAN",
                    "dataProviderUserRole": "Requester",
                },
                {
                    "name": "WithInGroupBOOLEAN2",
                    "description": "WithInGroupBOOLEAN2",
                    "dataType": "BOOLEAN",
                    "dataProviderUserRole": "Requester",
                },
                {
                    "name": "WithInGroupBOOLEAN3",
                    "description": "WithInGroupBOOLEAN3",
                    "dataType": "BOOLEAN",
                    "dataProviderUserRole": "Requester",
                },
                {
                    "name": "WithInGroupBOOLEAN4",
                    "description": "WithInGroupBOOLEAN4",
                    "dataType": "BOOLEAN",
                    "dataProviderUserRole": "Requester",
                },
                {
                    "name": "WithInGroupBOOLEAN5",
                    "description": "WithInGroupBOOLEAN5",
                    "dataType": "BOOLEAN",
                    "dataProviderUserRole": "Requester",
                },
                {
                    "name": "WithInGroupBOOLEAN6",
                    "description": "WithInGroupBOOLEAN6",
                    "dataType": "BOOLEAN",
                    "dataProviderUserRole": "Requester",
                },
                {
                    "name": "WithInGroupBOOLEAN7",
                    "description": "WithInGroupBOOLEAN7",
                    "dataType": "BOOLEAN",
                    "dataProviderUserRole": "Requester",
                },
                {
                    "name": "WithInGroupBOOLEAN8",
                    "description": "WithInGroupBOOLEAN8",
                    "dataType": "BOOLEAN",
                    "dataProviderUserRole": "Requester",
                },
                {
                    "name": "WithInGroupBOOLEAN9",
                    "description": "WithInGroupBOOLEAN9",
                    "dataType": "BOOLEAN",
                    "dataProviderUserRole": "Requester",
                },
                {
                    "name": "WithInGroupBOOLEAN10",
                    "description": "WithInGroupBOOLEAN10",
                    "dataType": "BOOLEAN",
                    "dataProviderUserRole": "Requester",
                },
                {
                    "name": "WithInGroupBOOLEAN11",
                    "description": "WithInGroupBOOLEAN11",
                    "dataType": "BOOLEAN",
                    "dataProviderUserRole": "Requester",
                },
                {
                    "name": "WithInGroupBOOLEAN12",
                    "description": "WithInGroupBOOLEAN12",
                    "dataType": "BOOLEAN",
                    "dataProviderUserRole": "Requester",
                },
                {
                    "name": "WithInGroupBOOLEAN13",
                    "description": "WithInGroupBOOLEAN13",
                    "dataType": "BOOLEAN",
                    "dataProviderUserRole": "Requester",
                },
                {
                    "name": "WithInGroupBOOLEAN14",
                    "description": "WithInGroupBOOLEAN14",
                    "dataType": "BOOLEAN",
                    "dataProviderUserRole": "Requester",
                },
                {
                    "name": "WithInGroupBOOLEAN15",
                    "description": "WithInGroupBOOLEAN15",
                    "dataType": "BOOLEAN",
                    "dataProviderUserRole": "Requester",
                },
                {
                    "name": "WithInGroupDATETIME1",
                    "description": "WithInGroupDATETIME1",
                    "dataType": "DATE_TIME",
                    "dataProviderUserRole": "Requester",
                },
                {
                    "name": "WithInGroupDATETIME2",
                    "description": "WithInGroupDATETIME2",
                    "dataType": "DATE_TIME",
                    "dataProviderUserRole": "Requester",
                },
                {
                    "name": "WithInGroupDATETIME3",
                    "description": "WithInGroupDATETIME3",
                    "dataType": "DATE_TIME",
                    "dataProviderUserRole": "Requester",
                },
                {
                    "name": "WithInGroupDATETIME4",
                    "description": "WithInGroupDATETIME4",
                    "dataType": "DATE_TIME",
                    "dataProviderUserRole": "Requester",
                },
                {
                    "name": "WithInGroupDATETIME5",
                    "description": "WithInGroupDATETIME5",
                    "dataType": "DATE_TIME",
                    "dataProviderUserRole": "Requester",
                },
                {
                    "name": "WithInGroupDATETIME6",
                    "description": "WithInGroupDATETIME6",
                    "dataType": "DATE_TIME",
                    "dataProviderUserRole": "Requester",
                },
                {
                    "name": "WithInGroupDATETIME7",
                    "description": "WithInGroupDATETIME7",
                    "dataType": "DATE_TIME",
                    "dataProviderUserRole": "Requester",
                },
                {
                    "name": "WithInGroupDATETIME8",
                    "description": "WithInGroupDATETIME8",
                    "dataType": "DATE_TIME",
                    "dataProviderUserRole": "Requester",
                },
                {
                    "name": "WithInGroupDATETIME9",
                    "description": "WithInGroupDATETIME9",
                    "dataType": "DATE_TIME",
                    "dataProviderUserRole": "Requester",
                },
                {
                    "name": "WithInGroupDATETIME10",
                    "description": "WithInGroupDATETIME10",
                    "dataType": "DATE_TIME",
                    "dataProviderUserRole": "Requester",
                },
                {
                    "name": "WithInGroupDATETIME11",
                    "description": "WithInGroupDATETIME11",
                    "dataType": "DATE_TIME",
                    "dataProviderUserRole": "Requester",
                },
                {
                    "name": "WithInGroupDATETIME12",
                    "description": "WithInGroupDATETIME12",
                    "dataType": "DATE_TIME",
                    "dataProviderUserRole": "Requester",
                },
                {
                    "name": "WithInGroupDATETIME13",
                    "description": "WithInGroupDATETIME13",
                    "dataType": "DATE_TIME",
                    "dataProviderUserRole": "Requester",
                },
                {
                    "name": "WithInGroupDATETIME14",
                    "description": "WithInGroupDATETIME14",
                    "dataType": "DATE_TIME",
                    "dataProviderUserRole": "Requester",
                },
                {
                    "name": "WithInGroupDATETIME15",
                    "description": "WithInGroupDATETIME15",
                    "dataType": "DATE_TIME",
                    "dataProviderUserRole": "Requester",
                },
                {
                    "name": "WithInGroupTIME1",
                    "description": "WithInGroupTIME1",
                    "dataType": "TIME",
                    "dataProviderUserRole": "Requester",
                },
                {
                    "name": "WithInGroupTIME2",
                    "description": "WithInGroupTIME2",
                    "dataType": "TIME",
                    "dataProviderUserRole": "Requester",
                },
                {
                    "name": "WithInGroupTIME3",
                    "description": "WithInGroupTIME3",
                    "dataType": "TIME",
                    "dataProviderUserRole": "Requester",
                },
                {
                    "name": "WithInGroupTIME4",
                    "description": "WithInGroupTIME4",
                    "dataType": "TIME",
                    "dataProviderUserRole": "Requester",
                },
                {
                    "name": "WithInGroupTIME5",
                    "description": "WithInGroupTIME5",
                    "dataType": "TIME",
                    "dataProviderUserRole": "Requester",
                },
                {
                    "name": "WithInGroupTIME6",
                    "description": "WithInGroupTIME6",
                    "dataType": "TIME",
                    "dataProviderUserRole": "Requester",
                },
                {
                    "name": "WithInGroupTIME7",
                    "description": "WithInGroupTIME7",
                    "dataType": "TIME",
                    "dataProviderUserRole": "Requester",
                },
                {
                    "name": "WithInGroupTIME8",
                    "description": "WithInGroupTIME8",
                    "dataType": "TIME",
                    "dataProviderUserRole": "Requester",
                },
                {
                    "name": "WithInGroupTIME9",
                    "description": "WithInGroupTIME9",
                    "dataType": "TIME",
                    "dataProviderUserRole": "Requester",
                },
                {
                    "name": "WithInGroupTIME10",
                    "description": "WithInGroupTIME10",
                    "dataType": "TIME",
                    "dataProviderUserRole": "Requester",
                },
                {
                    "name": "WithInGroupTIME11",
                    "description": "WithInGroupTIME11",
                    "dataType": "TIME",
                    "dataProviderUserRole": "Requester",
                },
                {
                    "name": "WithInGroupTIME12",
                    "description": "WithInGroupTIME12",
                    "dataType": "TIME",
                    "dataProviderUserRole": "Requester",
                },
                {
                    "name": "WithInGroupTIME13",
                    "description": "WithInGroupTIME13",
                    "dataType": "TIME",
                    "dataProviderUserRole": "Requester",
                },
                {
                    "name": "WithInGroupTIME14",
                    "description": "WithInGroupTIME14",
                    "dataType": "TIME",
                    "dataProviderUserRole": "Requester",
                },
                {
                    "name": "WithInGroupTIME15",
                    "description": "WithInGroupTIME15",
                    "dataType": "TIME",
                    "dataProviderUserRole": "Requester",
                },
                {
                    "name": "WithInGroupNewLIST1",
                    "description": "WithInGroupLIST1",
                    "dataType": "LIST",
                    "dataProviderUserRole": "Requester",
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
                    "name": "WithInGroupNewLIST2",
                    "description": "WithInGroupLIST2",
                    "dataType": "LIST",
                    "dataProviderUserRole": "Requester",
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
                    "name": "WithInGroupNewLIST3",
                    "description": "WithInGroupLIST3",
                    "dataType": "LIST",
                    "dataProviderUserRole": "Requester",
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
                    "name": "WithInGroupNewLIST4",
                    "description": "WithInGroupLIST4",
                    "dataType": "LIST",
                    "dataProviderUserRole": "Requester",
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
                    "name": "WithInGroupNewLIST5",
                    "description": "WithInGroupLIST5",
                    "dataType": "LIST",
                    "dataProviderUserRole": "Requester",
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
                    "name": "WithInGroupNewLIST6",
                    "description": "WithInGroupLIST6",
                    "dataType": "LIST",
                    "dataProviderUserRole": "Requester",
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
                    "name": "WithInGroupNewLIST7",
                    "description": "WithInGroupLIST7",
                    "dataType": "LIST",
                    "dataProviderUserRole": "Requester",
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
                    "name": "WithInGroupNewLIST8",
                    "description": "WithInGroupLIST8",
                    "dataType": "LIST",
                    "dataProviderUserRole": "Requester",
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
                    "name": "WithInGroupNewLIST9",
                    "description": "WithInGroupLIST9",
                    "dataType": "LIST",
                    "dataProviderUserRole": "Requester",
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
                    "name": "WithInGroupNewLIST10",
                    "description": "WithInGroupLIST10",
                    "dataType": "LIST",
                    "dataProviderUserRole": "Requester",
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
                    "name": "WithInGroupNewLIST11",
                    "description": "WithInGroupLIST11",
                    "dataType": "LIST",
                    "dataProviderUserRole": "Requester",
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
                    "name": "WithInGroupNewLIST12",
                    "description": "WithInGroupLIST12",
                    "dataType": "LIST",
                    "dataProviderUserRole": "Requester",
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
                    "name": "WithInGroupNewLIST13",
                    "description": "WithInGroupLIST13",
                    "dataType": "LIST",
                    "dataProviderUserRole": "Requester",
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
                    "name": "WithInGroupNewLIST14",
                    "description": "WithInGroupLIST14",
                    "dataType": "LIST",
                    "dataProviderUserRole": "Requester",
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
                    "name": "WithInGroupNewLIST15",
                    "description": "WithInGroupLIST15",
                    "dataType": "LIST",
                    "dataProviderUserRole": "Requester",
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
                    "name": "WithInGroupAttachment1",
                    "description": "WithInGroupATTACHMENT1",
                    "dataType": "ATTACHMENT",
                    "dataProviderUserRole": "Requester",
                },
                {
                    "name": "WithInGroupAttachment2",
                    "description": "WithInGroupATTACHMENT2",
                    "dataType": "ATTACHMENT",
                    "dataProviderUserRole": "Requester",
                },                
                {
                    "name": "WithInGroupAttachment3",
                    "description": "WithInGroupATTACHMENT3",
                    "dataType": "ATTACHMENT",
                    "dataProviderUserRole": "Requester",
                },                
                {
                    "name": "WithInGroupAttachment4",
                    "description": "WithInGroupATTACHMENT4",
                    "dataType": "ATTACHMENT",
                    "dataProviderUserRole": "Requester",
                },                
                {
                    "name": "WithInGroupAttachment5",
                    "description": "WithInGroupATTACHMENT5",
                    "dataType": "ATTACHMENT",
                    "dataProviderUserRole": "Requester",
                },                
                {
                    "name": "WithInGroupAttachment6",
                    "description": "WithInGroupATTACHMENT6",
                    "dataType": "ATTACHMENT",
                    "dataProviderUserRole": "Requester",
                },                
                {
                    "name": "WithInGroupAttachment7",
                    "description": "WithInGroupATTACHMENT7",
                    "dataType": "ATTACHMENT",
                    "dataProviderUserRole": "Requester",
                },                
                {
                    "name": "WithInGroupAttachment8",
                    "description": "WithInGroupATTACHMENT8",
                    "dataType": "ATTACHMENT",
                    "dataProviderUserRole": "Requester",
                },                
                {
                    "name": "WithInGroupAttachment9",
                    "description": "WithInGroupATTACHMENT9",
                    "dataType": "ATTACHMENT",
                    "dataProviderUserRole": "Requester",
                },                
                {
                    "name": "WithInGroupAttachment10",
                    "description": "WithInGroupATTACHMENT10",
                    "dataType": "ATTACHMENT",
                    "dataProviderUserRole": "Requester",
                },                
                {
                    "name": "WithInGroupAttachment11",
                    "description": "WithInGroupATTACHMENT11",
                    "dataType": "ATTACHMENT",
                    "dataProviderUserRole": "Requester",
                },                
                {
                    "name": "WithInGroupAttachment12",
                    "description": "WithInGroupATTACHMENT12",
                    "dataType": "ATTACHMENT",
                    "dataProviderUserRole": "Requester",
                },                
                {
                    "name": "WithInGroupAttachment13",
                    "description": "WithInGroupATTACHMENT13",
                    "dataType": "ATTACHMENT",
                    "dataProviderUserRole": "Requester",
                },                
                {
                    "name": "WithInGroupAttachment14",
                    "description": "WithInGroupATTACHMENT14",
                    "dataType": "ATTACHMENT",
                    "dataProviderUserRole": "Requester",
                },
                {
                    "name": "WithInGroupAttachment15",
                    "description": "WithInGroupATTACHMENT15",
                    "dataType": "ATTACHMENT",
                    "dataProviderUserRole": "Requester",
                },                
                {
                    "name": "WithInGroupTempTEXT1",
                    "description": "WithInGroupTempTEXT1",
                    "dataType": "TEXT",
                    "dataProviderUserRole": "Requester",
                },
                {
                    "name": "WithInGroupTempTEXT2",
                    "description": "WithInGroupTempTEXT2",
                    "dataType": "TEXT",
                    "dataProviderUserRole": "Requester",
                },
                {
                    "name": "WithInGroupTempTEXT3",
                    "description": "WithInGroupTempTEXT3",
                    "dataType": "TEXT",
                    "dataProviderUserRole": "Requester",
                },
                {
                    "name": "WithInGroupTempTEXT4",
                    "description": "WithInGroupTempTEXT4",
                    "dataType": "TEXT",
                    "dataProviderUserRole": "Requester",
                },
                {
                    "name": "WithInGroupTempTEXT5",
                    "description": "WithInGroupTempTEXT5",
                    "dataType": "TEXT",
                    "dataProviderUserRole": "Requester",
                },
                {
                    "name": "WithInGroupTempTEXT6",
                    "description": "WithInGroupTempTEXT6",
                    "dataType": "TEXT",
                    "dataProviderUserRole": "Requester",
                },
                {
                    "name": "WithInGroupTempTEXT7",
                    "description": "WithInGroupTempTEXT7",
                    "dataType": "TEXT",
                    "dataProviderUserRole": "Requester",
                },
                {
                    "name": "WithInGroupTempTEXT8",
                    "description": "WithInGroupTempTEXT8",
                    "dataType": "TEXT",
                    "dataProviderUserRole": "Requester",
                },
                {
                    "name": "WithInGroupTempTEXT9",
                    "description": "WithInGroupTempTEXT9",
                    "dataType": "TEXT",
                    "dataProviderUserRole": "Requester",
                },
                {
                    "name": "WithInGroupTempTEXT10",
                    "description": "WithInGroupTempTEXT10",
                    "dataType": "TEXT",
                    "dataProviderUserRole": "Requester",
                },
                {
                    "name": "WithInGroupTempTEXT11",
                    "description": "WithInGroupTempTEXT11",
                    "dataType": "TEXT",
                    "dataProviderUserRole": "Requester",
                },
                {
                    "name": "WithInGroupTempTEXT12",
                    "description": "WithInGroupTempTEXT12",
                    "dataType": "TEXT",
                    "dataProviderUserRole": "Requester",
                },
                {
                    "name": "WithInGroupTempTEXT13",
                    "description": "WithInGroupTempTEXT13",
                    "dataType": "TEXT",
                    "dataProviderUserRole": "Requester",
                },
                {
                    "name": "WithInGroupTempTEXT14",
                    "description": "WithInGroupTempTEXT14",
                    "dataType": "TEXT",
                    "dataProviderUserRole": "Requester",
                },
                {
                    "name": "WithInGroupTempTEXT15",
                    "description": "WithInGroupTempTEXT15",
                    "dataType": "TEXT",
                    "dataProviderUserRole": "Requester",
                }
            ]
        },
        {
            "name": "OutOfGroupNUMBER1",
            "description": "OutOfGroupNUMBER1",
            "dataType": "NUMBER",
            "dataProviderUserRole": "Requester",
        },
        {
            "name": "OutOfGroupNUMBER2",
            "description": "OutOfGroupNUMBER2",
            "dataType": "NUMBER",
            "dataProviderUserRole": "Requester",
        },
        {
            "name": "OutOfGroupNUMBER3",
            "description": "OutOfGroupNUMBER3",
            "dataType": "NUMBER",
            "dataProviderUserRole": "Requester",
        },
        {
            "name": "OutOfGroupNUMBER4",
            "description": "OutOfGroupNUMBER4",
            "dataType": "NUMBER",
            "dataProviderUserRole": "Requester",
        },
        {
            "name": "OutOfGroupNUMBER5",
            "description": "OutOfGroupNUMBER5",
            "dataType": "NUMBER",
            "dataProviderUserRole": "Requester",
        },
        {
            "name": "OutOfGroupNUMBER6",
            "description": "OutOfGroupNUMBER6",
            "dataType": "NUMBER",
            "dataProviderUserRole": "Requester",
        },
        {
            "name": "OutOfGroupNUMBER7",
            "description": "OutOfGroupNUMBER7",
            "dataType": "NUMBER",
            "dataProviderUserRole": "Requester",
        },
        {
            "name": "OutOfGroupNUMBER8",
            "description": "OutOfGroupNUMBER8",
            "dataType": "NUMBER",
            "dataProviderUserRole": "Requester",
        },
        {
            "name": "OutOfGroupNUMBER9",
            "description": "OutOfGroupNUMBER9",
            "dataType": "NUMBER",
            "dataProviderUserRole": "Requester",
        },
        {
            "name": "OutOfGroupNUMBER10",
            "description": "OutOfGroupNUMBER10",
            "dataType": "NUMBER",
            "dataProviderUserRole": "Requester",
        },
        {
            "name": "OutOfGroupNUMBER11",
            "description": "OutOfGroupNUMBER11",
            "dataType": "NUMBER",
            "dataProviderUserRole": "Requester",
        },
        {
            "name": "OutOfGroupNUMBER12",
            "description": "OutOfGroupNUMBER12",
            "dataType": "NUMBER",
            "dataProviderUserRole": "Requester",
        },
        {
            "name": "OutOfGroupNUMBER13",
            "description": "OutOfGroupNUMBER13",
            "dataType": "NUMBER",
            "dataProviderUserRole": "Requester",
        },
        {
            "name": "OutOfGroupNUMBER14",
            "description": "OutOfGroupNUMBER14",
            "dataType": "NUMBER",
            "dataProviderUserRole": "Requester",
        },
        {
            "name": "OutOfGroupNUMBER15",
            "description": "OutOfGroupNUMBER15",
            "dataType": "NUMBER",
            "dataProviderUserRole": "Requester",
        },
        {
            "name": "OutOfGroupDATE1",
            "description": "OutOfGroupDATE1",
            "dataType": "DATE",
            "dataProviderUserRole": "Requester",
        },
        {
            "name": "OutOfGroupDATE2",
            "description": "OutOfGroupDATE2",
            "dataType": "DATE",
            "dataProviderUserRole": "Requester",
        },
        {
            "name": "OutOfGroupDATE3",
            "description": "OutOfGroupDATE3",
            "dataType": "DATE",
            "dataProviderUserRole": "Requester",
        },
        {
            "name": "OutOfGroupDATE4",
            "description": "OutOfGroupDATE4",
            "dataType": "DATE",
            "dataProviderUserRole": "Requester",
        },
        {
            "name": "OutOfGroupDATE5",
            "description": "OutOfGroupDATE5",
            "dataType": "DATE",
            "dataProviderUserRole": "Requester",
        },
        {
            "name": "OutOfGroupDATE6",
            "description": "OutOfGroupDATE6",
            "dataType": "DATE",
            "dataProviderUserRole": "Requester",
        },
        {
            "name": "OutOfGroupDATE7",
            "description": "OutOfGroupDATE7",
            "dataType": "DATE",
            "dataProviderUserRole": "Requester",
        },
        {
            "name": "OutOfGroupDATE8",
            "description": "OutOfGroupDATE8",
            "dataType": "DATE",
            "dataProviderUserRole": "Requester",
        },
        {
            "name": "OutOfGroupDATE9",
            "description": "OutOfGroupDATE9",
            "dataType": "DATE",
            "dataProviderUserRole": "Requester",
        },
        {
            "name": "OutOfGroupDATE10",
            "description": "OutOfGroupDATE10",
            "dataType": "DATE",
            "dataProviderUserRole": "Requester",
        },
        {
            "name": "OutOfGroupDATE11",
            "description": "OutOfGroupDATE11",
            "dataType": "DATE",
            "dataProviderUserRole": "Requester",
        },
        {
            "name": "OutOfGroupDATE12",
            "description": "OutOfGroupDATE12",
            "dataType": "DATE",
            "dataProviderUserRole": "Requester",
        },
        {
            "name": "OutOfGroupDATE13",
            "description": "OutOfGroupDATE13",
            "dataType": "DATE",
            "dataProviderUserRole": "Requester",
        },
        {
            "name": "OutOfGroupDATE14",
            "description": "OutOfGroupDATE14",
            "dataType": "DATE",
            "dataProviderUserRole": "Requester",
        },
        {
            "name": "OutOfGroupDATE15",
            "description": "OutOfGroupDATE15",
            "dataType": "DATE",
            "dataProviderUserRole": "Requester",
        },
        {
            "name": "OutOfGroupBOOLEAN1",
            "description": "OutOfGroupBOOLEAN1",
            "dataType": "BOOLEAN",
            "dataProviderUserRole": "Requester",
        },
        {
            "name": "OutOfGroupBOOLEAN2",
            "description": "OutOfGroupBOOLEAN2",
            "dataType": "BOOLEAN",
            "dataProviderUserRole": "Requester",
        },
        {
            "name": "OutOfGroupBOOLEAN3",
            "description": "OutOfGroupBOOLEAN3",
            "dataType": "BOOLEAN",
            "dataProviderUserRole": "Requester",
        },
        {
            "name": "OutOfGroupBOOLEAN4",
            "description": "OutOfGroupBOOLEAN4",
            "dataType": "BOOLEAN",
            "dataProviderUserRole": "Requester",
        },
        {
            "name": "OutOfGroupBOOLEAN5",
            "description": "OutOfGroupBOOLEAN5",
            "dataType": "BOOLEAN",
            "dataProviderUserRole": "Requester",
        },
        {
            "name": "OutOfGroupBOOLEAN6",
            "description": "OutOfGroupBOOLEAN6",
            "dataType": "BOOLEAN",
            "dataProviderUserRole": "Requester",
        },
        {
            "name": "OutOfGroupBOOLEAN7",
            "description": "OutOfGroupBOOLEAN7",
            "dataType": "BOOLEAN",
            "dataProviderUserRole": "Requester",
        },
        {
            "name": "OutOfGroupBOOLEAN8",
            "description": "OutOfGroupBOOLEAN8",
            "dataType": "BOOLEAN",
            "dataProviderUserRole": "Requester",
        },
        {
            "name": "OutOfGroupBOOLEAN9",
            "description": "OutOfGroupBOOLEAN9",
            "dataType": "BOOLEAN",
            "dataProviderUserRole": "Requester",
        },
        {
            "name": "OutOfGroupBOOLEAN10",
            "description": "OutOfGroupBOOLEAN10",
            "dataType": "BOOLEAN",
            "dataProviderUserRole": "Requester",
        },
        {
            "name": "OutOfGroupBOOLEAN11",
            "description": "OutOfGroupBOOLEAN11",
            "dataType": "BOOLEAN",
            "dataProviderUserRole": "Requester",
        },
        {
            "name": "OutOfGroupBOOLEAN12",
            "description": "OutOfGroupBOOLEAN12",
            "dataType": "BOOLEAN",
            "dataProviderUserRole": "Requester",
        },
        {
            "name": "OutOfGroupBOOLEAN13",
            "description": "OutOfGroupBOOLEAN13",
            "dataType": "BOOLEAN",
            "dataProviderUserRole": "Requester",
        },
        {
            "name": "OutOfGroupBOOLEAN14",
            "description": "OutOfGroupBOOLEAN14",
            "dataType": "BOOLEAN",
            "dataProviderUserRole": "Requester",
        },
        {
            "name": "OutOfGroupBOOLEAN15",
            "description": "OutOfGroupBOOLEAN15",
            "dataType": "BOOLEAN",
            "dataProviderUserRole": "Requester",
        },
        {
            "name": "OutOfGroupDATETIME1",
            "description": "OutOfGroupDATETIME1",
            "dataType": "DATE_TIME",
            "dataProviderUserRole": "Requester",
        },
        {
            "name": "OutOfGroupDATETIME2",
            "description": "OutOfGroupDATETIME2",
            "dataType": "DATE_TIME",
            "dataProviderUserRole": "Requester",
        },
        {
            "name": "OutOfGroupDATETIME3",
            "description": "OutOfGroupDATETIME3",
            "dataType": "DATE_TIME",
            "dataProviderUserRole": "Requester",
        },
        {
            "name": "OutOfGroupDATETIME4",
            "description": "OutOfGroupDATETIME4",
            "dataType": "DATE_TIME",
            "dataProviderUserRole": "Requester",
        },
        {
            "name": "OutOfGroupDATETIME5",
            "description": "OutOfGroupDATETIME5",
            "dataType": "DATE_TIME",
            "dataProviderUserRole": "Requester",
        },
        {
            "name": "OutOfGroupDATETIME6",
            "description": "OutOfGroupDATETIME6",
            "dataType": "DATE_TIME",
            "dataProviderUserRole": "Requester",
        },
        {
            "name": "OutOfGroupDATETIME7",
            "description": "OutOfGroupDATETIME7",
            "dataType": "DATE_TIME",
            "dataProviderUserRole": "Requester",
        },
        {
            "name": "OutOfGroupDATETIME8",
            "description": "OutOfGroupDATETIME8",
            "dataType": "DATE_TIME",
            "dataProviderUserRole": "Requester",
        },
        {
            "name": "OutOfGroupDATETIME9",
            "description": "OutOfGroupDATETIME9",
            "dataType": "DATE_TIME",
            "dataProviderUserRole": "Requester",
        },
        {
            "name": "OutOfGroupDATETIME10",
            "description": "OutOfGroupDATETIME10",
            "dataType": "DATE_TIME",
            "dataProviderUserRole": "Requester",
        },
        {
            "name": "OutOfGroupDATETIME11",
            "description": "OutOfGroupDATETIME11",
            "dataType": "DATE_TIME",
            "dataProviderUserRole": "Requester",
        },
        {
            "name": "OutOfGroupDATETIME12",
            "description": "OutOfGroupDATETIME12",
            "dataType": "DATE_TIME",
            "dataProviderUserRole": "Requester",
        },
        {
            "name": "OutOfGroupDATETIME13",
            "description": "OutOfGroupDATETIME13",
            "dataType": "DATE_TIME",
            "dataProviderUserRole": "Requester",
        },
        {
            "name": "OutOfGroupDATETIME14",
            "description": "OutOfGroupDATETIME14",
            "dataType": "DATE_TIME",
            "dataProviderUserRole": "Requester",
        },
        {
            "name": "OutOfGroupDATETIME15",
            "description": "OutOfGroupDATETIME15",
            "dataType": "DATE_TIME",
            "dataProviderUserRole": "Requester",
        },
        {
            "name": "OutOfGroupTIME1",
            "description": "OutOfGroupTIME1",
            "dataType": "TIME",
            "dataProviderUserRole": "Requester",
        },
        {
            "name": "OutOfGroupTIME2",
            "description": "OutOfGroupTIME2",
            "dataType": "TIME",
            "dataProviderUserRole": "Requester",
        },
        {
            "name": "OutOfGroupTIME3",
            "description": "OutOfGroupTIME3",
            "dataType": "TIME",
            "dataProviderUserRole": "Requester",
        },
        {
            "name": "OutOfGroupTIME4",
            "description": "OutOfGroupTIME4",
            "dataType": "TIME",
            "dataProviderUserRole": "Requester",
        },
        {
            "name": "OutOfGroupTIME5",
            "description": "OutOfGroupTIME5",
            "dataType": "TIME",
            "dataProviderUserRole": "Requester",
        },
        {
            "name": "OutOfGroupTIME6",
            "description": "OutOfGroupTIME6",
            "dataType": "TIME",
            "dataProviderUserRole": "Requester",
        },
        {
            "name": "OutOfGroupTIME7",
            "description": "OutOfGroupTIME7",
            "dataType": "TIME",
            "dataProviderUserRole": "Requester",
        },
        {
            "name": "OutOfGroupTIME8",
            "description": "OutOfGroupTIME8",
            "dataType": "TIME",
            "dataProviderUserRole": "Requester",
        },
        {
            "name": "OutOfGroupTIME9",
            "description": "OutOfGroupTIME9",
            "dataType": "TIME",
            "dataProviderUserRole": "Requester",
        },
        {
            "name": "OutOfGroupTIME10",
            "description": "OutOfGroupTIME10",
            "dataType": "TIME",
            "dataProviderUserRole": "Requester",
        },
        {
            "name": "OutOfGroupTIME11",
            "description": "OutOfGroupTIME11",
            "dataType": "TIME",
            "dataProviderUserRole": "Requester",
        },
        {
            "name": "OutOfGroupTIME12",
            "description": "OutOfGroupTIME12",
            "dataType": "TIME",
            "dataProviderUserRole": "Requester",
        },
        {
            "name": "OutOfGroupTIME13",
            "description": "OutOfGroupTIME13",
            "dataType": "TIME",
            "dataProviderUserRole": "Requester",
        },
        {
            "name": "OutOfGroupTIME14",
            "description": "OutOfGroupTIME14",
            "dataType": "TIME",
            "dataProviderUserRole": "Requester",
        },
        {
            "name": "OutOfGroupTIME15",
            "description": "OutOfGroupTIME15",
            "dataType": "TIME",
            "dataProviderUserRole": "Requester",
        },
        {
            "name": "OutOfGroupNewLIST1",
            "description": "OutOfGroupLIST1",
            "dataType": "LIST",
            "dataProviderUserRole": "Requester",
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
            "name": "OutOfGroupNewLIST2",
            "description": "OutOfGroupLIST2",
            "dataType": "LIST",
            "dataProviderUserRole": "Requester",
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
            "name": "OutOfGroupNewLIST3",
            "description": "OutOfGroupLIST3",
            "dataType": "LIST",
            "dataProviderUserRole": "Requester",
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
            "name": "OutOfGroupNewLIST4",
            "description": "OutOfGroupLIST4",
            "dataType": "LIST",
            "dataProviderUserRole": "Requester",
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
            "name": "OutOfGroupNewLIST5",
            "description": "OutOfGroupLIST5",
            "dataType": "LIST",
            "dataProviderUserRole": "Requester",
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
            "name": "OutOfGroupNewLIST6",
            "description": "OutOfGroupLIST6",
            "dataType": "LIST",
            "dataProviderUserRole": "Requester",
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
            "name": "OutOfGroupNewLIST7",
            "description": "OutOfGroupLIST7",
            "dataType": "LIST",
            "dataProviderUserRole": "Requester",
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
            "name": "OutOfGroupNewLIST8",
            "description": "OutOfGroupLIST8",
            "dataType": "LIST",
            "dataProviderUserRole": "Requester",
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
            "name": "OutOfGroupNewLIST9",
            "description": "OutOfGroupLIST9",
            "dataType": "LIST",
            "dataProviderUserRole": "Requester",
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
            "name": "OutOfGroupNewLIST10",
            "description": "OutOfGroupLIST10",
            "dataType": "LIST",
            "dataProviderUserRole": "Requester",
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
            "name": "OutOfGroupNewLIST11",
            "description": "OutOfGroupLIST11",
            "dataType": "LIST",
            "dataProviderUserRole": "Requester",
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
            "name": "OutOfGroupNewLIST12",
            "description": "OutOfGroupLIST12",
            "dataType": "LIST",
            "dataProviderUserRole": "Requester",
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
            "name": "OutOfGroupNewLIST13",
            "description": "OutOfGroupLIST13",
            "dataType": "LIST",
            "dataProviderUserRole": "Requester",
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
            "name": "OutOfGroupNewLIST14",
            "description": "OutOfGroupLIST14",
            "dataType": "LIST",
            "dataProviderUserRole": "Requester",
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
            "name": "OutOfGroupNewLIST15",
            "description": "OutOfGroupLIST15",
            "dataType": "LIST",
            "dataProviderUserRole": "Requester",
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
            "name": "OutOfGroupAttachment1",
            "description": "OutOfGroupATTACHMENT1",
            "dataType": "ATTACHMENT",
            "dataProviderUserRole": "Requester",
        },
        {
            "name": "OutOfGroupAttachment2",
            "description": "OutOfGroupATTACHMENT2",
            "dataType": "ATTACHMENT",
            "dataProviderUserRole": "Requester",
        },                
        {
            "name": "OutOfGroupAttachment3",
            "description": "OutOfGroupATTACHMENT3",
            "dataType": "ATTACHMENT",
            "dataProviderUserRole": "Requester",
        },                
        {
            "name": "OutOfGroupAttachment4",
            "description": "OutOfGroupATTACHMENT4",
            "dataType": "ATTACHMENT",
            "dataProviderUserRole": "Requester",
        },                
        {
            "name": "OutOfGroupAttachment5",
            "description": "OutOfGroupATTACHMENT5",
            "dataType": "ATTACHMENT",
            "dataProviderUserRole": "Requester",
        },                
        {
            "name": "OutOfGroupAttachment6",
            "description": "OutOfGroupATTACHMENT6",
            "dataType": "ATTACHMENT",
            "dataProviderUserRole": "Requester",
        },                
        {
            "name": "OutOfGroupAttachment7",
            "description": "OutOfGroupATTACHMENT7",
            "dataType": "ATTACHMENT",
            "dataProviderUserRole": "Requester",
        },                
        {
            "name": "OutOfGroupAttachment8",
            "description": "OutOfGroupATTACHMENT8",
            "dataType": "ATTACHMENT",
            "dataProviderUserRole": "Requester",
        },                
        {
            "name": "OutOfGroupAttachment9",
            "description": "OutOfGroupATTACHMENT9",
            "dataType": "ATTACHMENT",
            "dataProviderUserRole": "Requester",
        },                
        {
            "name": "OutOfGroupAttachment10",
            "description": "OutOfGroupATTACHMENT10",
            "dataType": "ATTACHMENT",
            "dataProviderUserRole": "Requester",
        },                
        {
            "name": "OutOfGroupAttachment11",
            "description": "OutOfGroupATTACHMENT11",
            "dataType": "ATTACHMENT",
            "dataProviderUserRole": "Requester",
        },                
        {
            "name": "OutOfGroupAttachment12",
            "description": "OutOfGroupATTACHMENT12",
            "dataType": "ATTACHMENT",
            "dataProviderUserRole": "Requester",
        },                
        {
            "name": "OutOfGroupAttachment13",
            "description": "OutOfGroupATTACHMENT13",
            "dataType": "ATTACHMENT",
            "dataProviderUserRole": "Requester",
        },                
        {
            "name": "OutOfGroupAttachment14",
            "description": "OutOfGroupATTACHMENT14",
            "dataType": "ATTACHMENT",
            "dataProviderUserRole": "Requester",
        },
        {
            "name": "OutOfGroupAttachment15",
            "description": "OutOfGroupATTACHMENT15",
            "dataType": "ATTACHMENT",
            "dataProviderUserRole": "Requester",
        },                
        {
            "name": "OutOfGroupTempTEXT1",
            "description": "OutOfGroupTempTEXT1",
            "dataType": "TEXT",
            "dataProviderUserRole": "Requester",
        },
        {
            "name": "OutOfGroupTempTEXT2",
            "description": "OutOfGroupTempTEXT2",
            "dataType": "TEXT",
            "dataProviderUserRole": "Requester",
        },
        {
            "name": "OutOfGroupTempTEXT3",
            "description": "OutOfGroupTempTEXT3",
            "dataType": "TEXT",
            "dataProviderUserRole": "Requester",
        },
        {
            "name": "OutOfGroupTempTEXT4",
            "description": "OutOfGroupTempTEXT4",
            "dataType": "TEXT",
            "dataProviderUserRole": "Requester",
        },
        {
            "name": "OutOfGroupTempTEXT5",
            "description": "OutOfGroupTempTEXT5",
            "dataType": "TEXT",
            "dataProviderUserRole": "Requester",
        },
        {
            "name": "OutOfGroupTempTEXT6",
            "description": "OutOfGroupTempTEXT6",
            "dataType": "TEXT",
            "dataProviderUserRole": "Requester",
        },
        {
            "name": "OutOfGroupTempTEXT7",
            "description": "OutOfGroupTempTEXT7",
            "dataType": "TEXT",
            "dataProviderUserRole": "Requester",
        },
        {
            "name": "OutOfGroupTempTEXT8",
            "description": "OutOfGroupTempTEXT8",
            "dataType": "TEXT",
            "dataProviderUserRole": "Requester",
        },
        {
            "name": "OutOfGroupTempTEXT9",
            "description": "OutOfGroupTempTEXT9",
            "dataType": "TEXT",
            "dataProviderUserRole": "Requester",
        },
        {
            "name": "OutOfGroupTempTEXT10",
            "description": "OutOfGroupTempTEXT10",
            "dataType": "TEXT",
            "dataProviderUserRole": "Requester",
        },
        {
            "name": "OutOfGroupTempTEXT11",
            "description": "OutOfGroupTempTEXT11",
            "dataType": "TEXT",
            "dataProviderUserRole": "Requester",
        },
        {
            "name": "OutOfGroupTempTEXT12",
            "description": "OutOfGroupTempTEXT12",
            "dataType": "TEXT",
            "dataProviderUserRole": "Requester",
        },
        {
            "name": "OutOfGroupTempTEXT13",
            "description": "OutOfGroupTempTEXT13",
            "dataType": "TEXT",
            "dataProviderUserRole": "Requester",
        },
        {
            "name": "OutOfGroupTempTEXT14",
            "description": "OutOfGroupTempTEXT14",
            "dataType": "TEXT",
            "dataProviderUserRole": "Requester",
        },
        {
            "name": "OutOfGroupTempTEXT15",
            "description": "OutOfGroupTempTEXT15",
            "dataType": "TEXT",
            "dataProviderUserRole": "Requester",
        }
    ]
};

export const CASE_TEMPLATE_WITH_ATTACHMENT_FIELDS = {
    "attributeDefinitions": [
        {
            "name": "Group1",
            "description": "Group1",
            "type": "GROUP_FIELD",
            "active": true,
            "externalId": "",
            "published": false,
            "shouldPublish": false.valueOf,
            "attributes": [{​
                "name": "Attachment1_4055",
                "description": "Attachment1_4055",
                "dataType": "ATTACHMENT",
                "required": false,
                "confidential": false,
                "dataProviderUserRole": "Agent",
            }​]
        }​,
        {​
            "name": "Group2",
            "description": "Group2",
            "externalId": "",
            "type": "GROUP_FIELD",
            "active": true,
            "published": false,
            "shouldPublish": false,
            "attributes": [{​
                "name": "Attachment2_4055",
                "description": "Attachment2_4055",
                "dataType": "ATTACHMENT",
                "required": false,
                "confidential": false,
                "dataProviderUserRole": "Agent",
            }​]
     }​],
        "name": null,
        "processDocumentDefinitionId": null,
        "processInputDocName": null,
        "processName": null,
        "templateId": "AGGADG28DD4ZZAQQFLCUQQFLCUB4M7",
        "templateRecordDefinition": null,
        "lineOfBusiness": "HumanResource"
}