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
export const CASE_TEMPLATE_REQUESTER_DYNAMIC_FIELDS =
{
    "name": "case template",
    "templateId": "xalkdjasd",
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
    "templateRecordDefinition": "com.bmc.dsm.case-lib:Case Template",
    "attributeDefinitions": [
        {
            "name": "text1",
            "description": "text1",
            "dataType": "TEXT",
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "text2",
            "description": "text2",
            "dataType": "TEXT",
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "text3",
            "description": "text3",
            "dataType": "TEXT",
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "text4",
            "description": "text4",
            "dataType": "TEXT",
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "text5",
            "description": "text5",
            "dataType": "TEXT",
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "text6",
            "description": "text6",
            "dataType": "TEXT",
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "text7",
            "description": "text7",
            "dataType": "TEXT",
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "text8",
            "description": "text8",
            "dataType": "TEXT",
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "text9",
            "description": "text9",
            "dataType": "TEXT",
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "text10",
            "description": "text10",
            "dataType": "TEXT",
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "text11",
            "description": "text11",
            "dataType": "TEXT",
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "text12",
            "description": "text12",
            "dataType": "TEXT",
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "text13",
            "description": "text13",
            "dataType": "TEXT",
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "text14",
            "description": "text14",
            "dataType": "TEXT",
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "text15",
            "description": "text15",
            "dataType": "TEXT",
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "number1",
            "description": "number1",
            "dataType": "NUMBER",
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "number2",
            "description": "number2",
            "dataType": "NUMBER",
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "number3",
            "description": "number3",
            "dataType": "NUMBER",
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "number4",
            "description": "number4",
            "dataType": "NUMBER",
            "dataProviderUserRole": "Agent",
        }, {
            "name": "number5",
            "description": "number5",
            "dataType": "NUMBER",
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "number6",
            "description": "number6",
            "dataType": "NUMBER",
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "number7",
            "description": "number7",
            "dataType": "NUMBER",
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "number8",
            "description": "number8",
            "dataType": "NUMBER",
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "number9",
            "description": "number9",
            "dataType": "NUMBER",
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "number10",
            "description": "number10",
            "dataType": "NUMBER",
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "number11",
            "description": "number11",
            "dataType": "NUMBER",
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "number12",
            "description": "number12",
            "dataType": "NUMBER",
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "number13",
            "description": "number13",
            "dataType": "NUMBER",
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "number14",
            "description": "number14",
            "dataType": "NUMBER",
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "number15",
            "description": "number15",
            "dataType": "NUMBER",
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "date1",
            "description": "date1",
            "dataType": "DATE",
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "date2",
            "description": "date2",
            "dataType": "DATE",
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "date3",
            "description": "date3",
            "dataType": "DATE",
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "date4",
            "description": "date4",
            "dataType": "DATE",
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "date5",
            "description": "date5",
            "dataType": "DATE",
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "date6",
            "description": "date6",
            "dataType": "DATE",
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "date7",
            "description": "date7",
            "dataType": "DATE",
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "date8",
            "description": "date8",
            "dataType": "DATE",
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "date9",
            "description": "date9",
            "dataType": "DATE",
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "date10",
            "description": "date10",
            "dataType": "DATE",
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "date11",
            "description": "date11",
            "dataType": "DATE",
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "date12",
            "description": "date12",
            "dataType": "DATE",
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "date13",
            "description": "date13",
            "dataType": "DATE",
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "date14",
            "description": "date14",
            "dataType": "DATE",
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "date15",
            "description": "date15",
            "dataType": "DATE",
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "boolean1",
            "description": "boolean1",
            "dataType": "BOOLEAN",
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "boolean2",
            "description": "boolean2",
            "dataType": "BOOLEAN",
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "boolean3",
            "description": "boolean3",
            "dataType": "BOOLEAN",
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "boolean4",
            "description": "boolean4",
            "dataType": "BOOLEAN",
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "boolean5",
            "description": "boolean5",
            "dataType": "BOOLEAN",
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "boolean6",
            "description": "boolean6",
            "dataType": "BOOLEAN",
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "boolean7",
            "description": "boolean7",
            "dataType": "BOOLEAN",
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "boolean8",
            "description": "boolean8",
            "dataType": "BOOLEAN",
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "boolean9",
            "description": "boolean9",
            "dataType": "BOOLEAN",
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "boolean10",
            "description": "boolean10",
            "dataType": "BOOLEAN",
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "boolean11",
            "description": "boolean11",
            "dataType": "BOOLEAN",
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "boolean12",
            "description": "boolean12",
            "dataType": "BOOLEAN",
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "boolean13",
            "description": "boolean13",
            "dataType": "BOOLEAN",
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "boolean14",
            "description": "boolean14",
            "dataType": "BOOLEAN",
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "boolean15",
            "description": "boolean15",
            "dataType": "BOOLEAN",
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "datetime1",
            "description": "datetime1",
            "dataType": "DATE_TIME",
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "datetime2",
            "description": "datetime2",
            "dataType": "DATE_TIME",
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "datetime3",
            "description": "datetime3",
            "dataType": "DATE_TIME",
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "datetime4",
            "description": "datetime4",
            "dataType": "DATE_TIME",
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "datetime5",
            "description": "datetime5",
            "dataType": "DATE_TIME",
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "datetime6",
            "description": "datetime6",
            "dataType": "DATE_TIME",
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "datetime7",
            "description": "datetime7",
            "dataType": "DATE_TIME",
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "datetime8",
            "description": "datetime8",
            "dataType": "DATE_TIME",
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "datetime9",
            "description": "datetime9",
            "dataType": "DATE_TIME",
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "datetime10",
            "description": "datetime10",
            "dataType": "DATE_TIME",
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "datetime11",
            "description": "datetime11",
            "dataType": "DATE_TIME",
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "datetime12",
            "description": "datetime12",
            "dataType": "DATE_TIME",
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "datetime13",
            "description": "datetime13",
            "dataType": "DATE_TIME",
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "datetime14",
            "description": "datetime14",
            "dataType": "DATE_TIME",
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "datetime15",
            "description": "datetime15",
            "dataType": "DATE_TIME",
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "time1",
            "description": "time1",
            "dataType": "TIME",
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "time2",
            "description": "time2",
            "dataType": "TIME",
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "time3",
            "description": "time3",
            "dataType": "TIME",
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "time4",
            "description": "time4",
            "dataType": "TIME",
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "time5",
            "description": "time5",
            "dataType": "TIME",
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "time6",
            "description": "time6",
            "dataType": "TIME",
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "time7",
            "description": "time7",
            "dataType": "TIME",
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "time8",
            "description": "time8",
            "dataType": "TIME",
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "time9",
            "description": "time9",
            "dataType": "TIME",
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "time10",
            "description": "time10",
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
        },
        {
            "name": "attachment7",
            "description": "attachment7",
            "dataType": "ATTACHMENT",
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "attachment8",
            "description": "attachment8",
            "dataType": "ATTACHMENT",
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "attachment9",
            "description": "attachment9",
            "dataType": "ATTACHMENT",
            "dataProviderUserRole": "Agent",
        },
        {
            "name": "attachment10",
            "description": "attachment10",
            "dataType": "ATTACHMENT",
            "dataProviderUserRole": "Agent",
        }
    ]
};
export const CASE_TEMPLATE_REMOVE_FIELDS =
{
    "name": "case template",
    "templateId": "xalkdjasd",
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
        "hidden": true
    }
    ]
};
export const DuplicateOFhiddenFieldDRDMV21418 = {
    "name": "case template",
    "templateRecordDefinition": "com.bmc.dsm.task-lib:Task Template",
    "templateId": "nnn",
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
        "hidden": false
    }
    ]
};
export const UnhiddenField = {
    "name": "Not Applicable",
    "processDocumentDefinitionId": "",
    "processInputDocName": "com.bmc.dsm.bwfa:ssss",
    "processName": null,
    "templateId": "",
    "id": "",
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
            "hidden": false
        }
    ],
    "templateRecordDefinition": "com.bmc.dsm.task-lib:Task Template"
};

export const RequiredHiddenDRDMV21451 = {
    "name": "case template",
    "templateRecordDefinition": "com.bmc.dsm.task-lib:Task Template",
    "templateId": "nnn",
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
        "hidden": true
    }
    ]
};

export const ConfidentialsHiddenDRDMV21452 = {
    "name": "case template",
    "templateRecordDefinition": "com.bmc.dsm.task-lib:Task Template",
    "templateId": "nnn",
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
        "hidden": true
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
                    "hidden": true
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
            "hidden": true
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
            "hidden": true
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
            "hidden": true
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
            "hidden": true
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
            "hidden": true
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
            "hidden": true
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
            "hidden": true
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
            "hidden": false
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
            "hidden": false
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
            "hidden": false
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
            "hidden": false
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
            "hidden": false
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
            "hidden": false
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
            "hidden": false
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
                }
            ]
        },
        {
            "name": "FieldGroupOutside",
            "description": "FieldGroupOutside",
            "dataType": "TEXT",
            "dataProviderUserRole": "Agent",
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
    "attributeDefinitions": [
        {
            "name": "GroupOne",
            "description": "GroupOne",
            "externalId": "",
            "type": "GROUP_FIELD",
            "active": true,
            "attributes": [
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
                    "hidden": false
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


