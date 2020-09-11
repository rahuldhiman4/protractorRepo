export const AGENT_ORIGIN = {
    "name": "com.bmc.dsm.case-lib:",
    "guid": "rx-d4667fda-ac70-4212-9dac-9cc90d008862",
    "description": null,
    "runAsUser": false,
    "isEnabled": true,
    "inputParams": [
        {
            "resourceType": "com.bmc.arsys.rx.standardlib.record.CharacterFieldDefinition",
            "name": "Operation",
            "tags": null,
            "description": "",
            "overlayGroupId": null,
            "developerId": null,
            "internal": false,
            "id": 450000151,
            "permissions": null,
            "fieldTypeName": "com.bmc.arsys.rx.services.record.domain.DefaultFieldType",
            "isInherited": false,
            "explicitPermissions": null,
            "overlayDescriptor": null,
            "fieldMapping": null,
            "allowPermissionsOverlay": true,
            "allowOtherPropertiesOverlay": true,
            "auditOption": null,
            "maxLength": 0,
            "defaultValue": null,
            "searchDefinition": null,
            "namedListDefinition": null,
            "shouldPersistEncrypted": false,
            "shouldPersistHashed": false,
            "associationGuid": null,
            "anyUserAllowedToSubmit": false,
            "fieldOption": "OPTIONAL"
        },
        {
            "resourceType": "com.bmc.arsys.rx.services.process.domain.record.RecordInstanceFieldDefinition",
            "name": "Case Record",
            "tags": null,
            "description": "",
            "overlayGroupId": null,
            "developerId": null,
            "internal": false,
            "id": 57370,
            "permissions": null,
            "fieldTypeName": "com.bmc.arsys.rx.services.process.domain.record.RecordInstanceFieldType",
            "isInherited": false,
            "explicitPermissions": null,
            "overlayDescriptor": null,
            "fieldMapping": null,
            "allowPermissionsOverlay": true,
            "allowOtherPropertiesOverlay": true,
            "auditOption": null,
            "recordDefinitionName": "com.bmc.dsm.case-lib:Case",
            "useSampleData": false,
            "anyUserAllowedToSubmit": false,
            "fieldOption": "REQUIRED"
        },
        {
            "resourceType": "com.bmc.arsys.rx.services.process.domain.record.RecordInstanceFieldDefinition",
            "name": "Previous Case Record",
            "tags": null,
            "description": "",
            "overlayGroupId": null,
            "developerId": null,
            "internal": false,
            "id": 450000152,
            "permissions": null,
            "fieldTypeName": "com.bmc.arsys.rx.services.process.domain.record.RecordInstanceFieldType",
            "isInherited": false,
            "explicitPermissions": null,
            "overlayDescriptor": null,
            "fieldMapping": null,
            "allowPermissionsOverlay": true,
            "allowOtherPropertiesOverlay": true,
            "auditOption": null,
            "recordDefinitionName": "com.bmc.dsm.case-lib:Case",
            "useSampleData": false,
            "anyUserAllowedToSubmit": false,
            "fieldOption": "OPTIONAL"
        }
    ],
    "flowElements": [
        {
            "resourceType": "com.bmc.arsys.rx.services.process.domain.EndEventDefinition",
            "name": "End",
            "tags": null,
            "description": null,
            "overlayGroupId": null,
            "developerId": null,
            "internal": false,
            "guid": "rx-6b6b4782-6d85-45fe-83d7-230388493eaa",
            "event": null
        },
        {
            "resourceType": "com.bmc.arsys.rx.services.process.domain.ExclusiveGatewayDefinition",
            "name": "Exclusive Gateway",
            "tags": null,
            "description": null,
            "overlayGroupId": null,
            "developerId": null,
            "internal": false,
            "guid": "rx-e96bccdd-6b9b-4e50-8ab6-a5a2d688b53e"
        },
        {
            "resourceType": "com.bmc.arsys.rx.services.process.domain.StartEventDefinition",
            "name": "Start",
            "tags": null,
            "description": null,
            "overlayGroupId": null,
            "developerId": null,
            "internal": false,
            "guid": "rx-00343ece-01fc-4305-8e0c-f913de04631d"
        },
        {
            "resourceType": "com.bmc.arsys.rx.services.process.domain.SequenceFlowDefinition",
            "name": "Sequence Flow",
            "tags": null,
            "description": null,
            "overlayGroupId": null,
            "developerId": null,
            "internal": false,
            "guid": "rx-13c1e1ae-2432-4820-9a20-9933841e47a4",
            "sourceNode": "rx-00343ece-01fc-4305-8e0c-f913de04631d",
            "targetNode": "rx-e96bccdd-6b9b-4e50-8ab6-a5a2d688b53e",
            "condition": ""
        },
        {
            "resourceType": "com.bmc.arsys.rx.services.process.domain.ServiceTaskDefinition",
            "name": "Update Record",
            "description": "",
            "runAsUser": "null",
            "actionTypeName": "updateRecord",
            "inputMap": [
                {
                    "assignTarget": "record",
                    "expression": "${processContext.Case Record}"
                },
                {
                    "assignTarget": "values[\"Priority\"]",
                    "expression": "\"Low\""
                }
            ],
            "multiInstanceLoopDefinition": null,
            "guid": "rx-ecdbeeab-e3ca-4059-88fd-feca4ef1bfdf"
        },
        {
            "resourceType": "com.bmc.arsys.rx.services.process.domain.SequenceFlowDefinition",
            "name": "Sequence Flow",
            "description": "",
            "sourceNode": "rx-e96bccdd-6b9b-4e50-8ab6-a5a2d688b53e",
            "targetNode": "rx-ecdbeeab-e3ca-4059-88fd-feca4ef1bfdf",
            "condition": "${processContext.Case Record.304411211} = \"Agent\"",
            "guid": "rx-ab08dc4e-75e6-460c-a90b-2dd264b42129"
        },
        {
            "resourceType": "com.bmc.arsys.rx.services.process.domain.SequenceFlowDefinition",
            "name": "Sequence Flow",
            "description": "",
            "sourceNode": "rx-ecdbeeab-e3ca-4059-88fd-feca4ef1bfdf",
            "guid": "rx-e505fd0a-e727-4e8e-891b-84d160ed9889",
            "targetNode": "rx-6b6b4782-6d85-45fe-83d7-230388493eaa"
        },
        {
            "resourceType": "com.bmc.arsys.rx.services.process.domain.SequenceFlowDefinition",
            "name": "Sequence Flow",
            "description": "",
            "sourceNode": "rx-e96bccdd-6b9b-4e50-8ab6-a5a2d688b53e",
            "guid": "rx-9d927443-ff05-4381-9177-eedbb5b5b2bd",
            "targetNode": "rx-6b6b4782-6d85-45fe-83d7-230388493eaa",
            "condition": ""
        }
    ],
    "layout": "{\"cells\":[{\"id\":\"6b6b4782-6d85-45fe-83d7-230388493eaa\",\"position\":{\"x\":935,\"y\":275},\"size\":{\"width\":30,\"height\":30},\"type\":\"rx.EndEvent\",\"z\":868,\"attrs\":{\".label\":{\"text\":\"\"}}},{\"id\":\"e96bccdd-6b9b-4e50-8ab6-a5a2d688b53e\",\"position\":{\"x\":230,\"y\":270},\"size\":{\"width\":40,\"height\":40},\"type\":\"rx.ExclusiveGateway\",\"z\":874,\"attrs\":{\".label\":{\"text\":\"\"}}},{\"id\":\"00343ece-01fc-4305-8e0c-f913de04631d\",\"position\":{\"x\":50,\"y\":275},\"size\":{\"width\":30,\"height\":30},\"type\":\"rx.StartEvent\",\"z\":866,\"attrs\":{\".label\":{\"text\":\"\"}}},{\"flowType\":\"normal\",\"id\":\"13c1e1ae-2432-4820-9a20-9933841e47a4\",\"labels\":[{\"attrs\":{\"text\":{\"text\":\"\"}},\"position\":\"0.5\"}],\"source\":{\"id\":\"00343ece-01fc-4305-8e0c-f913de04631d\"},\"target\":{\"id\":\"e96bccdd-6b9b-4e50-8ab6-a5a2d688b53e\"},\"type\":\"rx.SequenceFlow\",\"z\":875},{\"content\":\"Update Record\",\"id\":\"ecdbeeab-e3ca-4059-88fd-feca4ef1bfdf\",\"position\":{\"x\":525,\"y\":190},\"size\":{\"width\":90,\"height\":60},\"type\":\"rx.ProcessActions.updateRecord\",\"z\":885},{\"flowType\":\"conditional\",\"id\":\"ab08dc4e-75e6-460c-a90b-2dd264b42129\",\"labels\":[{\"attrs\":{\"text\":{\"text\":\"\"}},\"position\":\"0.5\"}],\"source\":{\"id\":\"e96bccdd-6b9b-4e50-8ab6-a5a2d688b53e\"},\"target\":{\"id\":\"ecdbeeab-e3ca-4059-88fd-feca4ef1bfdf\"},\"type\":\"rx.SequenceFlow\",\"z\":886},{\"flowType\":\"normal\",\"id\":\"e505fd0a-e727-4e8e-891b-84d160ed9889\",\"labels\":[{\"attrs\":{\"text\":{\"text\":\"\"}},\"position\":\"0.5\"}],\"source\":{\"id\":\"ecdbeeab-e3ca-4059-88fd-feca4ef1bfdf\"},\"target\":{\"id\":\"6b6b4782-6d85-45fe-83d7-230388493eaa\"},\"type\":\"rx.SequenceFlow\",\"z\":886},{\"flowType\":\"default\",\"id\":\"9d927443-ff05-4381-9177-eedbb5b5b2bd\",\"labels\":[{\"attrs\":{\"text\":{\"text\":\"\"}},\"position\":\"0.5\"}],\"source\":{\"id\":\"e96bccdd-6b9b-4e50-8ab6-a5a2d688b53e\"},\"target\":{\"id\":\"6b6b4782-6d85-45fe-83d7-230388493eaa\"},\"type\":\"rx.SequenceFlow\",\"z\":884},{\"content\":\"Objective: This Process is used to initialize fields with certain values. This is the first process that gets triggered as part of Create/Update Operation.\\n\\nInput Parameters:\\nCaseRecord - Case Record Instance Variable.\\nOperation - Helps to decide whether to execute logic on CREATE OR UPDATE of the case.\\nValues to be checked are CREATE or SET.\\nPrevious Case Record: This is the DB value.\\n\",\"id\":\"e94120de-7238-47ac-87f4-3f5b1f641487\",\"position\":{\"x\":60,\"y\":45},\"size\":{\"width\":845,\"height\":160},\"type\":\"rx.TextAnnotation\",\"z\":872}]}",
    "allowOverlay": false,
    "scope": "PUBLIC",
    "tags": null,
    "contextKeyParam": "Case Record"
};

