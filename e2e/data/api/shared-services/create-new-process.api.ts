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