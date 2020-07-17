export const ONE_TASKFLOW = {
    "name": "com.bmc.dsm.bwfa:OneTask",
    "guid": "rx-2f8669a4-1ca0-419b-91d8-e0bf9720d7hf",
    "description": "",
    "scope": "PUBLIC",
    "tags": [
        "5a30545b15c828bf11139ffa453419200d69684e9d423ab2f3e869e6bb386507ee9ee24b1252f990cf587177918283e34694939025cd17154380ba49ce43f330"
    ],
    "flowElements": [
        {
            "resourceType": "com.bmc.arsys.rx.services.process.domain.EndEventDefinition",
            "lastUpdateTime": "2020-06-15T18:09:23.598+0000",
            "lastChangedBy": "tadmin",
            "owner": "tadmin",
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
            "lastUpdateTime": "2020-06-15T18:09:23.598+0000",
            "lastChangedBy": "tadmin",
            "owner": "tadmin",
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
            "name": "New Task",
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
                    "expression": "\"New Task\""
                },
                {
                    "assignTarget": "taskTemplateId",
                    "expression": "\"templateId\""
                },
                {
                    "assignTarget": "activityId",
                    "expression": "\"rx-a85fe84b-380e-4883-90f2-ac283f107d1a\""
                }
            ],
            "outputMap": [
                {
                    "assignTarget": "DynamicData",
                    "expression": "${activityResults.rx-a85fe84b-380e-4883-90f2-ac283f107d1a.DynamicData}"
                }
            ],
            "guid": "rx-a85fe84b-380e-4883-90f2-ac283f107d1a"
        },
        {
            "resourceType": "com.bmc.arsys.rx.services.process.domain.SequenceFlowDefinition",
            "name": "Sequence Flow",
            "description": "",
            "sourceNode": "rx-0a8debc5-6f52-4dd0-92f6-9f0596628644",
            "guid": "rx-54c41834-617b-44f5-8539-55cada06a682",
            "targetNode": "rx-a85fe84b-380e-4883-90f2-ac283f107d1a"
        },
        {
            "resourceType": "com.bmc.arsys.rx.services.process.domain.SequenceFlowDefinition",
            "name": "Sequence Flow",
            "description": "",
            "sourceNode": "rx-a85fe84b-380e-4883-90f2-ac283f107d1a",
            "guid": "rx-bf2ce07c-51e4-466e-b515-84462905c554",
            "targetNode": "rx-2d0772ed-34f8-4d6d-85d0-1716c1173a54"
        }
    ],
    "inputParams": [
        {
            "resourceType": "com.bmc.arsys.rx.services.process.domain.record.ObjectFieldDefinition",
            "lastUpdateTime": "2020-06-15T18:09:23.598+0000",
            "lastChangedBy": "tadmin",
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
            "documentDefinitionName": "com.bmc.dsm.ticketing-lib:Sample JSON Document",
            "anyUserAllowedToSubmit": false
        },
        {
            "resourceType": "com.bmc.arsys.rx.services.process.domain.record.RecordInstanceFieldDefinition",
            "lastUpdateTime": "2020-06-15T18:09:23.598+0000",
            "lastChangedBy": "tadmin",
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
            "lastUpdateTime": "2020-06-15T18:09:23.598+0000",
            "lastChangedBy": "tadmin",
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
    "layout": "{\"cells\":[{\"id\":\"2d0772ed-34f8-4d6d-85d0-1716c1173a54\",\"position\":{\"x\":715,\"y\":375},\"size\":{\"width\":30,\"height\":30},\"type\":\"rx.EndEvent\",\"z\":10,\"attrs\":{\".label\":{\"text\":\"\"}}},{\"id\":\"0a8debc5-6f52-4dd0-92f6-9f0596628644\",\"position\":{\"x\":300,\"y\":375},\"size\":{\"width\":30,\"height\":30},\"type\":\"rx.StartEvent\",\"z\":12,\"attrs\":{\".label\":{\"text\":\"\"}}},{\"collapsedSize\":{\"width\":90,\"height\":60},\"content\":\"New Task\",\"expanded\":false,\"id\":\"a85fe84b-380e-4883-90f2-ac283f107d1a\",\"position\":{\"x\":475,\"y\":360},\"size\":{\"width\":90,\"height\":60},\"type\":\"rx.CallActivity.com.bmc.dsm.task-lib.Create Task\",\"z\":11},{\"flowType\":\"normal\",\"id\":\"54c41834-617b-44f5-8539-55cada06a682\",\"labels\":[{\"attrs\":{\"text\":{\"text\":\"\"}},\"position\":\"0.5\"}],\"source\":{\"id\":\"0a8debc5-6f52-4dd0-92f6-9f0596628644\"},\"target\":{\"id\":\"a85fe84b-380e-4883-90f2-ac283f107d1a\"},\"type\":\"rx.SequenceFlow\",\"z\":13},{\"flowType\":\"normal\",\"id\":\"bf2ce07c-51e4-466e-b515-84462905c554\",\"labels\":[{\"attrs\":{\"text\":{\"text\":\"\"}},\"position\":\"0.5\"}],\"source\":{\"id\":\"a85fe84b-380e-4883-90f2-ac283f107d1a\"},\"target\":{\"id\":\"2d0772ed-34f8-4d6d-85d0-1716c1173a54\"},\"type\":\"rx.SequenceFlow\",\"z\":14}]}",
    "artifacts": [

    ],
    "runAsUser": false,
    "synchronous": true,
    "overlayDescriptor": null,
    "allowOverlay": false,
    "localizableStrings": {

    }
};

export const TWO_TASKFLOW_SEQUENTIAL = {
    "name": "com.bmc.dsm.bwfa:TwoSequentialTasks",
    "guid": "rx-2f8669a4-1ca0-419b-91d8-e0bf9720d7hf",
    "description": "",
    "scope": "PUBLIC",
    "tags": [
        "5a30545b15c828bf11139ffa453419200d69684e9d423ab2f3e869e6bb386507ee9ee24b1252f990cf587177918283e34694939025cd17154380ba49ce43f330"
    ],
    "flowElements": [
        {
            "resourceType": "com.bmc.arsys.rx.services.process.domain.EndEventDefinition",
            "lastUpdateTime": "2020-06-15T18:10:39.107+0000",
            "lastChangedBy": "tadmin",
            "owner": "tadmin",
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
            "lastUpdateTime": "2020-06-15T18:10:39.107+0000",
            "lastChangedBy": "tadmin",
            "owner": "tadmin",
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
            "lastUpdateTime": "2020-06-15T18:10:39.107+0000",
            "lastChangedBy": "tadmin",
            "owner": "tadmin",
            "name": "New Task 1",
            "tags": null,
            "description": null,
            "overlayGroupId": null,
            "developerId": null,
            "internal": false,
            "guid": "rx-a85fe84b-380e-4883-90f2-ac283f107d1a",
            "multiInstanceLoopDefinition": null,
            "calledProcessDefinitionName": "com.bmc.dsm.task-lib:Create Task",
            "sampleProcessDefinitionName": null,
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
                    "expression": "\"rx-a85fe84b-380e-4883-90f2-ac283f107d1a\""
                }
            ],
            "outputMap": [
                {
                    "assignTarget": "DynamicData",
                    "expression": "${activityResults.rx-a85fe84b-380e-4883-90f2-ac283f107d1a.DynamicData}"
                }
            ]
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
                    "expression": "\"rx-ded95e7d-9580-4cfa-b46a-9ee51e1a279e\""
                }
            ],
            "outputMap": [
                {
                    "assignTarget": "DynamicData",
                    "expression": "${activityResults.rx-ded95e7d-9580-4cfa-b46a-9ee51e1a279e.DynamicData}"
                }
            ],
            "guid": "rx-ded95e7d-9580-4cfa-b46a-9ee51e1a279e"
        },
        {
            "resourceType": "com.bmc.arsys.rx.services.process.domain.SequenceFlowDefinition",
            "lastUpdateTime": "2020-06-15T18:10:39.107+0000",
            "lastChangedBy": "tadmin",
            "owner": "tadmin",
            "name": "Sequence Flow",
            "tags": null,
            "description": "",
            "overlayGroupId": null,
            "developerId": null,
            "internal": false,
            "guid": "rx-54c41834-617b-44f5-8539-55cada06a682",
            "sourceNode": "rx-0a8debc5-6f52-4dd0-92f6-9f0596628644",
            "targetNode": "rx-a85fe84b-380e-4883-90f2-ac283f107d1a",
            "condition": ""
        },
        {
            "resourceType": "com.bmc.arsys.rx.services.process.domain.SequenceFlowDefinition",
            "name": "Sequence Flow",
            "description": "",
            "sourceNode": "rx-a85fe84b-380e-4883-90f2-ac283f107d1a",
            "guid": "rx-fc8e08c5-b3fb-4fc1-b8e2-322d5b2dcc0e",
            "targetNode": "rx-ded95e7d-9580-4cfa-b46a-9ee51e1a279e"
        },
        {
            "resourceType": "com.bmc.arsys.rx.services.process.domain.SequenceFlowDefinition",
            "name": "Sequence Flow",
            "description": "",
            "sourceNode": "rx-ded95e7d-9580-4cfa-b46a-9ee51e1a279e",
            "guid": "rx-6dc58c10-d67f-4cae-a3db-1da1dca6016c",
            "targetNode": "rx-2d0772ed-34f8-4d6d-85d0-1716c1173a54"
        }
    ],
    "inputParams": [
        {
            "resourceType": "com.bmc.arsys.rx.services.process.domain.record.ObjectFieldDefinition",
            "lastUpdateTime": "2020-06-15T18:10:39.107+0000",
            "lastChangedBy": "tadmin",
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
            "documentDefinitionName": "com.bmc.dsm.ticketing-lib:Sample JSON Document",
            "anyUserAllowedToSubmit": false
        },
        {
            "resourceType": "com.bmc.arsys.rx.services.process.domain.record.RecordInstanceFieldDefinition",
            "lastUpdateTime": "2020-06-15T18:10:39.107+0000",
            "lastChangedBy": "tadmin",
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
            "lastUpdateTime": "2020-06-15T18:10:39.107+0000",
            "lastChangedBy": "tadmin",
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
    "layout": "{\"cells\":[{\"collapsedSize\":{\"width\":90,\"height\":60},\"content\":\"New Task 1\",\"expanded\":false,\"id\":\"a85fe84b-380e-4883-90f2-ac283f107d1a\",\"position\":{\"x\":380,\"y\":360},\"size\":{\"width\":90,\"height\":60},\"type\":\"rx.CallActivity.com.bmc.dsm.task-lib.Create Task\",\"z\":23},{\"flowType\":\"normal\",\"id\":\"54c41834-617b-44f5-8539-55cada06a682\",\"labels\":[{\"attrs\":{\"text\":{\"text\":\"\"}},\"position\":\"0.5\"}],\"source\":{\"id\":\"0a8debc5-6f52-4dd0-92f6-9f0596628644\"},\"target\":{\"id\":\"a85fe84b-380e-4883-90f2-ac283f107d1a\"},\"type\":\"rx.SequenceFlow\",\"z\":24},{\"id\":\"2d0772ed-34f8-4d6d-85d0-1716c1173a54\",\"position\":{\"x\":715,\"y\":375},\"size\":{\"width\":30,\"height\":30},\"type\":\"rx.EndEvent\",\"z\":10,\"attrs\":{\".label\":{\"text\":\"\"}}},{\"id\":\"0a8debc5-6f52-4dd0-92f6-9f0596628644\",\"position\":{\"x\":270,\"y\":375},\"size\":{\"width\":30,\"height\":30},\"type\":\"rx.StartEvent\",\"z\":16,\"attrs\":{\".label\":{\"text\":\"\"}}},{\"collapsedSize\":{\"width\":90,\"height\":60},\"content\":\"New Task 2\",\"expanded\":false,\"id\":\"ded95e7d-9580-4cfa-b46a-9ee51e1a279e\",\"position\":{\"x\":545,\"y\":360},\"size\":{\"width\":90,\"height\":60},\"type\":\"rx.CallActivity.com.bmc.dsm.task-lib.Create Task\",\"z\":25},{\"flowType\":\"normal\",\"id\":\"fc8e08c5-b3fb-4fc1-b8e2-322d5b2dcc0e\",\"labels\":[{\"attrs\":{\"text\":{\"text\":\"\"}},\"position\":\"0.5\"}],\"source\":{\"id\":\"a85fe84b-380e-4883-90f2-ac283f107d1a\"},\"target\":{\"id\":\"ded95e7d-9580-4cfa-b46a-9ee51e1a279e\"},\"type\":\"rx.SequenceFlow\",\"z\":26},{\"flowType\":\"normal\",\"id\":\"6dc58c10-d67f-4cae-a3db-1da1dca6016c\",\"labels\":[{\"attrs\":{\"text\":{\"text\":\"\"}},\"position\":\"0.5\"}],\"source\":{\"id\":\"ded95e7d-9580-4cfa-b46a-9ee51e1a279e\"},\"target\":{\"id\":\"2d0772ed-34f8-4d6d-85d0-1716c1173a54\"},\"type\":\"rx.SequenceFlow\",\"z\":26}]}",
    "artifacts": [

    ],
    "runAsUser": false,
    "synchronous": false,
    "overlayDescriptor": null,
    "allowOverlay": false,
    "localizableStrings": {

    }
};

export const TWO_TASKFLOW_PARALLEL = {
    "name": "com.bmc.dsm.bwfa:TwoParallelTasks",
    "guid": "rx-2f8669a4-1ca0-419b-91d8-e0bf9720d7hf",
    "description": "",
    "scope": "PUBLIC",
    "tags": [
        "5a30545b15c828bf11139ffa453419200d69684e9d423ab2f3e869e6bb386507ee9ee24b1252f990cf587177918283e34694939025cd17154380ba49ce43f330"
    ],
    "flowElements": [
        {
            "resourceType": "com.bmc.arsys.rx.services.process.domain.EndEventDefinition",
            "lastUpdateTime": "2020-06-15T18:15:23.819+0000",
            "lastChangedBy": "tadmin",
            "owner": "tadmin",
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
            "lastUpdateTime": "2020-06-15T18:15:23.819+0000",
            "lastChangedBy": "tadmin",
            "owner": "tadmin",
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
            "lastUpdateTime": "2020-06-15T18:15:23.819+0000",
            "lastChangedBy": "tadmin",
            "owner": "tadmin",
            "name": "New Task 1",
            "tags": null,
            "description": null,
            "overlayGroupId": null,
            "developerId": null,
            "internal": false,
            "guid": "rx-a85fe84b-380e-4883-90f2-ac283f107d1a",
            "multiInstanceLoopDefinition": null,
            "calledProcessDefinitionName": "com.bmc.dsm.task-lib:Create Task",
            "sampleProcessDefinitionName": null,
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
                    "expression": "\"rx-a85fe84b-380e-4883-90f2-ac283f107d1a\""
                }
            ],
            "outputMap": [
                {
                    "assignTarget": "DynamicData",
                    "expression": "${activityResults.rx-a85fe84b-380e-4883-90f2-ac283f107d1a.DynamicData}"
                }
            ]
        },
        {
            "resourceType": "com.bmc.arsys.rx.services.process.domain.CallActivityDefinition",
            "lastUpdateTime": "2020-06-15T18:15:23.819+0000",
            "lastChangedBy": "tadmin",
            "owner": "tadmin",
            "name": "New Task 2",
            "tags": null,
            "description": null,
            "overlayGroupId": null,
            "developerId": null,
            "internal": false,
            "guid": "rx-ded95e7d-9580-4cfa-b46a-9ee51e1a279e",
            "multiInstanceLoopDefinition": null,
            "calledProcessDefinitionName": "com.bmc.dsm.task-lib:Create Task",
            "sampleProcessDefinitionName": null,
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
                    "expression": "\"rx-ded95e7d-9580-4cfa-b46a-9ee51e1a279e\""
                }
            ],
            "outputMap": [
                {
                    "assignTarget": "DynamicData",
                    "expression": "${activityResults.rx-ded95e7d-9580-4cfa-b46a-9ee51e1a279e.DynamicData}"
                }
            ]
        },
        {
            "resourceType": "com.bmc.arsys.rx.services.process.domain.SequenceFlowDefinition",
            "lastUpdateTime": "2020-06-15T18:15:23.819+0000",
            "lastChangedBy": "tadmin",
            "owner": "tadmin",
            "name": "Sequence Flow",
            "tags": null,
            "description": "",
            "overlayGroupId": null,
            "developerId": null,
            "internal": false,
            "guid": "rx-54c41834-617b-44f5-8539-55cada06a682",
            "sourceNode": "rx-0a8debc5-6f52-4dd0-92f6-9f0596628644",
            "targetNode": "rx-75e35988-71f9-4698-ab1d-52ed8418f351"
        },
        {
            "resourceType": "com.bmc.arsys.rx.services.process.domain.SequenceFlowDefinition",
            "lastUpdateTime": "2020-06-15T18:15:23.819+0000",
            "lastChangedBy": "tadmin",
            "owner": "tadmin",
            "name": "Sequence Flow",
            "tags": null,
            "description": "",
            "overlayGroupId": null,
            "developerId": null,
            "internal": false,
            "guid": "rx-6dc58c10-d67f-4cae-a3db-1da1dca6016c",
            "sourceNode": "rx-ded95e7d-9580-4cfa-b46a-9ee51e1a279e",
            "targetNode": "rx-2d0772ed-34f8-4d6d-85d0-1716c1173a54",
            "condition": ""
        },
        {
            "resourceType": "com.bmc.arsys.rx.services.process.domain.SequenceFlowDefinition",
            "name": "Sequence Flow",
            "description": "",
            "sourceNode": "rx-a85fe84b-380e-4883-90f2-ac283f107d1a",
            "guid": "rx-832c0a3a-858d-49d7-90a3-15c93ef0b1c8",
            "targetNode": "rx-2d0772ed-34f8-4d6d-85d0-1716c1173a54"
        },
        {
            "resourceType": "com.bmc.arsys.rx.services.process.domain.ParallelGatewayDefinition",
            "name": "Parallel Gateway",
            "description": "",
            "guid": "rx-75e35988-71f9-4698-ab1d-52ed8418f351"
        },
        {
            "resourceType": "com.bmc.arsys.rx.services.process.domain.SequenceFlowDefinition",
            "name": "Sequence Flow",
            "description": "",
            "sourceNode": "rx-75e35988-71f9-4698-ab1d-52ed8418f351",
            "guid": "rx-c75e5181-e054-4188-878f-2104b5fe5cc8",
            "targetNode": "rx-a85fe84b-380e-4883-90f2-ac283f107d1a"
        },
        {
            "resourceType": "com.bmc.arsys.rx.services.process.domain.SequenceFlowDefinition",
            "name": "Sequence Flow",
            "description": "",
            "sourceNode": "rx-75e35988-71f9-4698-ab1d-52ed8418f351",
            "guid": "rx-ec836774-04e4-4c95-8bea-94415f99355d",
            "targetNode": "rx-ded95e7d-9580-4cfa-b46a-9ee51e1a279e"
        }
    ],
    "inputParams": [
        {
            "resourceType": "com.bmc.arsys.rx.services.process.domain.record.ObjectFieldDefinition",
            "lastUpdateTime": "2020-06-15T18:15:23.819+0000",
            "lastChangedBy": "tadmin",
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
            "documentDefinitionName": "com.bmc.dsm.ticketing-lib:Sample JSON Document",
            "anyUserAllowedToSubmit": false
        },
        {
            "resourceType": "com.bmc.arsys.rx.services.process.domain.record.RecordInstanceFieldDefinition",
            "lastUpdateTime": "2020-06-15T18:15:23.819+0000",
            "lastChangedBy": "tadmin",
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
            "lastUpdateTime": "2020-06-15T18:15:23.819+0000",
            "lastChangedBy": "tadmin",
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
    "layout": "{\"cells\":[{\"collapsedSize\":{\"width\":90,\"height\":60},\"content\":\"New Task 2\",\"expanded\":false,\"id\":\"ded95e7d-9580-4cfa-b46a-9ee51e1a279e\",\"position\":{\"x\":480,\"y\":460},\"size\":{\"width\":90,\"height\":60},\"type\":\"rx.CallActivity.com.bmc.dsm.task-lib.Create Task\",\"z\":45},{\"id\":\"2d0772ed-34f8-4d6d-85d0-1716c1173a54\",\"position\":{\"x\":640,\"y\":395},\"size\":{\"width\":30,\"height\":30},\"type\":\"rx.EndEvent\",\"z\":49,\"attrs\":{\".label\":{\"text\":\"\"}}},{\"collapsedSize\":{\"width\":90,\"height\":60},\"content\":\"New Task 1\",\"expanded\":false,\"id\":\"a85fe84b-380e-4883-90f2-ac283f107d1a\",\"position\":{\"x\":480,\"y\":305},\"size\":{\"width\":90,\"height\":60},\"type\":\"rx.CallActivity.com.bmc.dsm.task-lib.Create Task\",\"z\":51},{\"flowType\":\"normal\",\"id\":\"54c41834-617b-44f5-8539-55cada06a682\",\"labels\":[{\"attrs\":{\"text\":{\"text\":\"\"}},\"position\":\"0.5\"}],\"source\":{\"id\":\"0a8debc5-6f52-4dd0-92f6-9f0596628644\"},\"target\":{\"id\":\"75e35988-71f9-4698-ab1d-52ed8418f351\"},\"type\":\"rx.SequenceFlow\",\"z\":44},{\"id\":\"0a8debc5-6f52-4dd0-92f6-9f0596628644\",\"position\":{\"x\":255,\"y\":395},\"size\":{\"width\":30,\"height\":30},\"type\":\"rx.StartEvent\",\"z\":43,\"attrs\":{\".label\":{\"text\":\"\"}}},{\"flowType\":\"normal\",\"id\":\"6dc58c10-d67f-4cae-a3db-1da1dca6016c\",\"labels\":[{\"attrs\":{\"text\":{\"text\":\"\"}},\"position\":\"0.5\"}],\"source\":{\"id\":\"ded95e7d-9580-4cfa-b46a-9ee51e1a279e\"},\"target\":{\"id\":\"2d0772ed-34f8-4d6d-85d0-1716c1173a54\"},\"type\":\"rx.SequenceFlow\",\"z\":50},{\"flowType\":\"normal\",\"id\":\"832c0a3a-858d-49d7-90a3-15c93ef0b1c8\",\"labels\":[{\"attrs\":{\"text\":{\"text\":\"\"}},\"position\":\"0.5\"}],\"source\":{\"id\":\"a85fe84b-380e-4883-90f2-ac283f107d1a\"},\"target\":{\"id\":\"2d0772ed-34f8-4d6d-85d0-1716c1173a54\"},\"type\":\"rx.SequenceFlow\",\"z\":52},{\"id\":\"75e35988-71f9-4698-ab1d-52ed8418f351\",\"position\":{\"x\":360,\"y\":390},\"size\":{\"width\":40,\"height\":40},\"type\":\"rx.ParallelGateway\",\"z\":40,\"attrs\":{\".label\":{\"text\":\"\"}}},{\"flowType\":\"normal\",\"id\":\"c75e5181-e054-4188-878f-2104b5fe5cc8\",\"labels\":[{\"attrs\":{\"text\":{\"text\":\"\"}},\"position\":\"0.5\"}],\"source\":{\"id\":\"75e35988-71f9-4698-ab1d-52ed8418f351\"},\"target\":{\"id\":\"a85fe84b-380e-4883-90f2-ac283f107d1a\"},\"type\":\"rx.SequenceFlow\",\"z\":52},{\"flowType\":\"normal\",\"id\":\"ec836774-04e4-4c95-8bea-94415f99355d\",\"labels\":[{\"attrs\":{\"text\":{\"text\":\"\"}},\"position\":\"0.5\"}],\"source\":{\"id\":\"75e35988-71f9-4698-ab1d-52ed8418f351\"},\"target\":{\"id\":\"ded95e7d-9580-4cfa-b46a-9ee51e1a279e\"},\"type\":\"rx.SequenceFlow\",\"vertices\":[{\"x\":380,\"y\":490}],\"z\":46}]}",
    "artifacts": [

    ],
    "runAsUser": false,
    "synchronous": false,
    "overlayDescriptor": null,
    "allowOverlay": false,
    "localizableStrings": {

    }
};

export const THREE_TASKFLOW_SEQUENTIAL = {
    "name": "com.bmc.dsm.bwfa:TwoParallelTasks",
    "guid": "rx-2f8669a4-1ca0-419b-91d8-e0bf9720d7hf",
    "description": "",
    "scope": "PUBLIC",
    "tags": [
        "5a30545b15c828bf11139ffa453419200d69684e9d423ab2f3e869e6bb386507ee9ee24b1252f990cf587177918283e34694939025cd17154380ba49ce43f330"
    ],
    "flowElements": [
        {
            "resourceType": "com.bmc.arsys.rx.services.process.domain.EndEventDefinition",
            "lastUpdateTime": "2020-06-15T18:22:23.329+0000",
            "lastChangedBy": "tadmin",
            "owner": "tadmin",
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
            "lastUpdateTime": "2020-06-15T18:22:23.329+0000",
            "lastChangedBy": "tadmin",
            "owner": "tadmin",
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
                    "expression": "\"rx-30773364-abcd-497c-9614-58317ac953cd\""
                }
            ],
            "outputMap": [
                {
                    "assignTarget": "DynamicData",
                    "expression": "${activityResults.rx-30773364-abcd-497c-9614-58317ac953cd.DynamicData}"
                }
            ],
            "guid": "rx-30773364-abcd-497c-9614-58317ac953cd"
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
                    "expression": "\"rx-4f6416e2-5603-4c31-b00b-43b6131d1b70\""
                }
            ],
            "outputMap": [
                {
                    "assignTarget": "DynamicData",
                    "expression": "${activityResults.rx-4f6416e2-5603-4c31-b00b-43b6131d1b70.DynamicData}"
                }
            ],
            "guid": "rx-4f6416e2-5603-4c31-b00b-43b6131d1b70"
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
                    "expression": "\"rx-3f299725-c10d-4b6c-9d07-56109399b465\""
                }
            ],
            "outputMap": [
                {
                    "assignTarget": "DynamicData",
                    "expression": "${activityResults.rx-3f299725-c10d-4b6c-9d07-56109399b465.DynamicData}"
                }
            ],
            "guid": "rx-3f299725-c10d-4b6c-9d07-56109399b465"
        },
        {
            "resourceType": "com.bmc.arsys.rx.services.process.domain.SequenceFlowDefinition",
            "name": "Sequence Flow",
            "description": "",
            "sourceNode": "rx-0a8debc5-6f52-4dd0-92f6-9f0596628644",
            "guid": "rx-0f520b05-f00f-4b3d-b731-3904e9bb4f65",
            "targetNode": "rx-30773364-abcd-497c-9614-58317ac953cd"
        },
        {
            "resourceType": "com.bmc.arsys.rx.services.process.domain.SequenceFlowDefinition",
            "name": "Sequence Flow",
            "description": "",
            "sourceNode": "rx-30773364-abcd-497c-9614-58317ac953cd",
            "guid": "rx-19908127-720f-4cce-a275-acea0bff1160",
            "targetNode": "rx-4f6416e2-5603-4c31-b00b-43b6131d1b70"
        },
        {
            "resourceType": "com.bmc.arsys.rx.services.process.domain.SequenceFlowDefinition",
            "name": "Sequence Flow",
            "description": "",
            "sourceNode": "rx-4f6416e2-5603-4c31-b00b-43b6131d1b70",
            "guid": "rx-3da5e264-268d-4167-a5af-13de0b5fe412",
            "targetNode": "rx-3f299725-c10d-4b6c-9d07-56109399b465"
        },
        {
            "resourceType": "com.bmc.arsys.rx.services.process.domain.SequenceFlowDefinition",
            "name": "Sequence Flow",
            "description": "",
            "sourceNode": "rx-3f299725-c10d-4b6c-9d07-56109399b465",
            "guid": "rx-f24cb1b5-b217-4521-8a62-d122fa2ab19c",
            "targetNode": "rx-2d0772ed-34f8-4d6d-85d0-1716c1173a54"
        }
    ],
    "inputParams": [
        {
            "resourceType": "com.bmc.arsys.rx.services.process.domain.record.ObjectFieldDefinition",
            "lastUpdateTime": "2020-06-15T18:22:23.329+0000",
            "lastChangedBy": "tadmin",
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
            "documentDefinitionName": "com.bmc.dsm.ticketing-lib:Sample JSON Document",
            "anyUserAllowedToSubmit": false
        },
        {
            "resourceType": "com.bmc.arsys.rx.services.process.domain.record.RecordInstanceFieldDefinition",
            "lastUpdateTime": "2020-06-15T18:22:23.329+0000",
            "lastChangedBy": "tadmin",
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
            "lastUpdateTime": "2020-06-15T18:22:23.329+0000",
            "lastChangedBy": "tadmin",
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
    "layout": "{\"cells\":[{\"id\":\"2d0772ed-34f8-4d6d-85d0-1716c1173a54\",\"position\":{\"x\":800,\"y\":395},\"size\":{\"width\":30,\"height\":30},\"type\":\"rx.EndEvent\",\"z\":55,\"attrs\":{\".label\":{\"text\":\"\"}}},{\"id\":\"0a8debc5-6f52-4dd0-92f6-9f0596628644\",\"position\":{\"x\":200,\"y\":395},\"size\":{\"width\":30,\"height\":30},\"type\":\"rx.StartEvent\",\"z\":51,\"attrs\":{\".label\":{\"text\":\"\"}}},{\"collapsedSize\":{\"width\":90,\"height\":60},\"content\":\"New Task 1\",\"expanded\":false,\"id\":\"30773364-abcd-497c-9614-58317ac953cd\",\"position\":{\"x\":300,\"y\":380},\"size\":{\"width\":90,\"height\":60},\"type\":\"rx.CallActivity.com.bmc.dsm.task-lib.Create Task\",\"z\":64},{\"collapsedSize\":{\"width\":90,\"height\":60},\"content\":\"New Task 2\",\"expanded\":false,\"id\":\"4f6416e2-5603-4c31-b00b-43b6131d1b70\",\"position\":{\"x\":475,\"y\":380},\"size\":{\"width\":90,\"height\":60},\"type\":\"rx.CallActivity.com.bmc.dsm.task-lib.Create Task\",\"z\":59},{\"collapsedSize\":{\"width\":90,\"height\":60},\"content\":\"New Task 3\",\"expanded\":false,\"id\":\"3f299725-c10d-4b6c-9d07-56109399b465\",\"position\":{\"x\":635,\"y\":380},\"size\":{\"width\":90,\"height\":60},\"type\":\"rx.CallActivity.com.bmc.dsm.task-lib.Create Task\",\"z\":56},{\"flowType\":\"normal\",\"id\":\"0f520b05-f00f-4b3d-b731-3904e9bb4f65\",\"labels\":[{\"attrs\":{\"text\":{\"text\":\"\"}},\"position\":\"0.5\"}],\"source\":{\"id\":\"0a8debc5-6f52-4dd0-92f6-9f0596628644\"},\"target\":{\"id\":\"30773364-abcd-497c-9614-58317ac953cd\"},\"type\":\"rx.SequenceFlow\",\"z\":65},{\"flowType\":\"normal\",\"id\":\"19908127-720f-4cce-a275-acea0bff1160\",\"labels\":[{\"attrs\":{\"text\":{\"text\":\"\"}},\"position\":\"0.5\"}],\"source\":{\"id\":\"30773364-abcd-497c-9614-58317ac953cd\"},\"target\":{\"id\":\"4f6416e2-5603-4c31-b00b-43b6131d1b70\"},\"type\":\"rx.SequenceFlow\",\"z\":65},{\"flowType\":\"normal\",\"id\":\"3da5e264-268d-4167-a5af-13de0b5fe412\",\"labels\":[{\"attrs\":{\"text\":{\"text\":\"\"}},\"position\":\"0.5\"}],\"source\":{\"id\":\"4f6416e2-5603-4c31-b00b-43b6131d1b70\"},\"target\":{\"id\":\"3f299725-c10d-4b6c-9d07-56109399b465\"},\"type\":\"rx.SequenceFlow\",\"z\":62},{\"flowType\":\"normal\",\"id\":\"f24cb1b5-b217-4521-8a62-d122fa2ab19c\",\"labels\":[{\"attrs\":{\"text\":{\"text\":\"\"}},\"position\":\"0.5\"}],\"source\":{\"id\":\"3f299725-c10d-4b6c-9d07-56109399b465\"},\"target\":{\"id\":\"2d0772ed-34f8-4d6d-85d0-1716c1173a54\"},\"type\":\"rx.SequenceFlow\",\"z\":63}]}",
    "artifacts": [

    ],
    "runAsUser": false,
    "synchronous": false,
    "overlayDescriptor": null,
    "allowOverlay": false,
    "localizableStrings": {

    }
};

export const PROCESS_DOCUMENT = {
    "allowOverlay": false,
    "name": "com.bmc.dsm.bwfa:DocName",
    "scope": "PUBLIC",
    "documentSchema": "{}"
};