export const EMAIL_ORIGIN = {
    "name": "com.bmc.dsm.case-lib:",
    "guid": "rx-d4667fda-ac70-4212-9dac-9cc90d008862",
    "description": null,
    "runAsUser": false,
    "isEnabled": true,
    "inputParams": [
        {
            "resourceType": "com.bmc.arsys.rx.standardlib.record.CharacterFieldDefinition",
            "name": "Operation",
            "tags": null,
            "description": "",
            "overlayGroupId": null,
            "developerId": null,
            "internal": false,
            "id": 450000151,
            "permissions": null,
            "fieldTypeName": "com.bmc.arsys.rx.services.record.domain.DefaultFieldType",
            "isInherited": false,
            "explicitPermissions": null,
            "overlayDescriptor": null,
            "fieldMapping": null,
            "allowPermissionsOverlay": true,
            "allowOtherPropertiesOverlay": true,
            "auditOption": null,
            "maxLength": 0,
            "defaultValue": null,
            "searchDefinition": null,
            "namedListDefinition": null,
            "shouldPersistEncrypted": false,
            "shouldPersistHashed": false,
            "associationGuid": null,
            "anyUserAllowedToSubmit": false,
            "fieldOption": "OPTIONAL"
        },
        {
            "resourceType": "com.bmc.arsys.rx.services.process.domain.record.RecordInstanceFieldDefinition",
            "name": "Case Record",
            "tags": null,
            "description": "",
            "overlayGroupId": null,
            "developerId": null,
            "internal": false,
            "id": 57370,
            "permissions": null,
            "fieldTypeName": "com.bmc.arsys.rx.services.process.domain.record.RecordInstanceFieldType",
            "isInherited": false,
            "explicitPermissions": null,
            "overlayDescriptor": null,
            "fieldMapping": null,
            "allowPermissionsOverlay": true,
            "allowOtherPropertiesOverlay": true,
            "auditOption": null,
            "recordDefinitionName": "com.bmc.dsm.case-lib:Case",
            "useSampleData": false,
            "anyUserAllowedToSubmit": false,
            "fieldOption": "REQUIRED"
        },
        {
            "resourceType": "com.bmc.arsys.rx.services.process.domain.record.RecordInstanceFieldDefinition",
            "name": "Previous Case Record",
            "tags": null,
            "description": "",
            "overlayGroupId": null,
            "developerId": null,
            "internal": false,
            "id": 450000152,
            "permissions": null,
            "fieldTypeName": "com.bmc.arsys.rx.services.process.domain.record.RecordInstanceFieldType",
            "isInherited": false,
            "explicitPermissions": null,
            "overlayDescriptor": null,
            "fieldMapping": null,
            "allowPermissionsOverlay": true,
            "allowOtherPropertiesOverlay": true,
            "auditOption": null,
            "recordDefinitionName": "com.bmc.dsm.case-lib:Case",
            "useSampleData": false,
            "anyUserAllowedToSubmit": false,
            "fieldOption": "OPTIONAL"
        }
    ],
    "flowElements": [
        {
            "resourceType": "com.bmc.arsys.rx.services.process.domain.EndEventDefinition",
            "name": "End",
            "tags": null,
            "description": null,
            "overlayGroupId": null,
            "developerId": null,
            "internal": false,
            "guid": "rx-6b6b4782-6d85-45fe-83d7-230388493eaa",
            "event": null
        },
        {
            "resourceType": "com.bmc.arsys.rx.services.process.domain.ExclusiveGatewayDefinition",
            "name": "Exclusive Gateway",
            "tags": null,
            "description": null,
            "overlayGroupId": null,
            "developerId": null,
            "internal": false,
            "guid": "rx-e96bccdd-6b9b-4e50-8ab6-a5a2d688b53e"
        },
        {
            "resourceType": "com.bmc.arsys.rx.services.process.domain.StartEventDefinition",
            "name": "Start",
            "tags": null,
            "description": null,
            "overlayGroupId": null,
            "developerId": null,
            "internal": false,
            "guid": "rx-00343ece-01fc-4305-8e0c-f913de04631d"
        },
        {
            "resourceType": "com.bmc.arsys.rx.services.process.domain.SequenceFlowDefinition",
            "name": "Sequence Flow",
            "tags": null,
            "description": null,
            "overlayGroupId": null,
            "developerId": null,
            "internal": false,
            "guid": "rx-13c1e1ae-2432-4820-9a20-9933841e47a4",
            "sourceNode": "rx-00343ece-01fc-4305-8e0c-f913de04631d",
            "targetNode": "rx-e96bccdd-6b9b-4e50-8ab6-a5a2d688b53e",
            "condition": ""
        },
        {
            "resourceType": "com.bmc.arsys.rx.services.process.domain.ServiceTaskDefinition",
            "name": "Update Record",
            "description": "",
            "runAsUser": "null",
            "actionTypeName": "updateRecord",
            "inputMap": [
                {
                    "assignTarget": "record",
                    "expression": "${processContext.Case Record}"
                },
                {
                    "assignTarget": "values[\"Priority\"]",
                    "expression": "\"Critical\""
                }
            ],
            "multiInstanceLoopDefinition": null,
            "guid": "rx-ecdbeeab-e3ca-4059-88fd-feca4ef1bfdf"
        },
        {
            "resourceType": "com.bmc.arsys.rx.services.process.domain.SequenceFlowDefinition",
            "name": "Sequence Flow",
            "description": "",
            "sourceNode": "rx-e96bccdd-6b9b-4e50-8ab6-a5a2d688b53e",
            "targetNode": "rx-ecdbeeab-e3ca-4059-88fd-feca4ef1bfdf",
            "condition": "${processContext.Case Record.304411211} = \"Email\"",
            "guid": "rx-ab08dc4e-75e6-460c-a90b-2dd264b42129"
        },
        {
            "resourceType": "com.bmc.arsys.rx.services.process.domain.SequenceFlowDefinition",
            "name": "Sequence Flow",
            "description": "",
            "sourceNode": "rx-ecdbeeab-e3ca-4059-88fd-feca4ef1bfdf",
            "guid": "rx-e505fd0a-e727-4e8e-891b-84d160ed9889",
            "targetNode": "rx-6b6b4782-6d85-45fe-83d7-230388493eaa"
        },
        {
            "resourceType": "com.bmc.arsys.rx.services.process.domain.SequenceFlowDefinition",
            "name": "Sequence Flow",
            "description": "",
            "sourceNode": "rx-e96bccdd-6b9b-4e50-8ab6-a5a2d688b53e",
            "guid": "rx-9d927443-ff05-4381-9177-eedbb5b5b2bd",
            "targetNode": "rx-6b6b4782-6d85-45fe-83d7-230388493eaa",
            "condition": ""
        }
    ],
    "layout": "{\"cells\":[{\"id\":\"6b6b4782-6d85-45fe-83d7-230388493eaa\",\"position\":{\"x\":935,\"y\":275},\"size\":{\"width\":30,\"height\":30},\"type\":\"rx.EndEvent\",\"z\":868,\"attrs\":{\".label\":{\"text\":\"\"}}},{\"id\":\"e96bccdd-6b9b-4e50-8ab6-a5a2d688b53e\",\"position\":{\"x\":230,\"y\":270},\"size\":{\"width\":40,\"height\":40},\"type\":\"rx.ExclusiveGateway\",\"z\":874,\"attrs\":{\".label\":{\"text\":\"\"}}},{\"id\":\"00343ece-01fc-4305-8e0c-f913de04631d\",\"position\":{\"x\":50,\"y\":275},\"size\":{\"width\":30,\"height\":30},\"type\":\"rx.StartEvent\",\"z\":866,\"attrs\":{\".label\":{\"text\":\"\"}}},{\"flowType\":\"normal\",\"id\":\"13c1e1ae-2432-4820-9a20-9933841e47a4\",\"labels\":[{\"attrs\":{\"text\":{\"text\":\"\"}},\"position\":\"0.5\"}],\"source\":{\"id\":\"00343ece-01fc-4305-8e0c-f913de04631d\"},\"target\":{\"id\":\"e96bccdd-6b9b-4e50-8ab6-a5a2d688b53e\"},\"type\":\"rx.SequenceFlow\",\"z\":875},{\"content\":\"Update Record\",\"id\":\"ecdbeeab-e3ca-4059-88fd-feca4ef1bfdf\",\"position\":{\"x\":525,\"y\":190},\"size\":{\"width\":90,\"height\":60},\"type\":\"rx.ProcessActions.updateRecord\",\"z\":885},{\"flowType\":\"conditional\",\"id\":\"ab08dc4e-75e6-460c-a90b-2dd264b42129\",\"labels\":[{\"attrs\":{\"text\":{\"text\":\"\"}},\"position\":\"0.5\"}],\"source\":{\"id\":\"e96bccdd-6b9b-4e50-8ab6-a5a2d688b53e\"},\"target\":{\"id\":\"ecdbeeab-e3ca-4059-88fd-feca4ef1bfdf\"},\"type\":\"rx.SequenceFlow\",\"z\":886},{\"flowType\":\"normal\",\"id\":\"e505fd0a-e727-4e8e-891b-84d160ed9889\",\"labels\":[{\"attrs\":{\"text\":{\"text\":\"\"}},\"position\":\"0.5\"}],\"source\":{\"id\":\"ecdbeeab-e3ca-4059-88fd-feca4ef1bfdf\"},\"target\":{\"id\":\"6b6b4782-6d85-45fe-83d7-230388493eaa\"},\"type\":\"rx.SequenceFlow\",\"z\":886},{\"flowType\":\"default\",\"id\":\"9d927443-ff05-4381-9177-eedbb5b5b2bd\",\"labels\":[{\"attrs\":{\"text\":{\"text\":\"\"}},\"position\":\"0.5\"}],\"source\":{\"id\":\"e96bccdd-6b9b-4e50-8ab6-a5a2d688b53e\"},\"target\":{\"id\":\"6b6b4782-6d85-45fe-83d7-230388493eaa\"},\"type\":\"rx.SequenceFlow\",\"z\":884},{\"content\":\"Objective: This Process is used to initialize fields with certain values. This is the first process that gets triggered as part of Create/Update Operation.\\n\\nInput Parameters:\\nCaseRecord - Case Record Instance Variable.\\nOperation - Helps to decide whether to execute logic on CREATE OR UPDATE of the case.\\nValues to be checked are CREATE or SET.\\nPrevious Case Record: This is the DB value.\\n\",\"id\":\"e94120de-7238-47ac-87f4-3f5b1f641487\",\"position\":{\"x\":60,\"y\":45},\"size\":{\"width\":845,\"height\":160},\"type\":\"rx.TextAnnotation\",\"z\":872}]}",
    "allowOverlay": false,
    "scope": "PUBLIC",
    "tags": null,
    "contextKeyParam": "Case Record"
};

