export const ONE_TASKFLOW = {
    "name": "com.bmc.dsm.case-lib:MyOneTaskProcess",
    "guid": "rx-3b50828e-c651-4fa4-aa0b-e445bc2a0060",
    "description": null,
    "runAsUser": false,
    "isEnabled": true,
    "inputParams": [
        {
            "resourceType": "com.bmc.arsys.rx.services.process.domain.record.ObjectFieldDefinition",
            "name": "DynamicData",
            "tags": null,
            "description": "",
            "overlayGroupId": null,
            "developerId": null,
            "id": 450000151,
            "permissions": null,
            "fieldTypeName": "com.bmc.arsys.rx.services.process.domain.record.ObjectFieldType",
            "isInherited": false,
            "explicitPermissions": null,
            "overlayDescriptor": null,
            "fieldMapping": null,
            "allowPermissionsOverlay": true,
            "allowOtherPropertiesOverlay": true,
            "auditOption": null,
            "documentDefinitionName": "com.bmc.dsm.ticketing-lib:Sample JSON Document",
            "anyUserAllowedToSubmit": false,
            "fieldOption": "OPTIONAL"
        },
        {
            "resourceType": "com.bmc.arsys.rx.services.process.domain.record.RecordInstanceFieldDefinition",
            "name": "CaseRecord",
            "tags": null,
            "description": "",
            "overlayGroupId": null,
            "developerId": null,
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
        },
        {
            "resourceType": "com.bmc.arsys.rx.standardlib.record.CharacterFieldDefinition",
            "name": "CaseId",
            "tags": null,
            "description": "",
            "overlayGroupId": null,
            "developerId": null,
            "id": 450000153,
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
            "identityField": false,
            "fieldOption": "REQUIRED"
        }
    ],
    "outputParams": [],
    "flowElements": [
        {
            "resourceType": "com.bmc.arsys.rx.services.process.domain.SequenceFlowDefinition",
            "name": "Sequence Flow",
            "tags": null,
            "description": "",
            "overlayGroupId": null,
            "developerId": null,
            "guid": "rx-8ed42d89-fab1-44f9-880e-26dec6e6798f",
            "sourceNode": "rx-479bdead-4573-4224-9da8-3682db35d558",
            "targetNode": "rx-794ebe3c-15f9-4630-8c29-863ff6d03251",
            "condition": ""
        },
        {
            "resourceType": "com.bmc.arsys.rx.services.process.domain.EndEventDefinition",
            "name": "End",
            "tags": null,
            "description": null,
            "overlayGroupId": null,
            "developerId": null,
            "guid": "rx-c8f0fd5d-7c59-4ba3-a391-0e50e2097f12",
            "event": null
        },
        {
            "resourceType": "com.bmc.arsys.rx.services.process.domain.CallActivityDefinition",
            "name": "com.bmc.dsm.task-lib:Create Task",
            "tags": null,
            "description": "",
            "overlayGroupId": null,
            "developerId": null,
            "guid": "rx-794ebe3c-15f9-4630-8c29-863ff6d03251",
            "multiInstanceLoopDefinition": null,
            "calledProcessDefinitionName": "com.bmc.dsm.task-lib:Create Task",
            "sampleProcessDefinitionName": "",
            "inputMap": [
                {
                    "assignTarget": "taskSummary",
                    "expression": "\"My one task process\""
                },
                {
                    "assignTarget": "activityId",
                    "expression": "\"rx-c93a929d-432a-4c8f-9639-cb44446217e9\""
                },
                {
                    "assignTarget": "caseId",
                    "expression": "${processContext.CaseId}"
                },
                {
                    "assignTarget": "taskTemplateId",
                    "expression": "\"templateId\""
                }
            ],
            "outputMap": []
        },
        {
            "resourceType": "com.bmc.arsys.rx.services.process.domain.SequenceFlowDefinition",
            "name": "Sequence Flow",
            "tags": null,
            "description": "",
            "overlayGroupId": null,
            "developerId": null,
            "guid": "rx-0230efaa-f997-4712-b13f-d0b889065774",
            "sourceNode": "rx-794ebe3c-15f9-4630-8c29-863ff6d03251",
            "targetNode": "rx-c8f0fd5d-7c59-4ba3-a391-0e50e2097f12",
            "condition": ""
        },
        {
            "resourceType": "com.bmc.arsys.rx.services.process.domain.StartEventDefinition",
            "name": "Start",
            "tags": null,
            "description": null,
            "overlayGroupId": null,
            "developerId": null,
            "guid": "rx-479bdead-4573-4224-9da8-3682db35d558"
        }
    ],
    "artifacts": [],
    "layout": "{\"cells\":[{\"id\":\"479bdead-4573-4224-9da8-3682db35d558\",\"position\":{\"x\":50,\"y\":375},\"size\":{\"width\":30,\"height\":30},\"type\":\"rx.StartEvent\",\"z\":1,\"attrs\":{\".label\":{\"text\":\"\"}}},{\"id\":\"c8f0fd5d-7c59-4ba3-a391-0e50e2097f12\",\"position\":{\"x\":900,\"y\":375},\"size\":{\"width\":30,\"height\":30},\"type\":\"rx.EndEvent\",\"z\":2,\"attrs\":{\".label\":{\"text\":\"\"}}},{\"collapsedSize\":{\"width\":90,\"height\":60},\"content\":\"New Task\",\"expanded\":false,\"id\":\"794ebe3c-15f9-4630-8c29-863ff6d03251\",\"position\":{\"x\":430,\"y\":305},\"size\":{\"width\":90,\"height\":60},\"type\":\"rx.CallActivity\",\"z\":6},{\"flowType\":\"normal\",\"id\":\"8ed42d89-fab1-44f9-880e-26dec6e6798f\",\"labels\":[{\"attrs\":{\"text\":{\"text\":\"\"}},\"position\":\"0.5\"}],\"source\":{\"id\":\"479bdead-4573-4224-9da8-3682db35d558\"},\"target\":{\"id\":\"794ebe3c-15f9-4630-8c29-863ff6d03251\"},\"type\":\"rx.SequenceFlow\",\"z\":7},{\"flowType\":\"normal\",\"id\":\"0230efaa-f997-4712-b13f-d0b889065774\",\"labels\":[{\"attrs\":{\"text\":{\"text\":\"\"}},\"position\":\"0.5\"}],\"source\":{\"id\":\"794ebe3c-15f9-4630-8c29-863ff6d03251\"},\"target\":{\"id\":\"c8f0fd5d-7c59-4ba3-a391-0e50e2097f12\"},\"type\":\"rx.SequenceFlow\",\"z\":8}]}",
    "allowOverlay": false,
    "scope": "BUNDLE",
    "localVariables": [],
    "permissions": [],
    "tags": null,
    "contextKeyParam": null,
    "localizableStrings": {}
};

