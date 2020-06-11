export const ONE_TASKFLOW = {
    "name": "com.bmc.dsm.bwfa:OneTask",
    "tags": [
        "5a30545b15c828bf11139ffa453419200d69684e9d423ab2f3e869e6bb386507ee9ee24b1252f990cf587177918283e34694939025cd17154380ba49ce43f330"
    ],
    "description": "Case - TaskFlow Sample Process",
    "overlayGroupId": "Petramco",
    "developerId": "com.bmc.dsm",
    "scope": "PUBLIC",
    "internal": false,
    "guid": "IDGADGG8ECDC0AQ1RMHMQ0T7YN4WEN",
    "flowElements": [
        {
            "resourceType": "com.bmc.arsys.rx.services.process.domain.EndEventDefinition",
            "lastUpdateTime": "2020-06-11T14:14:10.786+0000",
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
            "lastUpdateTime": "2020-06-11T14:14:10.786+0000",
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
                    "expression": "\"rx-326e160c-82f5-4367-88fa-d9f19161489b\""
                }
            ],
            "outputMap": [
                {
                    "assignTarget": "DynamicData",
                    "expression": "${activityResults.rx-326e160c-82f5-4367-88fa-d9f19161489b.DynamicData}"
                }
            ],
            "guid": "rx-326e160c-82f5-4367-88fa-d9f19161489b"
        },
        {
            "resourceType": "com.bmc.arsys.rx.services.process.domain.SequenceFlowDefinition",
            "name": "Sequence Flow",
            "description": "",
            "sourceNode": "rx-0a8debc5-6f52-4dd0-92f6-9f0596628644",
            "guid": "rx-0dc97bd2-6f2c-4d93-9c20-05cc15f53315",
            "targetNode": "rx-326e160c-82f5-4367-88fa-d9f19161489b"
        },
        {
            "resourceType": "com.bmc.arsys.rx.services.process.domain.SequenceFlowDefinition",
            "name": "Sequence Flow",
            "description": "",
            "sourceNode": "rx-326e160c-82f5-4367-88fa-d9f19161489b",
            "guid": "rx-92c16a81-0904-4d79-9119-cd7ea45a8177",
            "targetNode": "rx-2d0772ed-34f8-4d6d-85d0-1716c1173a54"
        }
    ],
    "inputParams": [
        {
            "resourceType": "com.bmc.arsys.rx.services.process.domain.record.ObjectFieldDefinition",
            "lastUpdateTime": "2020-06-11T14:14:10.786+0000",
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
            "documentDefinitionName": "com.bmc.dsm.bwfa:OneTask",
            "anyUserAllowedToSubmit": false
        },
        {
            "resourceType": "com.bmc.arsys.rx.services.process.domain.record.RecordInstanceFieldDefinition",
            "lastUpdateTime": "2020-06-11T14:14:10.786+0000",
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
            "lastUpdateTime": "2020-06-11T14:14:10.786+0000",
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
    "layout": "{\"cells\":[{\"id\":\"2d0772ed-34f8-4d6d-85d0-1716c1173a54\",\"position\":{\"x\":630,\"y\":380},\"size\":{\"width\":30,\"height\":30},\"type\":\"rx.EndEvent\",\"z\":8,\"attrs\":{\".label\":{\"text\":\"\"}}},{\"id\":\"0a8debc5-6f52-4dd0-92f6-9f0596628644\",\"position\":{\"x\":310,\"y\":380},\"size\":{\"width\":30,\"height\":30},\"type\":\"rx.StartEvent\",\"z\":7,\"attrs\":{\".label\":{\"text\":\"\"}}},{\"collapsedSize\":{\"width\":90,\"height\":60},\"content\":\"New Task\",\"expanded\":false,\"id\":\"326e160c-82f5-4367-88fa-d9f19161489b\",\"position\":{\"x\":445,\"y\":365},\"size\":{\"width\":90,\"height\":60},\"type\":\"rx.CallActivity.com.bmc.dsm.task-lib.Create Task\",\"z\":11},{\"flowType\":\"normal\",\"id\":\"0dc97bd2-6f2c-4d93-9c20-05cc15f53315\",\"labels\":[{\"attrs\":{\"text\":{\"text\":\"\"}},\"position\":\"0.5\"}],\"source\":{\"id\":\"0a8debc5-6f52-4dd0-92f6-9f0596628644\"},\"target\":{\"id\":\"326e160c-82f5-4367-88fa-d9f19161489b\"},\"type\":\"rx.SequenceFlow\",\"z\":12},{\"flowType\":\"normal\",\"id\":\"92c16a81-0904-4d79-9119-cd7ea45a8177\",\"labels\":[{\"attrs\":{\"text\":{\"text\":\"\"}},\"position\":\"0.5\"}],\"source\":{\"id\":\"326e160c-82f5-4367-88fa-d9f19161489b\"},\"target\":{\"id\":\"2d0772ed-34f8-4d6d-85d0-1716c1173a54\"},\"type\":\"rx.SequenceFlow\",\"z\":12}]}",
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
    "tags": [
        "5a30545b15c828bf11139ffa453419200d69684e9d423ab2f3e869e6bb386507ee9ee24b1252f990cf587177918283e34694939025cd17154380ba49ce43f330"
    ],
    "description": "Case - TaskFlow Sample Process",
    "overlayGroupId": "Petramco",
    "developerId": "com.bmc.dsm",
    "scope": "PUBLIC",
    "internal": false,
    "guid": "IDGADGG8ECDC0AQ1RLXLQ0T7OM4UYS",
    "flowElements": [
        {
            "resourceType": "com.bmc.arsys.rx.services.process.domain.EndEventDefinition",
            "lastUpdateTime": "2020-06-11T14:08:10.181+0000",
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
            "lastUpdateTime": "2020-06-11T14:08:10.181+0000",
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
                    "expression": "\"rx-d9b504e4-c4c0-490e-aa86-e226fc026e6c\""
                }
            ],
            "outputMap": [
                {
                    "assignTarget": "DynamicData",
                    "expression": "${activityResults.rx-d9b504e4-c4c0-490e-aa86-e226fc026e6c.DynamicData}"
                }
            ],
            "guid": "rx-d9b504e4-c4c0-490e-aa86-e226fc026e6c"
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
                    "expression": "\"rx-42325a46-42e8-4743-9080-c71f1cd0358e\""
                }
            ],
            "outputMap": [
                {
                    "assignTarget": "DynamicData",
                    "expression": "${activityResults.rx-42325a46-42e8-4743-9080-c71f1cd0358e.DynamicData}"
                }
            ],
            "guid": "rx-42325a46-42e8-4743-9080-c71f1cd0358e"
        },
        {
            "resourceType": "com.bmc.arsys.rx.services.process.domain.SequenceFlowDefinition",
            "name": "Sequence Flow",
            "description": "",
            "sourceNode": "rx-0a8debc5-6f52-4dd0-92f6-9f0596628644",
            "guid": "rx-d7481db3-3474-4be7-b3b4-83419454cd85",
            "targetNode": "rx-d9b504e4-c4c0-490e-aa86-e226fc026e6c"
        },
        {
            "resourceType": "com.bmc.arsys.rx.services.process.domain.SequenceFlowDefinition",
            "name": "Sequence Flow",
            "description": "",
            "sourceNode": "rx-d9b504e4-c4c0-490e-aa86-e226fc026e6c",
            "guid": "rx-da67906a-bc8d-4fb1-97f3-b0771c34764f",
            "targetNode": "rx-42325a46-42e8-4743-9080-c71f1cd0358e"
        },
        {
            "resourceType": "com.bmc.arsys.rx.services.process.domain.SequenceFlowDefinition",
            "name": "Sequence Flow",
            "description": "",
            "sourceNode": "rx-42325a46-42e8-4743-9080-c71f1cd0358e",
            "guid": "rx-6e1b7a64-2db4-442c-9364-8f89d43808f3",
            "targetNode": "rx-2d0772ed-34f8-4d6d-85d0-1716c1173a54"
        }
    ],
    "inputParams": [
        {
            "resourceType": "com.bmc.arsys.rx.services.process.domain.record.ObjectFieldDefinition",
            "lastUpdateTime": "2020-06-11T14:08:10.181+0000",
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
            "documentDefinitionName": "com.bmc.dsm.bwfa:Seq1",
            "anyUserAllowedToSubmit": false
        },
        {
            "resourceType": "com.bmc.arsys.rx.services.process.domain.record.RecordInstanceFieldDefinition",
            "lastUpdateTime": "2020-06-11T14:08:10.181+0000",
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
            "lastUpdateTime": "2020-06-11T14:08:10.181+0000",
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
    "layout": "{\"cells\":[{\"id\":\"2d0772ed-34f8-4d6d-85d0-1716c1173a54\",\"position\":{\"x\":750,\"y\":375},\"size\":{\"width\":30,\"height\":30},\"type\":\"rx.EndEvent\",\"z\":15,\"attrs\":{\".label\":{\"text\":\"\"}}},{\"id\":\"0a8debc5-6f52-4dd0-92f6-9f0596628644\",\"position\":{\"x\":220,\"y\":375},\"size\":{\"width\":30,\"height\":30},\"type\":\"rx.StartEvent\",\"z\":6,\"attrs\":{\".label\":{\"text\":\"\"}}},{\"collapsedSize\":{\"width\":90,\"height\":60},\"content\":\"New Task 1\",\"expanded\":false,\"id\":\"d9b504e4-c4c0-490e-aa86-e226fc026e6c\",\"position\":{\"x\":350,\"y\":360},\"size\":{\"width\":90,\"height\":60},\"type\":\"rx.CallActivity.com.bmc.dsm.task-lib.Create Task\",\"z\":13},{\"collapsedSize\":{\"width\":90,\"height\":60},\"content\":\"New Task 2\",\"expanded\":false,\"id\":\"42325a46-42e8-4743-9080-c71f1cd0358e\",\"position\":{\"x\":550,\"y\":360},\"size\":{\"width\":90,\"height\":60},\"type\":\"rx.CallActivity.com.bmc.dsm.task-lib.Create Task\",\"z\":9},{\"flowType\":\"normal\",\"id\":\"d7481db3-3474-4be7-b3b4-83419454cd85\",\"labels\":[{\"attrs\":{\"text\":{\"text\":\"\"}},\"position\":\"0.5\"}],\"source\":{\"id\":\"0a8debc5-6f52-4dd0-92f6-9f0596628644\"},\"target\":{\"id\":\"d9b504e4-c4c0-490e-aa86-e226fc026e6c\"},\"type\":\"rx.SequenceFlow\",\"z\":14},{\"flowType\":\"normal\",\"id\":\"da67906a-bc8d-4fb1-97f3-b0771c34764f\",\"labels\":[{\"attrs\":{\"text\":{\"text\":\"\"}},\"position\":\"0.5\"}],\"source\":{\"id\":\"d9b504e4-c4c0-490e-aa86-e226fc026e6c\"},\"target\":{\"id\":\"42325a46-42e8-4743-9080-c71f1cd0358e\"},\"type\":\"rx.SequenceFlow\",\"z\":14},{\"flowType\":\"normal\",\"id\":\"6e1b7a64-2db4-442c-9364-8f89d43808f3\",\"labels\":[{\"attrs\":{\"text\":{\"text\":\"\"}},\"position\":\"0.5\"}],\"source\":{\"id\":\"42325a46-42e8-4743-9080-c71f1cd0358e\"},\"target\":{\"id\":\"2d0772ed-34f8-4d6d-85d0-1716c1173a54\"},\"type\":\"rx.SequenceFlow\",\"z\":16}]}",
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
    "name": "com.bmc.dsm.bwfa:TwoParallelTasks",
    "tags": [
        "5a30545b15c828bf11139ffa453419200d69684e9d423ab2f3e869e6bb386507ee9ee24b1252f990cf587177918283e34694939025cd17154380ba49ce43f330"
    ],
    "description": "Case - TaskFlow Sample Process",
    "overlayGroupId": "Petramco",
    "developerId": "com.bmc.dsm",
    "scope": "PUBLIC",
    "internal": false,
    "guid": "IDGADGG8ECDC0AQ1RK0MQ0T6BN43YF",
    "flowElements": [
        {
            "resourceType": "com.bmc.arsys.rx.services.process.domain.EndEventDefinition",
            "lastUpdateTime": "2020-06-11T13:32:47.197+0000",
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
            "lastUpdateTime": "2020-06-11T13:32:47.197+0000",
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
                    "expression": "\"rx-6b17a30a-26f4-4eb5-adac-512a0a1e7088\""
                }
            ],
            "outputMap": [
                {
                    "assignTarget": "DynamicData",
                    "expression": "${activityResults.rx-6b17a30a-26f4-4eb5-adac-512a0a1e7088.DynamicData}"
                }
            ],
            "guid": "rx-6b17a30a-26f4-4eb5-adac-512a0a1e7088"
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
                    "expression": "\"rx-e0a0f5ca-2650-4ecc-8a12-80ea3fdda79b\""
                }
            ],
            "outputMap": [
                {
                    "assignTarget": "DynamicData",
                    "expression": "${activityResults.rx-e0a0f5ca-2650-4ecc-8a12-80ea3fdda79b.DynamicData}"
                }
            ],
            "guid": "rx-e0a0f5ca-2650-4ecc-8a12-80ea3fdda79b"
        },
        {
            "resourceType": "com.bmc.arsys.rx.services.process.domain.ParallelGatewayDefinition",
            "name": "Parallel Gateway",
            "description": "",
            "guid": "rx-621234f8-7580-4e24-a59f-316ae0c92ff0"
        },
        {
            "resourceType": "com.bmc.arsys.rx.services.process.domain.SequenceFlowDefinition",
            "name": "Sequence Flow",
            "description": "",
            "sourceNode": "rx-0a8debc5-6f52-4dd0-92f6-9f0596628644",
            "guid": "rx-a8f76651-160e-4d35-90dd-02f4d234dbab",
            "targetNode": "rx-621234f8-7580-4e24-a59f-316ae0c92ff0"
        },
        {
            "resourceType": "com.bmc.arsys.rx.services.process.domain.SequenceFlowDefinition",
            "name": "Sequence Flow",
            "description": "",
            "sourceNode": "rx-621234f8-7580-4e24-a59f-316ae0c92ff0",
            "guid": "rx-84e0813e-735f-4254-ba70-54a7fae074e6",
            "targetNode": "rx-6b17a30a-26f4-4eb5-adac-512a0a1e7088"
        },
        {
            "resourceType": "com.bmc.arsys.rx.services.process.domain.SequenceFlowDefinition",
            "name": "Sequence Flow",
            "description": "",
            "sourceNode": "rx-621234f8-7580-4e24-a59f-316ae0c92ff0",
            "guid": "rx-51937726-9025-4d70-8ce4-df478fab70cd",
            "targetNode": "rx-e0a0f5ca-2650-4ecc-8a12-80ea3fdda79b"
        },
        {
            "resourceType": "com.bmc.arsys.rx.services.process.domain.SequenceFlowDefinition",
            "name": "Sequence Flow",
            "description": "",
            "sourceNode": "rx-e0a0f5ca-2650-4ecc-8a12-80ea3fdda79b",
            "guid": "rx-9ccc767f-765f-4dbf-8171-374196cd7588",
            "targetNode": "rx-2d0772ed-34f8-4d6d-85d0-1716c1173a54"
        },
        {
            "resourceType": "com.bmc.arsys.rx.services.process.domain.SequenceFlowDefinition",
            "name": "Sequence Flow",
            "description": "",
            "sourceNode": "rx-6b17a30a-26f4-4eb5-adac-512a0a1e7088",
            "guid": "rx-7724da81-3fc5-4f4b-8636-256aed407a6e",
            "targetNode": "rx-2d0772ed-34f8-4d6d-85d0-1716c1173a54"
        }
    ],
    "inputParams": [
        {
            "resourceType": "com.bmc.arsys.rx.services.process.domain.record.ObjectFieldDefinition",
            "lastUpdateTime": "2020-06-11T13:32:47.197+0000",
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
            "documentDefinitionName": "com.bmc.dsm.bwfa:Parallel",
            "anyUserAllowedToSubmit": false
        },
        {
            "resourceType": "com.bmc.arsys.rx.services.process.domain.record.RecordInstanceFieldDefinition",
            "lastUpdateTime": "2020-06-11T13:32:47.197+0000",
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
            "lastUpdateTime": "2020-06-11T13:32:47.197+0000",
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
    "layout": "{\"cells\":[{\"id\":\"2d0772ed-34f8-4d6d-85d0-1716c1173a54\",\"position\":{\"x\":735,\"y\":375},\"size\":{\"width\":30,\"height\":30},\"type\":\"rx.EndEvent\",\"z\":19,\"attrs\":{\".label\":{\"text\":\"\"}}},{\"id\":\"0a8debc5-6f52-4dd0-92f6-9f0596628644\",\"position\":{\"x\":250,\"y\":375},\"size\":{\"width\":30,\"height\":30},\"type\":\"rx.StartEvent\",\"z\":13,\"attrs\":{\".label\":{\"text\":\"\"}}},{\"collapsedSize\":{\"width\":90,\"height\":60},\"content\":\"New Task 1\",\"expanded\":false,\"id\":\"6b17a30a-26f4-4eb5-adac-512a0a1e7088\",\"position\":{\"x\":520,\"y\":290},\"size\":{\"width\":90,\"height\":60},\"type\":\"rx.CallActivity.com.bmc.dsm.task-lib.Create Task\",\"z\":11},{\"collapsedSize\":{\"width\":90,\"height\":60},\"content\":\"New Task 2\",\"expanded\":false,\"id\":\"e0a0f5ca-2650-4ecc-8a12-80ea3fdda79b\",\"position\":{\"x\":520,\"y\":440},\"size\":{\"width\":90,\"height\":60},\"type\":\"rx.CallActivity.com.bmc.dsm.task-lib.Create Task\",\"z\":12},{\"id\":\"621234f8-7580-4e24-a59f-316ae0c92ff0\",\"position\":{\"x\":375,\"y\":370},\"size\":{\"width\":40,\"height\":40},\"type\":\"rx.ParallelGateway\",\"z\":10,\"attrs\":{\".label\":{\"text\":\"\"}}},{\"flowType\":\"normal\",\"id\":\"a8f76651-160e-4d35-90dd-02f4d234dbab\",\"labels\":[{\"attrs\":{\"text\":{\"text\":\"\"}},\"position\":\"0.5\"}],\"source\":{\"id\":\"0a8debc5-6f52-4dd0-92f6-9f0596628644\"},\"target\":{\"id\":\"621234f8-7580-4e24-a59f-316ae0c92ff0\"},\"type\":\"rx.SequenceFlow\",\"z\":14},{\"flowType\":\"normal\",\"id\":\"84e0813e-735f-4254-ba70-54a7fae074e6\",\"labels\":[{\"attrs\":{\"text\":{\"text\":\"\"}},\"position\":\"0.5\"}],\"source\":{\"id\":\"621234f8-7580-4e24-a59f-316ae0c92ff0\"},\"target\":{\"id\":\"6b17a30a-26f4-4eb5-adac-512a0a1e7088\"},\"type\":\"rx.SequenceFlow\",\"z\":15},{\"flowType\":\"normal\",\"id\":\"51937726-9025-4d70-8ce4-df478fab70cd\",\"labels\":[{\"attrs\":{\"text\":{\"text\":\"\"}},\"position\":\"0.5\"}],\"source\":{\"id\":\"621234f8-7580-4e24-a59f-316ae0c92ff0\"},\"target\":{\"id\":\"e0a0f5ca-2650-4ecc-8a12-80ea3fdda79b\"},\"type\":\"rx.SequenceFlow\",\"vertices\":[{\"x\":395,\"y\":470}],\"z\":16},{\"flowType\":\"normal\",\"id\":\"9ccc767f-765f-4dbf-8171-374196cd7588\",\"labels\":[{\"attrs\":{\"text\":{\"text\":\"\"}},\"position\":\"0.5\"}],\"source\":{\"id\":\"e0a0f5ca-2650-4ecc-8a12-80ea3fdda79b\"},\"target\":{\"id\":\"2d0772ed-34f8-4d6d-85d0-1716c1173a54\"},\"type\":\"rx.SequenceFlow\",\"z\":20},{\"flowType\":\"normal\",\"id\":\"7724da81-3fc5-4f4b-8636-256aed407a6e\",\"labels\":[{\"attrs\":{\"text\":{\"text\":\"\"}},\"position\":\"0.5\"}],\"source\":{\"id\":\"6b17a30a-26f4-4eb5-adac-512a0a1e7088\"},\"target\":{\"id\":\"2d0772ed-34f8-4d6d-85d0-1716c1173a54\"},\"type\":\"rx.SequenceFlow\",\"z\":20}]}",
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
    "tags": [
        "5a30545b15c828bf11139ffa453419200d69684e9d423ab2f3e869e6bb386507ee9ee24b1252f990cf587177918283e34694939025cd17154380ba49ce43f330"
    ],
    "description": "Case - TaskFlow Sample Process",
    "overlayGroupId": "Petramco",
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