export const SOCIAL_ACTIVITY_FEED = {
    "name": "com.bmc.dsm.social-lib:",
    "guid": "rx-c73080b4-2ca0-4ac8-9f36-edc996383691",
    "description": "Sample process for User Activity Feed.  Pls copy this process to get the process inputs and the construct your own process",
    "runAsUser": false,
    "isEnabled": true,
    "inputParams": [
        {
            "resourceType": "com.bmc.arsys.rx.services.process.domain.record.RecordInstanceFieldDefinition",
            "name": "SocialPost",
            "tags": null,
            "description": "",
            "overlayGroupId": null,
            "developerId": null,
            "internal": false,
            "id": 536870912,
            "permissions": null,
            "fieldTypeName": "com.bmc.arsys.rx.services.process.domain.record.RecordInstanceFieldType",
            "isInherited": false,
            "explicitPermissions": null,
            "overlayDescriptor": null,
            "fieldMapping": null,
            "allowPermissionsOverlay": true,
            "allowOtherPropertiesOverlay": true,
            "auditOption": null,
            "recordDefinitionName": "com.bmc.dsm.social-lib:SCL_Posts",
            "useSampleData": false,
            "anyUserAllowedToSubmit": false,
            "fieldOption": "OPTIONAL"
        }
    ],
    "outputParams": [

    ],
    "flowElements": [
        {
            "resourceType": "com.bmc.arsys.rx.services.process.domain.CallActivityDefinition",
            "name": "Call Activity",
            "tags": null,
            "description": "",
            "overlayGroupId": null,
            "developerId": null,
            "internal": false,
            "guid": "rx-819bca68-236a-41b4-95cd-2b4cdb4e6105",
            "multiInstanceLoopDefinition": null,
            "calledProcessDefinitionName": "${activityResults.rx-ef7e2d49-a529-413a-93d2-4a9fcb592056.output.450000002}",
            "sampleProcessDefinitionName": "com.bmc.dsm.social-lib:Social - Sample Activity Update By User",
            "inputMap": [
                {
                    "assignTarget": "Origin",
                    "expression": "${processContext.SocialPost.Post_Type}"
                },
                {
                    "assignTarget": "isPublic",
                    "expression": "${activityResults.rx-3f1d0793-e624-41dd-8b9b-7ba0504f094b.output.isPublic}"
                },
                {
                    "assignTarget": "AuthorPersonID",
                    "expression": "${activityResults.rx-ea4a6ba1-a1a2-4eda-ae1a-01dba870bdd1.output[0].ID}"
                },
                {
                    "assignTarget": "CompanyId",
                    "expression": "${activityResults.rx-ef7e2d49-a529-413a-93d2-4a9fcb592056.output.Company}"
                },
                {
                    "assignTarget": "TicketID",
                    "expression": "${activityResults.rx-ea4a6ba1-a1a2-4eda-ae1a-01dba870bdd1.output[0].ID}"
                },
                {
                    "assignTarget": "postDetails",
                    "expression": "${activityResults.rx-3f1d0793-e624-41dd-8b9b-7ba0504f094b.output.postDetails}"
                },
                {
                    "assignTarget": "attachmentGroupID",
                    "expression": "${processContext.SocialPost.Attachment Group Id}"
                },
                {
                    "assignTarget": "TicketDisplayID",
                    "expression": "${activityResults.rx-ef7e2d49-a529-413a-93d2-4a9fcb592056.output.Display ID}"
                }
            ],
            "outputMap": [

            ]
        },
        {
            "resourceType": "com.bmc.arsys.rx.services.process.domain.StartEventDefinition",
            "name": "Start",
            "tags": null,
            "description": null,
            "overlayGroupId": null,
            "developerId": null,
            "internal": false,
            "guid": "rx-99532f5f-111b-447c-ba82-1dddf76b18fe"
        },
        {
            "resourceType": "com.bmc.arsys.rx.services.process.domain.SequenceFlowDefinition",
            "name": "Sequence Flow",
            "tags": null,
            "description": "",
            "overlayGroupId": null,
            "developerId": null,
            "internal": false,
            "guid": "rx-5e76d14f-a117-400e-9b40-d9d844f627dd",
            "sourceNode": "rx-b1b44014-9351-4832-86d0-49217601bcd1",
            "targetNode": "rx-ea4a6ba1-a1a2-4eda-ae1a-01dba870bdd1",
            "condition": "${processContext.SocialPost.Social_Type} = \"Case\""
        },
        {
            "resourceType": "com.bmc.arsys.rx.services.process.domain.SequenceFlowDefinition",
            "name": "Sequence Flow",
            "tags": null,
            "description": "",
            "overlayGroupId": null,
            "developerId": null,
            "internal": false,
            "guid": "rx-00242930-0e1e-4616-9529-af6f4b02a2c0",
            "sourceNode": "rx-819bca68-236a-41b4-95cd-2b4cdb4e6105",
            "targetNode": "rx-fb0f632b-a61b-4920-b96d-99a694735410",
            "condition": ""
        },
        {
            "resourceType": "com.bmc.arsys.rx.services.process.domain.EndEventDefinition",
            "name": "End",
            "tags": null,
            "description": null,
            "overlayGroupId": null,
            "developerId": null,
            "internal": false,
            "guid": "rx-fb0f632b-a61b-4920-b96d-99a694735410",
            "event": null
        },
        {
            "resourceType": "com.bmc.arsys.rx.services.process.domain.SequenceFlowDefinition",
            "name": "Sequence Flow",
            "tags": null,
            "description": "",
            "overlayGroupId": null,
            "developerId": null,
            "internal": false,
            "guid": "rx-0c68eb43-ee28-4958-977b-7a864b9cc87b",
            "sourceNode": "rx-b1b44014-9351-4832-86d0-49217601bcd1",
            "targetNode": "rx-fb0f632b-a61b-4920-b96d-99a694735410",
            "condition": ""
        },
        {
            "resourceType": "com.bmc.arsys.rx.services.process.domain.SequenceFlowDefinition",
            "name": "Sequence Flow",
            "tags": null,
            "description": "",
            "overlayGroupId": null,
            "developerId": null,
            "internal": false,
            "guid": "rx-915287f6-3e4a-4af2-abe2-5ee6780f6094",
            "sourceNode": "rx-ea4a6ba1-a1a2-4eda-ae1a-01dba870bdd1",
            "targetNode": "rx-ef7e2d49-a529-413a-93d2-4a9fcb592056",
            "condition": ""
        },
        {
            "resourceType": "com.bmc.arsys.rx.services.process.domain.SequenceFlowDefinition",
            "name": "Sequence Flow",
            "tags": null,
            "description": "",
            "overlayGroupId": null,
            "developerId": null,
            "internal": false,
            "guid": "rx-57715025-ac78-4039-8e71-4d4be776d7eb",
            "sourceNode": "rx-3f1d0793-e624-41dd-8b9b-7ba0504f094b",
            "targetNode": "rx-819bca68-236a-41b4-95cd-2b4cdb4e6105",
            "condition": ""
        },
        {
            "resourceType": "com.bmc.arsys.rx.services.process.domain.ServiceTaskDefinition",
            "name": "Build Social Post Entity",
            "tags": null,
            "description": "",
            "overlayGroupId": null,
            "developerId": null,
            "internal": false,
            "guid": "rx-3f1d0793-e624-41dd-8b9b-7ba0504f094b",
            "multiInstanceLoopDefinition": null,
            "actionTypeName": "com.bmc.dsm.social-lib:buildSocialPostEntity",
            "inputMap": [
                {
                    "assignTarget": "socialPostRecordInstance",
                    "expression": "${processContext.SocialPost}"
                }
            ],
            "outputMap": [

            ],
            "runAsUser": null
        },
        {
            "resourceType": "com.bmc.arsys.rx.services.process.domain.SequenceFlowDefinition",
            "name": "Sequence Flow",
            "tags": null,
            "description": "",
            "overlayGroupId": null,
            "developerId": null,
            "internal": false,
            "guid": "rx-d6117e28-d36f-49ee-b05e-b63d23cc1583",
            "sourceNode": "rx-ef7e2d49-a529-413a-93d2-4a9fcb592056",
            "targetNode": "rx-3f1d0793-e624-41dd-8b9b-7ba0504f094b",
            "condition": ""
        },
        {
            "resourceType": "com.bmc.arsys.rx.services.process.domain.SequenceFlowDefinition",
            "name": "Sequence Flow",
            "tags": null,
            "description": "",
            "overlayGroupId": null,
            "developerId": null,
            "internal": false,
            "guid": "rx-b9131d53-ffae-4c42-a546-ab62a6b476b1",
            "sourceNode": "rx-99532f5f-111b-447c-ba82-1dddf76b18fe",
            "targetNode": "rx-b1b44014-9351-4832-86d0-49217601bcd1",
            "condition": ""
        },
        {
            "resourceType": "com.bmc.arsys.rx.services.process.domain.ServiceTaskDefinition",
            "name": "Get Process",
            "tags": null,
            "description": "",
            "overlayGroupId": null,
            "developerId": null,
            "internal": false,
            "guid": "rx-ef7e2d49-a529-413a-93d2-4a9fcb592056",
            "multiInstanceLoopDefinition": null,
            "actionTypeName": "getRecord",
            "inputMap": [
                {
                    "assignTarget": "recordDefinitionName",
                    "expression": "\"com.bmc.dsm.flowsets-lib:Process Library\""
                },
                {
                    "assignTarget": "recordID",
                    "expression": "${activityResults.rx-ef7e2d49-a529-413a-93d2-4a9fcb592056.output.Process Name}"
                }
            ],
            "outputMap": [

            ],
            "runAsUser": null
        },
        {
            "resourceType": "com.bmc.arsys.rx.services.process.domain.ServiceTaskDefinition",
            "name": "Get Records By Query",
            "tags": null,
            "description": "",
            "overlayGroupId": null,
            "developerId": null,
            "internal": false,
            "guid": "rx-ea4a6ba1-a1a2-4eda-ae1a-01dba870bdd1",
            "multiInstanceLoopDefinition": null,
            "actionTypeName": "getRecordsByQuery",
            "inputMap": [
                {
                    "assignTarget": "queryExpression",
                    "expression": "'ID' = ${processContext.SocialPost.Parent_GUID}"
                },
                {
                    "assignTarget": "retrieve",
                    "expression": "0"
                },
                {
                    "assignTarget": "recordDefinitionName",
                    "expression": "\"com.bmc.dsm.case-lib:Case\""
                }
            ],
            "outputMap": [

            ],
            "runAsUser": null
        },
        {
            "resourceType": "com.bmc.arsys.rx.services.process.domain.ExclusiveGatewayDefinition",
            "name": "Exclusive Gateway",
            "tags": null,
            "description": "",
            "overlayGroupId": null,
            "developerId": null,
            "internal": false,
            "guid": "rx-b1b44014-9351-4832-86d0-49217601bcd1"
        }
    ],
    "artifacts": [
        {
            "resourceType": "com.bmc.arsys.rx.services.process.domain.TextAnnotation",
            "guid": "rx-a427da6f-85b4-4b6f-b389-055414d538f3",
            "text": "Objective: This Process is used to add custom logic whenever a new social post gets added \nby a user to the case.  The social post can get added via email, agent or DWP and the same is identified by the Origin parameter in the process.\n\n\nInput Parameters:\n1.\tOrigin ( 450000151): Identifies the Source of the post and can have one of the 3 values: \n       \"10\": \"Agent\",\n        \"20\": \"Email\",\n        \"30\": \"Digital Workplace\"\n2.\tisPublic(450000154): True or False depending on whether it is a public post or not. A post involving requester is a public post\n3.\tAuthorPersonID (450000155): Person Id of the person responsible for the social post\n4.\tCompanyId (450000152): Company ID of the case for which the post is being added\n5.\tTicketID (450000153): Case ID of the case for which the social comment was posted\n6.\tpostDetails (450000158); Post details of the actual social post\n7.\tattachmentGroupID (450000159): Reference Id of the attachments in case the social post contains the attachment\n8.\tAuthorEmailID (450000156): Email ID of the author\n9.\tTicketDisplayID ( 450000157) Case Display ID – the one we see in UI CASE-00012121 etc)\n\n"
        }
    ],
    "localVariables": [

    ],
    "localizableStrings": {

    },
    "layout": "{\"cells\":[{\"collapsedSize\":{\"width\":90,\"height\":60},\"content\":\"Call Activity\",\"expanded\":false,\"id\":\"819bca68-236a-41b4-95cd-2b4cdb4e6105\",\"position\":{\"x\":685,\"y\":430},\"size\":{\"width\":90,\"height\":60},\"type\":\"rx.CallActivity\",\"z\":67},{\"id\":\"99532f5f-111b-447c-ba82-1dddf76b18fe\",\"position\":{\"x\":40,\"y\":565},\"size\":{\"width\":30,\"height\":30},\"type\":\"rx.StartEvent\",\"z\":47,\"attrs\":{\".label\":{\"text\":\"\"}}},{\"flowType\":\"conditional\",\"id\":\"5e76d14f-a117-400e-9b40-d9d844f627dd\",\"labels\":[{\"attrs\":{\"text\":{\"text\":\"\"}},\"position\":\"0.5\"}],\"source\":{\"id\":\"b1b44014-9351-4832-86d0-49217601bcd1\"},\"target\":{\"id\":\"ea4a6ba1-a1a2-4eda-ae1a-01dba870bdd1\"},\"type\":\"rx.SequenceFlow\",\"z\":62},{\"flowType\":\"normal\",\"id\":\"00242930-0e1e-4616-9529-af6f4b02a2c0\",\"labels\":[{\"attrs\":{\"text\":{\"text\":\"\"}},\"position\":\"0.5\"}],\"source\":{\"id\":\"819bca68-236a-41b4-95cd-2b4cdb4e6105\"},\"target\":{\"id\":\"fb0f632b-a61b-4920-b96d-99a694735410\"},\"type\":\"rx.SequenceFlow\",\"z\":69},{\"id\":\"fb0f632b-a61b-4920-b96d-99a694735410\",\"position\":{\"x\":845,\"y\":565},\"size\":{\"width\":30,\"height\":30},\"type\":\"rx.EndEvent\",\"z\":37,\"attrs\":{\".label\":{\"text\":\"\"}}},{\"flowType\":\"default\",\"id\":\"0c68eb43-ee28-4958-977b-7a864b9cc87b\",\"labels\":[{\"attrs\":{\"text\":{\"text\":\"\"}},\"position\":\"0.5\"}],\"source\":{\"id\":\"b1b44014-9351-4832-86d0-49217601bcd1\"},\"target\":{\"id\":\"fb0f632b-a61b-4920-b96d-99a694735410\"},\"type\":\"rx.SequenceFlow\",\"z\":50},{\"flowType\":\"normal\",\"id\":\"915287f6-3e4a-4af2-abe2-5ee6780f6094\",\"labels\":[{\"attrs\":{\"text\":{\"text\":\"\"}},\"position\":\"0.5\"}],\"source\":{\"id\":\"ea4a6ba1-a1a2-4eda-ae1a-01dba870bdd1\"},\"target\":{\"id\":\"ef7e2d49-a529-413a-93d2-4a9fcb592056\"},\"type\":\"rx.SequenceFlow\",\"z\":64},{\"flowType\":\"normal\",\"id\":\"57715025-ac78-4039-8e71-4d4be776d7eb\",\"labels\":[{\"attrs\":{\"text\":{\"text\":\"\"}},\"position\":\"0.5\"}],\"source\":{\"id\":\"3f1d0793-e624-41dd-8b9b-7ba0504f094b\"},\"target\":{\"id\":\"819bca68-236a-41b4-95cd-2b4cdb4e6105\"},\"type\":\"rx.SequenceFlow\",\"z\":68},{\"content\":\"Build Social Post Entity\",\"id\":\"3f1d0793-e624-41dd-8b9b-7ba0504f094b\",\"position\":{\"x\":530,\"y\":430},\"size\":{\"width\":90,\"height\":60},\"type\":\"rx.ProcessAction\",\"z\":65},{\"flowType\":\"normal\",\"id\":\"d6117e28-d36f-49ee-b05e-b63d23cc1583\",\"labels\":[{\"attrs\":{\"text\":{\"text\":\"\"}},\"position\":\"0.5\"}],\"source\":{\"id\":\"ef7e2d49-a529-413a-93d2-4a9fcb592056\"},\"target\":{\"id\":\"3f1d0793-e624-41dd-8b9b-7ba0504f094b\"},\"type\":\"rx.SequenceFlow\",\"z\":66},{\"flowType\":\"normal\",\"id\":\"b9131d53-ffae-4c42-a546-ab62a6b476b1\",\"labels\":[{\"attrs\":{\"text\":{\"text\":\"\"}},\"position\":\"0.5\"}],\"source\":{\"id\":\"99532f5f-111b-447c-ba82-1dddf76b18fe\"},\"target\":{\"id\":\"b1b44014-9351-4832-86d0-49217601bcd1\"},\"type\":\"rx.SequenceFlow\",\"z\":50},{\"content\":\"Get Process\",\"id\":\"ef7e2d49-a529-413a-93d2-4a9fcb592056\",\"position\":{\"x\":385,\"y\":430},\"size\":{\"width\":90,\"height\":60},\"type\":\"rx.ProcessActions.getRecord\",\"z\":63},{\"content\":\"Get Records By Query\",\"id\":\"ea4a6ba1-a1a2-4eda-ae1a-01dba870bdd1\",\"position\":{\"x\":235,\"y\":430},\"size\":{\"width\":90,\"height\":60},\"type\":\"rx.ProcessActions.getRecordsByQuery\",\"z\":61},{\"id\":\"b1b44014-9351-4832-86d0-49217601bcd1\",\"position\":{\"x\":150,\"y\":560},\"size\":{\"width\":40,\"height\":40},\"type\":\"rx.ExclusiveGateway\",\"z\":49,\"attrs\":{\".label\":{\"text\":\"\"}}},{\"content\":\"Objective: This Process is used to add custom logic whenever a new social post gets added \\nby a user to the case.  The social post can get added via email, agent or DWP and the same is identified by the Origin parameter in the process.\\n\\n\\nInput Parameters:\\n1.\\tOrigin ( 450000151): Identifies the Source of the post and can have one of the 3 values: \\n       \\\"10\\\": \\\"Agent\\\",\\n        \\\"20\\\": \\\"Email\\\",\\n        \\\"30\\\": \\\"Digital Workplace\\\"\\n2.\\tisPublic(450000154): True or False depending on whether it is a public post or not. A post involving requester is a public post\\n3.\\tAuthorPersonID (450000155): Person Id of the person responsible for the social post\\n4.\\tCompanyId (450000152): Company ID of the case for which the post is being added\\n5.\\tTicketID (450000153): Case ID of the case for which the social comment was posted\\n6.\\tpostDetails (450000158); Post details of the actual social post\\n7.\\tattachmentGroupID (450000159): Reference Id of the attachments in case the social post contains the attachment\\n8.\\tAuthorEmailID (450000156): Email ID of the author\\n9.\\tTicketDisplayID ( 450000157) Case Display ID – the one we see in UI CASE-00012121 etc)\\n\\n\",\"id\":\"a427da6f-85b4-4b6f-b389-055414d538f3\",\"position\":{\"x\":110,\"y\":90},\"size\":{\"width\":765,\"height\":340},\"type\":\"rx.TextAnnotation\",\"z\":32}]}",
    "allowOverlay": false,
    "scope": "PUBLIC",
    "permissions": [
        {
            "ownerId": {
                "value": -74009,
                "type": "ROLE",
                "name": "Social Administrator"
            },
            "type": "READ"
        },
        {
            "ownerId": {
                "value": -71140,
                "type": "ROLE",
                "name": "Social User"
            },
            "type": "READ"
        }
    ],
    "tags": null,
    "contextKeyParam": null
}