export const TWO_TASKFLOW_SEQUENTIAL = {
    "name": "com.bmc.dsm.bwfa:SequentialTasks",
    "description": "Case - TaskFlow Sample Process",
    "developerId": "com.bmc.dsm",
    "scope": "PUBLIC",
    "internal": false,
    "guid": "IDGADGG8ECDC0AQ14OTOQ06KZN7427",
    "flowElements": [
        {
            "resourceType": "com.bmc.arsys.rx.services.process.domain.EndEventDefinition",
            "lastUpdateTime": "2020-06-04T14:41:48.929+0000",
            "lastChangedBy": "qkatawazi",
            "owner": "qkatawazi",
            "name": "End",
            "tags": null,
            "description": null,
            "overlayGroupId": null,
            "developerId": null,
            "internal": false,
            "guid": "rx-2d0772ed-34f8-4d6d-85d0-1716c1173a54",
            "event": null
        },
        {
            "resourceType": "com.bmc.arsys.rx.services.process.domain.StartEventDefinition",
            "lastUpdateTime": "2020-06-04T14:41:48.929+0000",
            "lastChangedBy": "qkatawazi",
            "owner": "qkatawazi",
            "name": "Start",
            "tags": null,
            "description": null,
            "overlayGroupId": null,
            "developerId": null,
            "internal": false,
            "guid": "rx-0a8debc5-6f52-4dd0-92f6-9f0596628644"
        },
        {
            "resourceType": "com.bmc.arsys.rx.services.process.domain.CallActivityDefinition",
            "name": "New Task 1",
            "description": null,
            "multiInstanceLoopDefinition": null,
            "calledProcessDefinitionName": "com.bmc.dsm.task-lib:Create Task",
            "inputMap": [
                {
                    "assignTarget": "caseId",
                    "expression": "${processContext.CaseId}"
                },
                {
                    "assignTarget": "taskSummary",
                    "expression": "\"New Task 1\""
                },
                {
                    "assignTarget": "taskTemplateId",
                    "expression": "\"templateId1\""
                },
                {
                    "assignTarget": "activityId",
                    "expression": "\"rx-0ff52ac1-d7db-48bb-a84f-13459d19f6df\""
                }
            ],
            "outputMap": [
                {
                    "assignTarget": "DynamicData",
                    "expression": "${activityResults.rx-0ff52ac1-d7db-48bb-a84f-13459d19f6df.DynamicData}"
                }
            ],
            "guid": "rx-0ff52ac1-d7db-48bb-a84f-13459d19f6df"
        },
        {
            "resourceType": "com.bmc.arsys.rx.services.process.domain.CallActivityDefinition",
            "name": "New Task 2",
            "description": null,
            "multiInstanceLoopDefinition": null,
            "calledProcessDefinitionName": "com.bmc.dsm.task-lib:Create Task",
            "inputMap": [
                {
                    "assignTarget": "caseId",
                    "expression": "${processContext.CaseId}"
                },
                {
                    "assignTarget": "taskSummary",
                    "expression": "\"New Task 2\""
                },
                {
                    "assignTarget": "taskTemplateId",
                    "expression": "\"templateId2\""
                },
                {
                    "assignTarget": "activityId",
                    "expression": "\"rx-f5f09b63-7493-4242-ab57-9c3b5016634f\""
                }
            ],
            "outputMap": [
                {
                    "assignTarget": "DynamicData",
                    "expression": "${activityResults.rx-f5f09b63-7493-4242-ab57-9c3b5016634f.DynamicData}"
                }
            ],
            "guid": "rx-f5f09b63-7493-4242-ab57-9c3b5016634f"
        },
        {
            "resourceType": "com.bmc.arsys.rx.services.process.domain.SequenceFlowDefinition",
            "name": "Sequence Flow",
            "description": "",
            "sourceNode": "rx-0a8debc5-6f52-4dd0-92f6-9f0596628644",
            "guid": "rx-4f8f57ed-9a23-46d6-8792-74d653faa61e",
            "targetNode": "rx-0ff52ac1-d7db-48bb-a84f-13459d19f6df"
        },
        {
            "resourceType": "com.bmc.arsys.rx.services.process.domain.SequenceFlowDefinition",
            "name": "Sequence Flow",
            "description": "",
            "sourceNode": "rx-0ff52ac1-d7db-48bb-a84f-13459d19f6df",
            "guid": "rx-fbe54ab0-62b1-4334-9542-579fe5bc88d7",
            "targetNode": "rx-f5f09b63-7493-4242-ab57-9c3b5016634f"
        },
        {
            "resourceType": "com.bmc.arsys.rx.services.process.domain.SequenceFlowDefinition",
            "name": "Sequence Flow",
            "description": "",
            "sourceNode": "rx-f5f09b63-7493-4242-ab57-9c3b5016634f",
            "guid": "rx-d02b3a4f-8f42-4a6f-909c-e356b332a1e2",
            "targetNode": "rx-2d0772ed-34f8-4d6d-85d0-1716c1173a54"
        }
    ],
    "inputParams": [
        {
            "resourceType": "com.bmc.arsys.rx.services.process.domain.record.ObjectFieldDefinition",
            "lastUpdateTime": "2020-06-04T14:41:48.929+0000",
            "lastChangedBy": "qkatawazi",
            "owner": "dev_girish",
            "name": "DynamicData",
            "tags": null,
            "description": "",
            "overlayGroupId": null,
            "developerId": null,
            "internal": false,
            "id": 450000151,
            "fieldOption": "OPTIONAL",
            "permissions": null,
            "fieldTypeName": "com.bmc.arsys.rx.services.process.domain.record.ObjectFieldType",
            "isInherited": false,
            "explicitPermissions": null,
            "overlayDescriptor": null,
            "fieldMapping": null,
            "allowPermissionsOverlay": true,
            "allowOtherPropertiesOverlay": true,
            "auditOption": null,
            "documentDefinitionName": "com.bmc.dsm.bwfa:Sequ",
            "anyUserAllowedToSubmit": false
        },
        {
            "resourceType": "com.bmc.arsys.rx.services.process.domain.record.RecordInstanceFieldDefinition",
            "lastUpdateTime": "2020-06-04T14:41:48.929+0000",
            "lastChangedBy": "qkatawazi",
            "owner": "dev_girish",
            "name": "CaseRecord",
            "tags": null,
            "description": "",
            "overlayGroupId": null,
            "developerId": null,
            "internal": false,
            "id": 450000152,
            "fieldOption": "OPTIONAL",
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
            "anyUserAllowedToSubmit": false
        },
        {
            "resourceType": "com.bmc.arsys.rx.standardlib.record.CharacterFieldDefinition",
            "lastUpdateTime": "2020-06-04T14:41:48.929+0000",
            "lastChangedBy": "qkatawazi",
            "owner": "dev_girish",
            "name": "CaseId",
            "tags": null,
            "description": "",
            "overlayGroupId": null,
            "developerId": null,
            "internal": false,
            "id": 450000153,
            "fieldOption": "REQUIRED",
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
            "anyUserAllowedToSubmit": false
        }
    ],
    "outputParams": [

    ],
    "localVariables": [

    ],
    "contextKeyParam": "CaseId",
    "isEnabled": true,
    "permissions": [
        {
            "ownerId": {
                "value": -74004,
                "type": "ROLE",
                "name": "Case Application Access"
            },
            "type": "READ"
        }
    ],
    "layout": "{\"cells\":[{\"id\":\"2d0772ed-34f8-4d6d-85d0-1716c1173a54\",\"position\":{\"x\":600,\"y\":375},\"size\":{\"width\":30,\"height\":30},\"type\":\"rx.EndEvent\",\"z\":17,\"attrs\":{\".label\":{\"text\":\"\"}}},{\"id\":\"0a8debc5-6f52-4dd0-92f6-9f0596628644\",\"position\":{\"x\":105,\"y\":375},\"size\":{\"width\":30,\"height\":30},\"type\":\"rx.StartEvent\",\"z\":11,\"attrs\":{\".label\":{\"text\":\"\"}}},{\"collapsedSize\":{\"width\":90,\"height\":60},\"content\":\"New Task 1\",\"expanded\":false,\"id\":\"0ff52ac1-d7db-48bb-a84f-13459d19f6df\",\"position\":{\"x\":230,\"y\":360},\"size\":{\"width\":90,\"height\":60},\"type\":\"rx.CallActivity.com.bmc.dsm.task-lib.Create Task\",\"z\":15},{\"collapsedSize\":{\"width\":90,\"height\":60},\"content\":\"New Task 2\",\"expanded\":false,\"id\":\"f5f09b63-7493-4242-ab57-9c3b5016634f\",\"position\":{\"x\":410,\"y\":360},\"size\":{\"width\":90,\"height\":60},\"type\":\"rx.CallActivity.com.bmc.dsm.task-lib.Create Task\",\"z\":16},{\"flowType\":\"normal\",\"id\":\"4f8f57ed-9a23-46d6-8792-74d653faa61e\",\"labels\":[{\"attrs\":{\"text\":{\"text\":\"\"}},\"position\":\"0.5\"}],\"source\":{\"id\":\"0a8debc5-6f52-4dd0-92f6-9f0596628644\"},\"target\":{\"id\":\"0ff52ac1-d7db-48bb-a84f-13459d19f6df\"},\"type\":\"rx.SequenceFlow\",\"z\":18},{\"flowType\":\"normal\",\"id\":\"fbe54ab0-62b1-4334-9542-579fe5bc88d7\",\"labels\":[{\"attrs\":{\"text\":{\"text\":\"\"}},\"position\":\"0.5\"}],\"source\":{\"id\":\"0ff52ac1-d7db-48bb-a84f-13459d19f6df\"},\"target\":{\"id\":\"f5f09b63-7493-4242-ab57-9c3b5016634f\"},\"type\":\"rx.SequenceFlow\",\"z\":19},{\"flowType\":\"normal\",\"id\":\"d02b3a4f-8f42-4a6f-909c-e356b332a1e2\",\"labels\":[{\"attrs\":{\"text\":{\"text\":\"\"}},\"position\":\"0.5\"}],\"source\":{\"id\":\"f5f09b63-7493-4242-ab57-9c3b5016634f\"},\"target\":{\"id\":\"2d0772ed-34f8-4d6d-85d0-1716c1173a54\"},\"type\":\"rx.SequenceFlow\",\"z\":20}]}",
    "artifacts": [

    ],
    "runAsUser": false,
    "synchronous": true,
    "overlayDescriptor": null,
    "allowOverlay": false,
    "localizableStrings": {

    }
};

export const TWO_TASKFLOW_PARALLEL = {
    "name": "com.bmc.dsm.bwfa:ParallelTasks",
    "description": "Case - TaskFlow Sample Process",
    "developerId": "com.bmc.dsm",
    "scope": "PUBLIC",
    "internal": false,
    "guid": "IDGADGG8ECDC0AQ14QLAQ06MQZ7MCY",
    "flowElements": [
        {
            "resourceType": "com.bmc.arsys.rx.services.process.domain.EndEventDefinition",
            "lastUpdateTime": "2020-06-04T15:19:48.982+0000",
            "lastChangedBy": "qkatawazi",
            "owner": "qkatawazi",
            "name": "End",
            "tags": null,
            "description": null,
            "overlayGroupId": null,
            "developerId": null,
            "internal": false,
            "guid": "rx-2d0772ed-34f8-4d6d-85d0-1716c1173a54",
            "event": null
        },
        {
            "resourceType": "com.bmc.arsys.rx.services.process.domain.StartEventDefinition",
            "lastUpdateTime": "2020-06-04T15:19:48.982+0000",
            "lastChangedBy": "qkatawazi",
            "owner": "qkatawazi",
            "name": "Start",
            "tags": null,
            "description": null,
            "overlayGroupId": null,
            "developerId": null,
            "internal": false,
            "guid": "rx-0a8debc5-6f52-4dd0-92f6-9f0596628644"
        },
        {
            "resourceType": "com.bmc.arsys.rx.services.process.domain.CallActivityDefinition",
            "name": "New Task 1",
            "description": null,
            "multiInstanceLoopDefinition": null,
            "calledProcessDefinitionName": "com.bmc.dsm.task-lib:Create Task",
            "inputMap": [
                {
                    "assignTarget": "caseId",
                    "expression": "${processContext.CaseId}"
                },


                {
                    "assignTarget": "taskSummary",
                    "expression": "\"New Task 1\""
                },
                {
                    "assignTarget": "taskTemplateId",
                    "expression": "\"templateId1\""
                },

                {
                    "assignTarget": "activityId",
                    "expression": "\"rx-7bcad3e2-ee7b-4757-a44d-7c2e284d6c5e\""
                }
            ],
            "outputMap": [
                {
                    "assignTarget": "DynamicData",
                    "expression": "${activityResults.rx-7bcad3e2-ee7b-4757-a44d-7c2e284d6c5e.DynamicData}"
                }
            ],
            "guid": "rx-7bcad3e2-ee7b-4757-a44d-7c2e284d6c5e"
        },
        {
            "resourceType": "com.bmc.arsys.rx.services.process.domain.CallActivityDefinition",
            "name": "New Task 2",
            "description": null,
            "multiInstanceLoopDefinition": null,
            "calledProcessDefinitionName": "com.bmc.dsm.task-lib:Create Task",
            "inputMap": [
                {
                    "assignTarget": "caseId",
                    "expression": "${processContext.CaseId}"
                },

                {
                    "assignTarget": "taskSummary",
                    "expression": "\"New Task 2\""
                },
                {
                    "assignTarget": "taskTemplateId",
                    "expression": "\"templateId2\""
                },
                {
                    "assignTarget": "activityId",
                    "expression": "\"rx-d849a4fc-3a40-4e92-8c5e-6e60a3bc0dd5\""
                }
            ],
            "outputMap": [
                {
                    "assignTarget": "DynamicData",
                    "expression": "${activityResults.rx-d849a4fc-3a40-4e92-8c5e-6e60a3bc0dd5.DynamicData}"
                }
            ],
            "guid": "rx-d849a4fc-3a40-4e92-8c5e-6e60a3bc0dd5"
        },
        {
            "resourceType": "com.bmc.arsys.rx.services.process.domain.SequenceFlowDefinition",
            "name": "Sequence Flow",
            "description": "",
            "sourceNode": "rx-7bcad3e2-ee7b-4757-a44d-7c2e284d6c5e",
            "guid": "rx-9bb831b9-e855-40ed-9f6a-e2a4774df0d2",
            "targetNode": "rx-2d0772ed-34f8-4d6d-85d0-1716c1173a54"
        },
        {
            "resourceType": "com.bmc.arsys.rx.services.process.domain.SequenceFlowDefinition",
            "name": "Sequence Flow",
            "description": "",
            "sourceNode": "rx-d849a4fc-3a40-4e92-8c5e-6e60a3bc0dd5",
            "guid": "rx-47820ec7-2b4a-4a66-bfce-92dc19c5e43c",
            "targetNode": "rx-2d0772ed-34f8-4d6d-85d0-1716c1173a54"
        },
        {
            "resourceType": "com.bmc.arsys.rx.services.process.domain.ParallelGatewayDefinition",
            "name": "Parallel Gateway",
            "description": "",
            "guid": "rx-496a4db8-99b4-4361-9860-409d887d43de"
        },
        {
            "resourceType": "com.bmc.arsys.rx.services.process.domain.SequenceFlowDefinition",
            "name": "Sequence Flow",
            "description": "",
            "sourceNode": "rx-0a8debc5-6f52-4dd0-92f6-9f0596628644",
            "guid": "rx-08b45014-abb9-4db6-9b90-40efc6384a91",
            "targetNode": "rx-496a4db8-99b4-4361-9860-409d887d43de"
        },
        {
            "resourceType": "com.bmc.arsys.rx.services.process.domain.SequenceFlowDefinition",
            "name": "Sequence Flow",
            "description": "",
            "sourceNode": "rx-496a4db8-99b4-4361-9860-409d887d43de",
            "guid": "rx-d0781b25-7961-408e-b2cc-a9817eddf5a6",
            "targetNode": "rx-7bcad3e2-ee7b-4757-a44d-7c2e284d6c5e"
        },
        {
            "resourceType": "com.bmc.arsys.rx.services.process.domain.SequenceFlowDefinition",
            "name": "Sequence Flow",
            "description": "",
            "sourceNode": "rx-496a4db8-99b4-4361-9860-409d887d43de",
            "guid": "rx-e4eed8cb-7fd6-48af-80b4-4132a66cc4ec",
            "targetNode": "rx-d849a4fc-3a40-4e92-8c5e-6e60a3bc0dd5"
        }
    ],
    "inputParams": [
        {
            "resourceType": "com.bmc.arsys.rx.services.process.domain.record.ObjectFieldDefinition",
            "lastUpdateTime": "2020-06-04T15:19:48.982+0000",
            "lastChangedBy": "qkatawazi",
            "owner": "dev_girish",
            "name": "DynamicData",
            "tags": null,
            "description": "",
            "overlayGroupId": null,
            "developerId": null,
            "internal": false,
            "id": 450000151,
            "fieldOption": "OPTIONAL",
            "permissions": null,
            "fieldTypeName": "com.bmc.arsys.rx.services.process.domain.record.ObjectFieldType",
            "isInherited": false,
            "explicitPermissions": null,
            "overlayDescriptor": null,
            "fieldMapping": null,
            "allowPermissionsOverlay": true,
            "allowOtherPropertiesOverlay": true,
            "auditOption": null,
            "documentDefinitionName": "com.bmc.dsm.bwfa:seq2Name",
            "anyUserAllowedToSubmit": false
        },
        {
            "resourceType": "com.bmc.arsys.rx.services.process.domain.record.RecordInstanceFieldDefinition",
            "lastUpdateTime": "2020-06-04T15:19:48.982+0000",
            "lastChangedBy": "qkatawazi",
            "owner": "dev_girish",
            "name": "CaseRecord",
            "tags": null,
            "description": "",
            "overlayGroupId": null,
            "developerId": null,
            "internal": false,
            "id": 450000152,
            "fieldOption": "OPTIONAL",
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
            "anyUserAllowedToSubmit": false
        },
        {
            "resourceType": "com.bmc.arsys.rx.standardlib.record.CharacterFieldDefinition",
            "lastUpdateTime": "2020-06-04T15:19:48.982+0000",
            "lastChangedBy": "qkatawazi",
            "owner": "dev_girish",
            "name": "CaseId",
            "tags": null,
            "description": "",
            "overlayGroupId": null,
            "developerId": null,
            "internal": false,
            "id": 450000153,
            "fieldOption": "REQUIRED",
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
            "anyUserAllowedToSubmit": false
        }
    ],
    "outputParams": [

    ],
    "localVariables": [

    ],
    "contextKeyParam": "CaseId",
    "isEnabled": true,
    "permissions": [
        {
            "ownerId": {
                "value": -74004,
                "type": "ROLE",
                "name": "Case Application Access"
            },
            "type": "READ"
        }
    ],
    "layout": "{\"cells\":[{\"id\":\"2d0772ed-34f8-4d6d-85d0-1716c1173a54\",\"position\":{\"x\":645,\"y\":375},\"size\":{\"width\":30,\"height\":30},\"type\":\"rx.EndEvent\",\"z\":34,\"attrs\":{\".label\":{\"text\":\"\"}}},{\"id\":\"0a8debc5-6f52-4dd0-92f6-9f0596628644\",\"position\":{\"x\":250,\"y\":375},\"size\":{\"width\":30,\"height\":30},\"type\":\"rx.StartEvent\",\"z\":32,\"attrs\":{\".label\":{\"text\":\"\"}}},{\"collapsedSize\":{\"width\":90,\"height\":60},\"content\":\"New Task 1\",\"expanded\":false,\"id\":\"7bcad3e2-ee7b-4757-a44d-7c2e284d6c5e\",\"position\":{\"x\":475,\"y\":300},\"size\":{\"width\":90,\"height\":60},\"type\":\"rx.CallActivity.com.bmc.dsm.task-lib.Create Task\",\"z\":36},{\"collapsedSize\":{\"width\":90,\"height\":60},\"content\":\"New Task 2\",\"expanded\":false,\"id\":\"d849a4fc-3a40-4e92-8c5e-6e60a3bc0dd5\",\"position\":{\"x\":475,\"y\":425},\"size\":{\"width\":90,\"height\":60},\"type\":\"rx.CallActivity.com.bmc.dsm.task-lib.Create Task\",\"z\":38},{\"flowType\":\"normal\",\"id\":\"9bb831b9-e855-40ed-9f6a-e2a4774df0d2\",\"labels\":[{\"attrs\":{\"text\":{\"text\":\"\"}},\"position\":\"0.5\"}],\"source\":{\"id\":\"7bcad3e2-ee7b-4757-a44d-7c2e284d6c5e\"},\"target\":{\"id\":\"2d0772ed-34f8-4d6d-85d0-1716c1173a54\"},\"type\":\"rx.SequenceFlow\",\"z\":37},{\"flowType\":\"normal\",\"id\":\"47820ec7-2b4a-4a66-bfce-92dc19c5e43c\",\"labels\":[{\"attrs\":{\"text\":{\"text\":\"\"}},\"position\":\"0.5\"}],\"source\":{\"id\":\"d849a4fc-3a40-4e92-8c5e-6e60a3bc0dd5\"},\"target\":{\"id\":\"2d0772ed-34f8-4d6d-85d0-1716c1173a54\"},\"type\":\"rx.SequenceFlow\",\"z\":39},{\"id\":\"496a4db8-99b4-4361-9860-409d887d43de\",\"position\":{\"x\":360,\"y\":370},\"size\":{\"width\":40,\"height\":40},\"type\":\"rx.ParallelGateway\",\"z\":30,\"attrs\":{\".label\":{\"text\":\"\"}}},{\"flowType\":\"normal\",\"id\":\"08b45014-abb9-4db6-9b90-40efc6384a91\",\"labels\":[{\"attrs\":{\"text\":{\"text\":\"\"}},\"position\":\"0.5\"}],\"source\":{\"id\":\"0a8debc5-6f52-4dd0-92f6-9f0596628644\"},\"target\":{\"id\":\"496a4db8-99b4-4361-9860-409d887d43de\"},\"type\":\"rx.SequenceFlow\",\"z\":33},{\"flowType\":\"normal\",\"id\":\"d0781b25-7961-408e-b2cc-a9817eddf5a6\",\"labels\":[{\"attrs\":{\"text\":{\"text\":\"\"}},\"position\":\"0.5\"}],\"source\":{\"id\":\"496a4db8-99b4-4361-9860-409d887d43de\"},\"target\":{\"id\":\"7bcad3e2-ee7b-4757-a44d-7c2e284d6c5e\"},\"type\":\"rx.SequenceFlow\",\"z\":37},{\"flowType\":\"normal\",\"id\":\"e4eed8cb-7fd6-48af-80b4-4132a66cc4ec\",\"labels\":[{\"attrs\":{\"text\":{\"text\":\"\"}},\"position\":\"0.5\"}],\"source\":{\"id\":\"496a4db8-99b4-4361-9860-409d887d43de\"},\"target\":{\"id\":\"d849a4fc-3a40-4e92-8c5e-6e60a3bc0dd5\"},\"type\":\"rx.SequenceFlow\",\"vertices\":[{\"x\":380,\"y\":455}],\"z\":39}]}",
    "artifacts": [

    ],
    "runAsUser": false,
    "synchronous": true,
    "overlayDescriptor": null,
    "allowOverlay": false,
    "localizableStrings": {

    }
};

export const THREE_TASKFLOW_SEQUENTIAL = {
    "name": "com.bmc.dsm.bwfa:ThreeSequentialTasks",
    "description": "Case - TaskFlow Sample Process",
    "developerId": "com.bmc.dsm",
    "scope": "PUBLIC",
    "internal": false,
    "guid": "IDGADGG8ECDC0AQ1RAO3Q0SW541W23",
    "flowElements": [
      {
        "resourceType": "com.bmc.arsys.rx.services.process.domain.EndEventDefinition",
        "lastUpdateTime": "2020-06-11T06:29:01.635+0000",
        "lastChangedBy": "Fritz",
        "owner": "Fritz",
        "name": "End",
        "tags": null,
        "description": null,
        "overlayGroupId": null,
        "developerId": null,
        "internal": false,
        "guid": "rx-2d0772ed-34f8-4d6d-85d0-1716c1173a54",
        "event": null
      },
      {
        "resourceType": "com.bmc.arsys.rx.services.process.domain.StartEventDefinition",
        "lastUpdateTime": "2020-06-11T06:29:01.635+0000",
        "lastChangedBy": "Fritz",
        "owner": "Fritz",
        "name": "Start",
        "tags": null,
        "description": null,
        "overlayGroupId": null,
        "developerId": null,
        "internal": false,
        "guid": "rx-0a8debc5-6f52-4dd0-92f6-9f0596628644"
      },
      {
        "resourceType": "com.bmc.arsys.rx.services.process.domain.CallActivityDefinition",
        "name": "New Task 1",
        "description": null,
        "multiInstanceLoopDefinition": null,
        "calledProcessDefinitionName": "com.bmc.dsm.task-lib:Create Task",
        "inputMap": [
          {
            "assignTarget": "caseId",
            "expression": "${processContext.CaseId}"
          },
          {
            "assignTarget": "taskSummary",
            "expression": "\"New Task 1\""
          },
          {
            "assignTarget": "taskTemplateId",
            "expression": "\"templateId1\""
          },
          {
            "assignTarget": "activityId",
            "expression": "\"rx-e11eec76-7544-4cd1-b8cc-0c9f98645335\""
          }
        ],
        "outputMap": [
          {
            "assignTarget": "DynamicData",
            "expression": "${activityResults.rx-e11eec76-7544-4cd1-b8cc-0c9f98645335.DynamicData}"
          }
        ],
        "guid": "rx-e11eec76-7544-4cd1-b8cc-0c9f98645335"
      },
      {
        "resourceType": "com.bmc.arsys.rx.services.process.domain.CallActivityDefinition",
        "name": "New Task 2",
        "description": null,
        "multiInstanceLoopDefinition": null,
        "calledProcessDefinitionName": "com.bmc.dsm.task-lib:Create Task",
        "inputMap": [
          {
            "assignTarget": "caseId",
            "expression": "${processContext.CaseId}"
          },
          {
            "assignTarget": "taskSummary",
            "expression": "\"New Task 2\""
          },
          {
            "assignTarget": "taskTemplateId",
            "expression": "\"templateId2\""
          },
          {
            "assignTarget": "activityId",
            "expression": "\"rx-182ff1ad-6a2b-40dc-83fe-e13cef442f40\""
          }
        ],
        "outputMap": [
          {
            "assignTarget": "DynamicData",
            "expression": "${activityResults.rx-182ff1ad-6a2b-40dc-83fe-e13cef442f40.DynamicData}"
          }
        ],
        "guid": "rx-182ff1ad-6a2b-40dc-83fe-e13cef442f40"
      },
      {
        "resourceType": "com.bmc.arsys.rx.services.process.domain.CallActivityDefinition",
        "name": "New Task 3",
        "description": null,
        "multiInstanceLoopDefinition": null,
        "calledProcessDefinitionName": "com.bmc.dsm.task-lib:Create Task",
        "inputMap": [
          {
            "assignTarget": "caseId",
            "expression": "${processContext.CaseId}"
          },
          {
            "assignTarget": "taskSummary",
            "expression": "\"New Task 3\""
          },
          {
            "assignTarget": "taskTemplateId",
            "expression": "\"templateId3\""
          },
          {
            "assignTarget": "activityId",
            "expression": "\"rx-e8283b0a-93ec-474a-b977-0e524147f01a\""
          }
        ],
        "outputMap": [
          {
            "assignTarget": "DynamicData",
            "expression": "${activityResults.rx-e8283b0a-93ec-474a-b977-0e524147f01a.DynamicData}"
          }
        ],
        "guid": "rx-e8283b0a-93ec-474a-b977-0e524147f01a"
      },
      {
        "resourceType": "com.bmc.arsys.rx.services.process.domain.SequenceFlowDefinition",
        "name": "Sequence Flow",
        "description": "",
        "sourceNode": "rx-0a8debc5-6f52-4dd0-92f6-9f0596628644",
        "guid": "rx-35b122b4-10dd-4344-a22c-2137804440ef",
        "targetNode": "rx-e11eec76-7544-4cd1-b8cc-0c9f98645335"
      },
      {
        "resourceType": "com.bmc.arsys.rx.services.process.domain.SequenceFlowDefinition",
        "name": "Sequence Flow",
        "description": "",
        "sourceNode": "rx-e11eec76-7544-4cd1-b8cc-0c9f98645335",
        "guid": "rx-a639774f-ee6b-418c-a399-efff17c5ca1f",
        "targetNode": "rx-182ff1ad-6a2b-40dc-83fe-e13cef442f40"
      },
      {
        "resourceType": "com.bmc.arsys.rx.services.process.domain.SequenceFlowDefinition",
        "name": "Sequence Flow",
        "description": "",
        "sourceNode": "rx-182ff1ad-6a2b-40dc-83fe-e13cef442f40",
        "guid": "rx-1ffa34c5-8c63-4463-8cd1-79ce3ce0413f",
        "targetNode": "rx-e8283b0a-93ec-474a-b977-0e524147f01a"
      },
      {
        "resourceType": "com.bmc.arsys.rx.services.process.domain.SequenceFlowDefinition",
        "name": "Sequence Flow",
        "description": "",
        "sourceNode": "rx-e8283b0a-93ec-474a-b977-0e524147f01a",
        "guid": "rx-30e4858a-3d1a-4ecb-8397-482afdb6b453",
        "targetNode": "rx-2d0772ed-34f8-4d6d-85d0-1716c1173a54"
      }
    ],
    "inputParams": [
      {
        "resourceType": "com.bmc.arsys.rx.services.process.domain.record.ObjectFieldDefinition",
        "lastUpdateTime": "2020-06-11T06:29:01.635+0000",
        "lastChangedBy": "Fritz",
        "owner": "dev_girish",
        "name": "DynamicData",
        "tags": null,
        "description": "",
        "overlayGroupId": null,
        "developerId": null,
        "internal": false,
        "id": 450000151,
        "fieldOption": "OPTIONAL",
        "permissions": null,
        "fieldTypeName": "com.bmc.arsys.rx.services.process.domain.record.ObjectFieldType",
        "isInherited": false,
        "explicitPermissions": null,
        "overlayDescriptor": null,
        "fieldMapping": null,
        "allowPermissionsOverlay": true,
        "allowOtherPropertiesOverlay": true,
        "auditOption": null,
        "documentDefinitionName": "com.bmc.dsm.bwfa:fasdf",
        "anyUserAllowedToSubmit": false
      },
      {
        "resourceType": "com.bmc.arsys.rx.services.process.domain.record.RecordInstanceFieldDefinition",
        "lastUpdateTime": "2020-06-11T06:29:01.635+0000",
        "lastChangedBy": "Fritz",
        "owner": "dev_girish",
        "name": "CaseRecord",
        "tags": null,
        "description": "",
        "overlayGroupId": null,
        "developerId": null,
        "internal": false,
        "id": 450000152,
        "fieldOption": "OPTIONAL",
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
        "anyUserAllowedToSubmit": false
      },
      {
        "resourceType": "com.bmc.arsys.rx.standardlib.record.CharacterFieldDefinition",
        "lastUpdateTime": "2020-06-11T06:29:01.635+0000",
        "lastChangedBy": "Fritz",
        "owner": "dev_girish",
        "name": "CaseId",
        "tags": null,
        "description": "",
        "overlayGroupId": null,
        "developerId": null,
        "internal": false,
        "id": 450000153,
        "fieldOption": "REQUIRED",
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
        "anyUserAllowedToSubmit": false
      }
    ],
    "outputParams": [
      
    ],
    "localVariables": [
      
    ],
    "contextKeyParam": "CaseId",
    "isEnabled": true,
    "permissions": [
      {
        "ownerId": {
          "value": -74004,
          "type": "ROLE",
          "name": "Case Application Access"
        },
        "type": "READ"
      }
    ],
    "layout": "{\"cells\":[{\"id\":\"2d0772ed-34f8-4d6d-85d0-1716c1173a54\",\"position\":{\"x\":755,\"y\":375},\"size\":{\"width\":30,\"height\":30},\"type\":\"rx.EndEvent\",\"z\":7,\"attrs\":{\".label\":{\"text\":\"\"}}},{\"id\":\"0a8debc5-6f52-4dd0-92f6-9f0596628644\",\"position\":{\"x\":210,\"y\":375},\"size\":{\"width\":30,\"height\":30},\"type\":\"rx.StartEvent\",\"z\":11,\"attrs\":{\".label\":{\"text\":\"\"}}},{\"collapsedSize\":{\"width\":90,\"height\":60},\"content\":\"New Task 1\",\"expanded\":false,\"id\":\"e11eec76-7544-4cd1-b8cc-0c9f98645335\",\"position\":{\"x\":305,\"y\":360},\"size\":{\"width\":90,\"height\":60},\"type\":\"rx.CallActivity.com.bmc.dsm.task-lib.Create Task\",\"z\":19},{\"collapsedSize\":{\"width\":90,\"height\":60},\"content\":\"New Task 2\",\"expanded\":false,\"id\":\"182ff1ad-6a2b-40dc-83fe-e13cef442f40\",\"position\":{\"x\":460,\"y\":360},\"size\":{\"width\":90,\"height\":60},\"type\":\"rx.CallActivity.com.bmc.dsm.task-lib.Create Task\",\"z\":21},{\"collapsedSize\":{\"width\":90,\"height\":60},\"content\":\"New Task 3\",\"expanded\":false,\"id\":\"e8283b0a-93ec-474a-b977-0e524147f01a\",\"position\":{\"x\":610,\"y\":360},\"size\":{\"width\":90,\"height\":60},\"type\":\"rx.CallActivity.com.bmc.dsm.task-lib.Create Task\",\"z\":23},{\"flowType\":\"normal\",\"id\":\"35b122b4-10dd-4344-a22c-2137804440ef\",\"labels\":[{\"attrs\":{\"text\":{\"text\":\"\"}},\"position\":\"0.5\"}],\"source\":{\"id\":\"0a8debc5-6f52-4dd0-92f6-9f0596628644\"},\"target\":{\"id\":\"e11eec76-7544-4cd1-b8cc-0c9f98645335\"},\"type\":\"rx.SequenceFlow\",\"z\":20},{\"flowType\":\"normal\",\"id\":\"a639774f-ee6b-418c-a399-efff17c5ca1f\",\"labels\":[{\"attrs\":{\"text\":{\"text\":\"\"}},\"position\":\"0.5\"}],\"source\":{\"id\":\"e11eec76-7544-4cd1-b8cc-0c9f98645335\"},\"target\":{\"id\":\"182ff1ad-6a2b-40dc-83fe-e13cef442f40\"},\"type\":\"rx.SequenceFlow\",\"z\":22},{\"flowType\":\"normal\",\"id\":\"1ffa34c5-8c63-4463-8cd1-79ce3ce0413f\",\"labels\":[{\"attrs\":{\"text\":{\"text\":\"\"}},\"position\":\"0.5\"}],\"source\":{\"id\":\"182ff1ad-6a2b-40dc-83fe-e13cef442f40\"},\"target\":{\"id\":\"e8283b0a-93ec-474a-b977-0e524147f01a\"},\"type\":\"rx.SequenceFlow\",\"z\":24},{\"flowType\":\"normal\",\"id\":\"30e4858a-3d1a-4ecb-8397-482afdb6b453\",\"labels\":[{\"attrs\":{\"text\":{\"text\":\"\"}},\"position\":\"0.5\"}],\"source\":{\"id\":\"e8283b0a-93ec-474a-b977-0e524147f01a\"},\"target\":{\"id\":\"2d0772ed-34f8-4d6d-85d0-1716c1173a54\"},\"type\":\"rx.SequenceFlow\",\"z\":24}]}",
    "artifacts": [
      
    ],
    "runAsUser": false,
    "synchronous": true,
    "overlayDescriptor": null,
    "allowOverlay": false,
    "localizableStrings": {
      
    }
  }